// assets/js/services/contentFetchers.js
// ============================================================================
// CONTENT FETCHERS
// ============================================================================
// This module provides clean, easy-to-use functions for fetching content.
// Each fetcher:
//   1. Calls the Contentful service to get raw data
//   2. Transforms the response to match our app's expected format
//   3. Handles errors gracefully (returns null on failure)
//
// Usage:
//   import { fetchProfile, fetchExperiences } from './services/contentFetchers.js';
//   
//   const profile = await fetchProfile();
//   const experiences = await fetchExperiences();
//
// These fetchers are the "public API" - the rest of the app should use these
// rather than calling contentfulService directly.
// ============================================================================

import contentfulService from './contentfulService.js';
import ContentfulConfig from '../config/contentful.config.js';

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
 * @returns {Promise<Object|null>} Profile data or null if fetch fails
 */
export async function fetchProfile() {
    try {
        // Check if Contentful is configured - if not, return null immediately
        // The calling code will handle fallback to static data
        if (!contentfulService.isReady()) {
            logFetch('profile', 'skipped', 'Contentful not configured');
            return null;
        }

        logFetch('profile', 'fetching');
        
        const response = await contentfulService.getEntries(
            ContentfulConfig.contentTypes.profile,
            { limit: 1 }
        );

        if (!response) {
            logFetch('profile', 'failed', 'No response from API');
            return null;
        }

        const transformed = transformProfileResponse(response);
        logFetch('profile', 'success');
        
        return transformed;

    } catch (error) {
        logFetch('profile', 'error', error.message);
        return null;
    }
}

/**
 * Fetches the about page data (greeting, subtitle, paragraphs)
 * This is singleton content - only one about entry should exist
 * @returns {Promise<Object|null>} About data or null if fetch fails
 */
export async function fetchAbout() {
    try {
        if (!contentfulService.isReady()) {
            logFetch('about', 'skipped', 'Contentful not configured');
            return null;
        }

        logFetch('about', 'fetching');

        const response = await contentfulService.getEntries(
            ContentfulConfig.contentTypes.about,
            { limit: 1 }
        );

        if (!response) {
            logFetch('about', 'failed', 'No response from API');
            return null;
        }

        const transformed = transformAboutResponse(response);
        logFetch('about', 'success');
        
        return transformed;

    } catch (error) {
        logFetch('about', 'error', error.message);
        return null;
    }
}

// ============================================================================
// COLLECTION CONTENT FETCHERS
// ============================================================================
// These fetch content types where multiple entries exist

/**
 * Fetches all experience entries, sorted by order field
 * @returns {Promise<Object|null>} Object with title and experiences array
 */
export async function fetchExperiences() {
    try {
        if (!contentfulService.isReady()) {
            logFetch('experience', 'skipped', 'Contentful not configured');
            return null;
        }

        logFetch('experience', 'fetching');

        // Fetch all experiences, sorted by order field
        // We request ordering from Contentful to reduce client-side processing
        const response = await contentfulService.getEntries(
            ContentfulConfig.contentTypes.experience,
            { 
                order: 'fields.order',
                limit: 100  // Reasonable limit - you probably won't have 100 jobs!
            }
        );

        if (!response) {
            logFetch('experience', 'failed', 'No response from API');
            return null;
        }

        const transformed = transformExperienceResponse(response);
        logFetch('experience', 'success', `${transformed?.experiences?.length || 0} items`);
        
        return transformed;

    } catch (error) {
        logFetch('experience', 'error', error.message);
        return null;
    }
}

/**
 * Fetches all project entries, sorted by order field
 * @returns {Promise<Object|null>} Object with title and projects array
 */
export async function fetchProjects() {
    try {
        if (!contentfulService.isReady()) {
            logFetch('project', 'skipped', 'Contentful not configured');
            return null;
        }

        logFetch('project', 'fetching');

        const response = await contentfulService.getEntries(
            ContentfulConfig.contentTypes.project,
            { 
                order: 'fields.order',
                limit: 100
            }
        );

        if (!response) {
            logFetch('project', 'failed', 'No response from API');
            return null;
        }

        const transformed = transformProjectResponse(response);
        logFetch('project', 'success', `${transformed?.projects?.length || 0} items`);
        
        return transformed;

    } catch (error) {
        logFetch('project', 'error', error.message);
        return null;
    }
}

/**
 * Fetches all skill categories with their skills, sorted by order
 * @returns {Promise<Object|null>} Object with title and categories array
 */
export async function fetchSkillCategories() {
    try {
        if (!contentfulService.isReady()) {
            logFetch('skillCategory', 'skipped', 'Contentful not configured');
            return null;
        }

        logFetch('skillCategory', 'fetching');

        const response = await contentfulService.getEntries(
            ContentfulConfig.contentTypes.skillCategory,
            { 
                order: 'fields.order',
                limit: 50
            }
        );

        if (!response) {
            logFetch('skillCategory', 'failed', 'No response from API');
            return null;
        }

        const transformed = transformSkillCategoryResponse(response);
        logFetch('skillCategory', 'success', `${transformed?.categories?.length || 0} categories`);
        
        return transformed;

    } catch (error) {
        logFetch('skillCategory', 'error', error.message);
        return null;
    }
}

/**
 * Fetches all certificates, sorted by order field
 * @returns {Promise<Object|null>} Object with title and certificates array
 */
export async function fetchCertificates() {
    try {
        if (!contentfulService.isReady()) {
            logFetch('certificate', 'skipped', 'Contentful not configured');
            return null;
        }

        logFetch('certificate', 'fetching');

        const response = await contentfulService.getEntries(
            ContentfulConfig.contentTypes.certificate,
            { 
                order: 'fields.order',
                limit: 100
            }
        );

        if (!response) {
            logFetch('certificate', 'failed', 'No response from API');
            return null;
        }

        const transformed = transformCertificateResponse(response);
        logFetch('certificate', 'success', `${transformed?.certificates?.length || 0} items`);
        
        return transformed;

    } catch (error) {
        logFetch('certificate', 'error', error.message);
        return null;
    }
}

/**
 * Fetches all LinkedIn posts, sorted by date (newest first)
 * @returns {Promise<Array|null>} Array of posts or null if fetch fails
 */
export async function fetchLinkedInPosts() {
    try {
        if (!contentfulService.isReady()) {
            logFetch('linkedInPost', 'skipped', 'Contentful not configured');
            return null;
        }

        logFetch('linkedInPost', 'fetching');

        // Sort by date descending (newest first)
        // Note: Contentful uses '-' prefix for descending order
        const response = await contentfulService.getEntries(
            ContentfulConfig.contentTypes.linkedInPost,
            { 
                order: '-fields.date',
                limit: 20  // Only show recent posts
            }
        );

        if (!response) {
            logFetch('linkedInPost', 'failed', 'No response from API');
            return null;
        }

        const transformed = transformLinkedInPostResponse(response);
        logFetch('linkedInPost', 'success', `${transformed?.length || 0} posts`);
        
        return transformed;

    } catch (error) {
        logFetch('linkedInPost', 'error', error.message);
        return null;
    }
}

// ============================================================================
// BATCH FETCHER
// ============================================================================
// Fetch all content at once - useful for initial page load

/**
 * Fetches all content types in parallel
 * This is more efficient than sequential fetches for initial page load
 * @returns {Promise<Object>} Object containing all content (some may be null if fetch failed)
 */
export async function fetchAllContent() {
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
        fetchProfile(),
        fetchAbout(),
        fetchExperiences(),
        fetchProjects(),
        fetchSkillCategories(),
        fetchCertificates(),
        fetchLinkedInPosts()
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
        complete: '🎉'
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
    fetchProfile,
    fetchAbout,
    fetchExperiences,
    fetchProjects,
    fetchSkillCategories,
    fetchCertificates,
    fetchLinkedInPosts,
    fetchAllContent
};
