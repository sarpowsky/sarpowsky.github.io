// assets/js/services/contentFetchers.js
// ============================================================================
// CONTENT FETCHERS
// ============================================================================
// This module provides clean, easy-to-use functions for fetching content.
// Each fetcher:
//   1. Checks cache for existing data (if not bypassed)
//   2. Calls the Contentful service to get raw data if needed
//   3. Transforms the response to match our app's expected format
//   4. Caches the result for future requests
//   5. Handles errors gracefully (returns null on failure)
//
// Usage:
//   import { fetchProfile, fetchExperiences } from './services/contentFetchers.js';
//   
//   const profile = await fetchProfile();
//   const experiences = await fetchExperiences();
//   
//   // Force refresh - bypass cache
//   const fresh = await fetchProfile({ bypassCache: true });
//
// These fetchers are the "public API" - the rest of the app should use these
// rather than calling contentfulService directly.
// ============================================================================

import contentfulService from './contentfulService.js';
import ContentfulConfig from '../config/contentful.config.js';
import cacheService from './cacheService.js';

// Import all transformers
import {
    transformProfileResponse,
    transformAboutResponse,
    transformExperienceResponse,
    transformProjectResponse,
    transformSkillCategoryResponse,
    transformCertificateResponse,
    transformLinkedInPostResponse
} from './transformers/index.js';

// ============================================================================
// SINGLETON CONTENT FETCHERS
// ============================================================================
// These fetch content types where only one entry exists (profile, about)

/**
 * Fetches the profile data (name, title, social links, profile image)
 * This is singleton content - only one profile entry should exist
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object|null>} Profile data or null if fetch fails
 */
export async function fetchProfile(options = {}) {
    const contentType = 'profile';
    
    // Use cache wrapper - handles caching logic automatically
    return cacheService.getOrFetch(
        contentType,
        async () => {
            try {
                // Check if Contentful is configured
                if (!contentfulService.isReady()) {
                    logFetch(contentType, 'skipped', 'Contentful not configured');
                    return null;
                }

                logFetch(contentType, 'fetching');
                
                const response = await contentfulService.getEntries(
                    ContentfulConfig.contentTypes.profile,
                    { limit: 1 }
                );

                if (!response) {
                    logFetch(contentType, 'failed', 'No response from API');
                    return null;
                }

                const transformed = transformProfileResponse(response);
                logFetch(contentType, 'success');
                
                return transformed;

            } catch (error) {
                logFetch(contentType, 'error', error.message);
                return null;
            }
        },
        options
    );
}

/**
 * Fetches the about page data (greeting, subtitle, paragraphs)
 * This is singleton content - only one about entry should exist
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object|null>} About data or null if fetch fails
 */
export async function fetchAbout(options = {}) {
    const contentType = 'about';
    
    return cacheService.getOrFetch(
        contentType,
        async () => {
            try {
                if (!contentfulService.isReady()) {
                    logFetch(contentType, 'skipped', 'Contentful not configured');
                    return null;
                }

                logFetch(contentType, 'fetching');

                const response = await contentfulService.getEntries(
                    ContentfulConfig.contentTypes.about,
                    { limit: 1 }
                );

                if (!response) {
                    logFetch(contentType, 'failed', 'No response from API');
                    return null;
                }

                const transformed = transformAboutResponse(response);
                logFetch(contentType, 'success');
                
                return transformed;

            } catch (error) {
                logFetch(contentType, 'error', error.message);
                return null;
            }
        },
        options
    );
}

// ============================================================================
// COLLECTION CONTENT FETCHERS
// ============================================================================
// These fetch content types where multiple entries exist

/**
 * Fetches all experience entries, sorted by order field
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object|null>} Object with title and experiences array
 */
export async function fetchExperiences(options = {}) {
    const contentType = 'experience';
    
    return cacheService.getOrFetch(
        contentType,
        async () => {
            try {
                if (!contentfulService.isReady()) {
                    logFetch(contentType, 'skipped', 'Contentful not configured');
                    return null;
                }

                logFetch(contentType, 'fetching');

                // Fetch all experiences, sorted by order field
                const response = await contentfulService.getEntries(
                    ContentfulConfig.contentTypes.experience,
                    { 
                        order: 'fields.order',
                        limit: 100
                    }
                );

                if (!response) {
                    logFetch(contentType, 'failed', 'No response from API');
                    return null;
                }

                const transformed = transformExperienceResponse(response);
                logFetch(contentType, 'success', `${transformed?.experiences?.length || 0} items`);
                
                return transformed;

            } catch (error) {
                logFetch(contentType, 'error', error.message);
                return null;
            }
        },
        options
    );
}

/**
 * Fetches all project entries, sorted by order field
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object|null>} Object with title and projects array
 */
export async function fetchProjects(options = {}) {
    const contentType = 'project';
    
    return cacheService.getOrFetch(
        contentType,
        async () => {
            try {
                if (!contentfulService.isReady()) {
                    logFetch(contentType, 'skipped', 'Contentful not configured');
                    return null;
                }

                logFetch(contentType, 'fetching');

                const response = await contentfulService.getEntries(
                    ContentfulConfig.contentTypes.project,
                    { 
                        order: 'fields.order',
                        limit: 100
                    }
                );

                if (!response) {
                    logFetch(contentType, 'failed', 'No response from API');
                    return null;
                }

                const transformed = transformProjectResponse(response);
                logFetch(contentType, 'success', `${transformed?.projects?.length || 0} items`);
                
                return transformed;

            } catch (error) {
                logFetch(contentType, 'error', error.message);
                return null;
            }
        },
        options
    );
}

/**
 * Fetches all skill categories with their skills, sorted by order
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object|null>} Object with title and categories array
 */
export async function fetchSkillCategories(options = {}) {
    const contentType = 'skillCategory';
    
    return cacheService.getOrFetch(
        contentType,
        async () => {
            try {
                if (!contentfulService.isReady()) {
                    logFetch(contentType, 'skipped', 'Contentful not configured');
                    return null;
                }

                logFetch(contentType, 'fetching');

                const response = await contentfulService.getEntries(
                    ContentfulConfig.contentTypes.skillCategory,
                    { 
                        order: 'fields.order',
                        limit: 50
                    }
                );

                if (!response) {
                    logFetch(contentType, 'failed', 'No response from API');
                    return null;
                }

                const transformed = transformSkillCategoryResponse(response);
                logFetch(contentType, 'success', `${transformed?.categories?.length || 0} categories`);
                
                return transformed;

            } catch (error) {
                logFetch(contentType, 'error', error.message);
                return null;
            }
        },
        options
    );
}

/**
 * Fetches all certificates, sorted by order field
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object|null>} Object with title and certificates array
 */
export async function fetchCertificates(options = {}) {
    const contentType = 'certificate';
    
    return cacheService.getOrFetch(
        contentType,
        async () => {
            try {
                if (!contentfulService.isReady()) {
                    logFetch(contentType, 'skipped', 'Contentful not configured');
                    return null;
                }

                logFetch(contentType, 'fetching');

                const response = await contentfulService.getEntries(
                    ContentfulConfig.contentTypes.certificate,
                    { 
                        order: 'fields.order',
                        limit: 100
                    }
                );

                if (!response) {
                    logFetch(contentType, 'failed', 'No response from API');
                    return null;
                }

                const transformed = transformCertificateResponse(response);
                logFetch(contentType, 'success', `${transformed?.certificates?.length || 0} items`);
                
                return transformed;

            } catch (error) {
                logFetch(contentType, 'error', error.message);
                return null;
            }
        },
        options
    );
}

/**
 * Fetches all LinkedIn posts, sorted by date (newest first)
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Array|null>} Array of posts or null if fetch fails
 */
export async function fetchLinkedInPosts(options = {}) {
    const contentType = 'linkedInPost';
    
    return cacheService.getOrFetch(
        contentType,
        async () => {
            try {
                if (!contentfulService.isReady()) {
                    logFetch(contentType, 'skipped', 'Contentful not configured');
                    return null;
                }

                logFetch(contentType, 'fetching');

                // Sort by date descending (newest first)
                const response = await contentfulService.getEntries(
                    ContentfulConfig.contentTypes.linkedInPost,
                    { 
                        order: '-fields.date',
                        limit: 20
                    }
                );

                if (!response) {
                    logFetch(contentType, 'failed', 'No response from API');
                    return null;
                }

                const transformed = transformLinkedInPostResponse(response);
                logFetch(contentType, 'success', `${transformed?.length || 0} posts`);
                
                return transformed;

            } catch (error) {
                logFetch(contentType, 'error', error.message);
                return null;
            }
        },
        options
    );
}

// ============================================================================
// BATCH FETCHER
// ============================================================================
// Fetch all content at once - useful for initial page load

/**
 * Fetches all content types in parallel
 * This is more efficient than sequential fetches for initial page load
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object>} Object containing all content (some may be null if fetch failed)
 */
export async function fetchAllContent(options = {}) {
    logFetch('all', 'fetching', 'Batch fetch starting...');

    // Fire all requests in parallel for better performance
    const [
        profile,
        about,
        experiences,
        projects,
        skills,
        certificates,
        linkedInPosts
    ] = await Promise.all([
        fetchProfile(options),
        fetchAbout(options),
        fetchExperiences(options),
        fetchProjects(options),
        fetchSkillCategories(options),
        fetchCertificates(options),
        fetchLinkedInPosts(options)
    ]);

    const result = {
        profile,
        about,
        experiences,      // Note: This contains { title, experiences: [...] }
        projects,         // Note: This contains { title, projects: [...] }
        skills,           // Note: This contains { title, categories: [...] }
        certificates,     // Note: This contains { title, certificates: [...] }
        linkedInPosts     // Note: This is just an array [...]
    };

    // Count how many succeeded
    const successCount = Object.values(result).filter(v => v !== null).length;
    logFetch('all', 'complete', `${successCount}/7 content types fetched`);

    return result;
}

// ============================================================================
// CACHE MANAGEMENT UTILITIES
// ============================================================================
// These functions help manage the cache from outside this module

/**
 * Invalidates cache for a specific content type, forcing a fresh fetch next time
 * @param {string} contentType - The content type to invalidate
 */
export function invalidateCache(contentType) {
    cacheService.invalidate(contentType);
}

/**
 * Clears all cached content, forcing fresh fetches for everything
 */
export function clearAllCache() {
    cacheService.clearAll();
}

/**
 * Gets cache statistics for debugging
 * @returns {Object} Cache stats including what's cached and expiration info
 */
export function getCacheStats() {
    return cacheService.getStats();
}

/**
 * Refreshes all content by bypassing cache
 * Useful for a "refresh" button or after content updates
 * @returns {Promise<Object>} Freshly fetched content
 */
export async function refreshAllContent() {
    return fetchAllContent({ bypassCache: true });
}

// ============================================================================
// LOGGING HELPER
// ============================================================================

/**
 * Logs fetch operations in a consistent format (only when debug is enabled)
 */
function logFetch(contentType, status, details = '') {
    if (!ContentfulConfig.debug) return;

    const icons = {
        fetching: '🔄',
        success: '✅',
        failed: '❌',
        error: '💥',
        skipped: '⏭️',
        complete: '🎉',
        cached: '📦'
    };

    const icon = icons[status] || '📦';
    const message = `${icon} [Fetcher] ${contentType}: ${status}`;
    
    if (details) {
        console.log(message, `(${details})`);
    } else {
        console.log(message);
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Content fetchers
    fetchProfile,
    fetchAbout,
    fetchExperiences,
    fetchProjects,
    fetchSkillCategories,
    fetchCertificates,
    fetchLinkedInPosts,
    fetchAllContent,
    
    // Cache management
    invalidateCache,
    clearAllCache,
    getCacheStats,
    refreshAllContent
};
