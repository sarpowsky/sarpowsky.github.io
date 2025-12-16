// assets/js/services/contentfulService.js
// ============================================================================
// CONTENTFUL SERVICE
// ============================================================================
// This is the core service that handles all communication with Contentful's
// Content Delivery API. It's designed to be robust with proper error handling
// and fallback mechanisms.
// ============================================================================

import ContentfulConfig from '../config/contentful.config.js';

class ContentfulService {
    constructor() {
        // We'll use these to track the service state
        this.isInitialized = false;
        this.lastError = null;
    }

    // -------------------------------------------------------------------------
    // INITIALIZATION & CONFIGURATION
    // -------------------------------------------------------------------------
    
    /**
     * Checks if the service is properly configured and ready to use
     * Returns false if credentials are missing - we'll fall back to static data
     */
    isReady() {
        return ContentfulConfig.isConfigured();
    }

    /**
     * Builds the full API URL for a given endpoint
     * Contentful's API structure: /spaces/{space_id}/environments/{env}/entries
     */
    buildUrl(endpoint, params = {}) {
        const baseUrl = ContentfulConfig.getApiUrl();
        const spaceId = ContentfulConfig.spaceId;
        const environment = ContentfulConfig.environment;
        
        // Start with the base entries endpoint
        let url = `${baseUrl}/spaces/${spaceId}/environments/${environment}/${endpoint}`;
        
        // Add query parameters if any
        const queryParams = new URLSearchParams(params);
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }
        
        return url;
    }

    /**
     * Returns the headers needed for Contentful API requests
     * The Authorization header contains our access token
     */
    getHeaders() {
        return {
            'Authorization': `Bearer ${ContentfulConfig.getAccessToken()}`,
            'Content-Type': 'application/json'
        };
    }

    // -------------------------------------------------------------------------
    // CORE FETCH METHODS
    // -------------------------------------------------------------------------

    /**
     * The main fetch method - handles all the heavy lifting of API communication
     * Includes error handling, logging, and response parsing
     */
    async fetch(endpoint, params = {}) {
        // First, check if we're even configured
        if (!this.isReady()) {
            this.log('warn', 'Contentful not configured, skipping API call');
            return null;
        }

        const url = this.buildUrl(endpoint, params);
        this.log('debug', `Fetching: ${url}`);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            // Handle different HTTP status codes
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ContentfulError(
                    `API request failed: ${response.status} ${response.statusText}`,
                    response.status,
                    errorData
                );
            }

            const data = await response.json();
            this.log('debug', `Received ${data.items?.length || 0} items`);
            
            return data;

        } catch (error) {
            // Store the error for debugging purposes
            this.lastError = error;
            
            // Log appropriately based on error type
            if (error instanceof ContentfulError) {
                this.log('error', `Contentful API Error: ${error.message}`, error.details);
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                // Network error - user might be offline
                this.log('warn', 'Network error - possibly offline');
            } else {
                this.log('error', `Unexpected error: ${error.message}`);
            }

            // Return null to signal that we should use fallback data
            return null;
        }
    }

    /**
     * Fetches all entries of a specific content type
     * This is the most common operation - getting all experiences, all projects, etc.
     */
    async getEntries(contentType, options = {}) {
        // Build the query parameters
        const params = {
            content_type: contentType,
            ...options
        };

        // Add includes to resolve linked entries (like images)
        // Level 2 means we'll get assets and any linked entries
        if (!params.include) {
            params.include = 2;
        }

        const response = await this.fetch('entries', params);
        
        if (!response) {
            return null;
        }

        // Process the response to include resolved assets
        return this.resolveResponse(response);
    }

    /**
     * Fetches a single entry by its ID
     * Useful when you need just one specific piece of content
     */
    async getEntry(entryId, options = {}) {
        const params = {
            ...options,
            include: options.include || 2
        };

        const response = await this.fetch(`entries/${entryId}`, params);
        
        if (!response) {
            return null;
        }

        return this.resolveEntry(response, response.includes);
    }

    /**
     * Fetches a single entry of a content type (like profile or about)
     * These are singleton content types - there's only one of them
     */
    async getSingleEntry(contentType) {
        const response = await this.getEntries(contentType, { limit: 1 });
        
        if (!response || !response.items || response.items.length === 0) {
            return null;
        }

        return response.items[0];
    }

    // -------------------------------------------------------------------------
    // RESPONSE PROCESSING
    // -------------------------------------------------------------------------

    /**
     * Contentful returns linked content (like images) separately in an 'includes' object
     * This method resolves those links so each entry has its assets directly attached
     */
    resolveResponse(response) {
        if (!response || !response.items) {
            return response;
        }

        const { items, includes } = response;
        
        // Resolve each item's links
        const resolvedItems = items.map(item => this.resolveEntry(item, includes));

        return {
            ...response,
            items: resolvedItems
        };
    }

    /**
     * Resolves a single entry's links to their actual content
     * This handles images, linked entries, etc.
     */
    resolveEntry(entry, includes = {}) {
        if (!entry || !entry.fields) {
            return entry;
        }

        const resolvedFields = {};

        // Go through each field and resolve any links
        for (const [key, value] of Object.entries(entry.fields)) {
            resolvedFields[key] = this.resolveField(value, includes);
        }

        return {
            ...entry,
            fields: resolvedFields
        };
    }

    /**
     * Resolves a single field value - handles arrays, links, and nested objects
     */
    resolveField(value, includes) {
        // Handle null/undefined
        if (value === null || value === undefined) {
            return value;
        }

        // Handle arrays (like an array of images or linked entries)
        if (Array.isArray(value)) {
            return value.map(item => this.resolveField(item, includes));
        }

        // Handle Contentful links
        if (value.sys && value.sys.type === 'Link') {
            return this.resolveLink(value, includes);
        }

        // Regular values pass through unchanged
        return value;
    }

    /**
     * Resolves a Contentful link to its actual content
     * Links can point to Assets (images, files) or other Entries
     */
    resolveLink(link, includes = {}) {
        const { linkType, id } = link.sys;

        // Figure out which includes array to search
        let searchArray;
        if (linkType === 'Asset') {
            searchArray = includes.Asset || [];
        } else if (linkType === 'Entry') {
            searchArray = includes.Entry || [];
        } else {
            // Unknown link type - return as-is
            return link;
        }

        // Find the linked item
        const linkedItem = searchArray.find(item => item.sys.id === id);

        if (!linkedItem) {
            // Link couldn't be resolved - might be unpublished
            this.log('warn', `Could not resolve ${linkType} link: ${id}`);
            return null;
        }

        return linkedItem;
    }

    // -------------------------------------------------------------------------
    // ASSET HELPERS
    // -------------------------------------------------------------------------

    /**
     * Extracts the URL from a Contentful asset
     * Assets have a specific structure, this normalizes it to just the URL
     */
    getAssetUrl(asset, options = {}) {
        if (!asset || !asset.fields || !asset.fields.file) {
            return null;
        }

        let url = asset.fields.file.url;

        // Contentful URLs start with // (protocol-relative)
        // Let's make them https for consistency
        if (url.startsWith('//')) {
            url = 'https:' + url;
        }

        // Contentful supports image transformations via URL parameters
        // We can resize, change format, adjust quality, etc.
        if (options.width || options.height || options.format || options.quality) {
            const params = new URLSearchParams();
            
            if (options.width) params.set('w', options.width);
            if (options.height) params.set('h', options.height);
            if (options.format) params.set('fm', options.format);
            if (options.quality) params.set('q', options.quality);
            if (options.fit) params.set('fit', options.fit);
            
            url += (url.includes('?') ? '&' : '?') + params.toString();
        }

        return url;
    }

    /**
     * Gets image details including URL and alt text
     */
    getImageDetails(asset) {
        if (!asset || !asset.fields) {
            return null;
        }

        return {
            url: this.getAssetUrl(asset),
            alt: asset.fields.title || asset.fields.description || '',
            width: asset.fields.file?.details?.image?.width,
            height: asset.fields.file?.details?.image?.height,
            contentType: asset.fields.file?.contentType
        };
    }

    // -------------------------------------------------------------------------
    // LOGGING & DEBUGGING
    // -------------------------------------------------------------------------

    /**
     * Conditional logging based on debug mode
     * Makes it easy to see what's happening during development
     */
    log(level, message, data = null) {
        if (!ContentfulConfig.debug && level === 'debug') {
            return; // Skip debug logs in production
        }

        const prefix = '🌐 [Contentful]';
        
        switch (level) {
            case 'debug':
                console.log(`${prefix} ${message}`, data || '');
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`, data || '');
                break;
            case 'error':
                console.error(`${prefix} ${message}`, data || '');
                break;
            default:
                console.log(`${prefix} ${message}`, data || '');
        }
    }

    /**
     * Returns the last error that occurred (useful for debugging)
     */
    getLastError() {
        return this.lastError;
    }
}

// ============================================================================
// CUSTOM ERROR CLASS
// ============================================================================
// A specialized error class for Contentful-specific errors
// Makes it easier to identify and handle API errors

class ContentfulError extends Error {
    constructor(message, statusCode, details = {}) {
        super(message);
        this.name = 'ContentfulError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

// ============================================================================
// EXPORT
// ============================================================================
// We export a singleton instance so all parts of the app use the same service

const contentfulService = new ContentfulService();
export { ContentfulService, ContentfulError };
export default contentfulService;
