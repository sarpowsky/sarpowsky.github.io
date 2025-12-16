// assets/js/data/content.js
// ============================================================================
// CONTENT DATA MODULE
// ============================================================================
// This module serves as the central hub for all content data.
// It provides both static data (for backward compatibility) and async loaders
// that fetch from Contentful with automatic fallback to static data.
//
// MIGRATION STRATEGY:
// ------------------
// Phase 1 (this file): Export both static and async versions
// Phase 2 (main.js/page.js): Update to use async loaders
// 
// This approach ensures:
//   - Zero breaking changes during migration
//   - Automatic fallback if Contentful is unavailable
//   - Gradual adoption of dynamic content
//
// USAGE:
// ------
// Option 1 - Static (backward compatible):
//   import { profileData, experienceData } from './data/content.js';
//
// Option 2 - Async with fallback (recommended):
//   import { loadProfile, loadAllContent } from './data/content.js';
//   const profile = await loadProfile();
//
// Option 3 - Content Manager:
//   import { contentManager } from './data/content.js';
//   await contentManager.initialize();
//   const profile = contentManager.get('profile');
// ============================================================================

// ---------------------------------------------------------------------------
// STATIC DATA IMPORTS (Fallback)
// ---------------------------------------------------------------------------
// These are the original static data files - they serve as fallbacks
// when Contentful is unavailable or not configured

import { profileData as staticProfileData } from './profileData.js';
import { aboutData as staticAboutData } from './aboutData.js';
import { experienceData as staticExperienceData } from './experienceData.js';
import { projectsData as staticProjectsData } from './projectsData.js';
import { skillsData as staticSkillsData } from './skillsData.js';
import { certificatesData as staticCertificatesData } from './certificatesData.js';

// ---------------------------------------------------------------------------
// CONTENTFUL FETCHERS
// ---------------------------------------------------------------------------
// These fetch fresh data from Contentful CMS

import {
    fetchProfile,
    fetchAbout,
    fetchExperiences,
    fetchProjects,
    fetchSkillCategories,
    fetchCertificates,
    fetchLinkedInPosts,
    fetchAllContent,
    invalidateCache,
    clearAllCache,
    getCacheStats,
    refreshAllContent
} from '../services/contentFetchers.js';

import ContentfulConfig from '../config/contentful.config.js';

// ---------------------------------------------------------------------------
// STATIC DATA EXPORTS (Backward Compatibility)
// ---------------------------------------------------------------------------
// These exports maintain backward compatibility with existing code.
// They return the static data immediately (synchronous).
// 
// IMPORTANT: These will NOT update when you change content in Contentful!
// Use the async loaders (loadProfile, loadExperiences, etc.) for dynamic content.

export const profileData = staticProfileData;
export const aboutData = staticAboutData;
export const experienceData = staticExperienceData;
export const projectsData = staticProjectsData;
export const skillsData = staticSkillsData;
export const certificatesData = staticCertificatesData;

// ---------------------------------------------------------------------------
// ASYNC CONTENT LOADERS
// ---------------------------------------------------------------------------
// These functions fetch from Contentful first, then fall back to static data.
// Use these for dynamic content that updates from the CMS.

/**
 * Loads profile data from Contentful, falls back to static if unavailable
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object>} Profile data
 */
export async function loadProfile(options = {}) {
    try {
        const contentfulData = await fetchProfile(options);
        if (contentfulData) {
            logSource('profile', 'contentful');
            return contentfulData;
        }
    } catch (error) {
        logError('profile', error);
    }
    
    logSource('profile', 'static');
    return staticProfileData;
}

/**
 * Loads about data from Contentful, falls back to static if unavailable
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object>} About data
 */
export async function loadAbout(options = {}) {
    try {
        const contentfulData = await fetchAbout(options);
        if (contentfulData) {
            logSource('about', 'contentful');
            return contentfulData;
        }
    } catch (error) {
        logError('about', error);
    }
    
    logSource('about', 'static');
    return staticAboutData;
}

/**
 * Loads experience data from Contentful, falls back to static if unavailable
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object>} Experience data with title and experiences array
 */
export async function loadExperiences(options = {}) {
    try {
        const contentfulData = await fetchExperiences(options);
        if (contentfulData) {
            logSource('experience', 'contentful');
            return contentfulData;
        }
    } catch (error) {
        logError('experience', error);
    }
    
    logSource('experience', 'static');
    return staticExperienceData;
}

/**
 * Loads projects data from Contentful, falls back to static if unavailable
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object>} Projects data with title and projects array
 */
export async function loadProjects(options = {}) {
    try {
        const contentfulData = await fetchProjects(options);
        if (contentfulData) {
            logSource('project', 'contentful');
            return contentfulData;
        }
    } catch (error) {
        logError('project', error);
    }
    
    logSource('project', 'static');
    return staticProjectsData;
}

/**
 * Loads skills data from Contentful, falls back to static if unavailable
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object>} Skills data with title and categories array
 */
export async function loadSkills(options = {}) {
    try {
        const contentfulData = await fetchSkillCategories(options);
        if (contentfulData) {
            logSource('skills', 'contentful');
            return contentfulData;
        }
    } catch (error) {
        logError('skills', error);
    }
    
    logSource('skills', 'static');
    return staticSkillsData;
}

/**
 * Loads certificates data from Contentful, falls back to static if unavailable
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object>} Certificates data with title and certificates array
 */
export async function loadCertificates(options = {}) {
    try {
        const contentfulData = await fetchCertificates(options);
        if (contentfulData) {
            logSource('certificate', 'contentful');
            return contentfulData;
        }
    } catch (error) {
        logError('certificate', error);
    }
    
    logSource('certificate', 'static');
    return staticCertificatesData;
}

/**
 * Loads LinkedIn posts from Contentful
 * Note: No static fallback - returns empty array if Contentful unavailable
 * (LinkedIn posts are loaded from linkedin-posts.json separately in main.js)
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Array>} Array of LinkedIn posts
 */
export async function loadLinkedInPosts(options = {}) {
    try {
        const contentfulData = await fetchLinkedInPosts(options);
        if (contentfulData) {
            logSource('linkedInPost', 'contentful');
            return contentfulData;
        }
    } catch (error) {
        logError('linkedInPost', error);
    }
    
    // For LinkedIn posts, we return null to signal that the caller should
    // use their own fallback (loading from linkedin-posts.json)
    logSource('linkedInPost', 'fallback-needed');
    return null;
}

/**
 * Loads all content from Contentful with fallbacks
 * @param {Object} options - { bypassCache: boolean }
 * @returns {Promise<Object>} All content data
 */
export async function loadAllContent(options = {}) {
    // Fetch all in parallel for better performance
    const [
        profile,
        about,
        experiences,
        projects,
        skills,
        certificates,
        linkedInPosts
    ] = await Promise.all([
        loadProfile(options),
        loadAbout(options),
        loadExperiences(options),
        loadProjects(options),
        loadSkills(options),
        loadCertificates(options),
        loadLinkedInPosts(options)
    ]);

    return {
        profile,
        about,
        experiences,
        projects,
        skills,
        certificates,
        linkedInPosts
    };
}

// ---------------------------------------------------------------------------
// CONTENT MANAGER CLASS
// ---------------------------------------------------------------------------
// A stateful manager that holds loaded content and provides easy access.
// Useful for apps that need to access content from multiple places.

class ContentManager {
    constructor() {
        this.content = {
            profile: null,
            about: null,
            experiences: null,
            projects: null,
            skills: null,
            certificates: null,
            linkedInPosts: null
        };
        this.isInitialized = false;
        this.isLoading = false;
        this.source = {}; // Track where each content came from
    }

    /**
     * Initializes the content manager by loading all content
     * @param {Object} options - { bypassCache: boolean }
     * @returns {Promise<void>}
     */
    async initialize(options = {}) {
        if (this.isLoading) {
            // Prevent multiple simultaneous initializations
            return this.waitForInitialization();
        }

        this.isLoading = true;
        
        try {
            this.content = await loadAllContent(options);
            this.isInitialized = true;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Waits for an ongoing initialization to complete
     */
    async waitForInitialization() {
        while (this.isLoading) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    /**
     * Gets content by key
     * @param {string} key - Content key (profile, about, experiences, etc.)
     * @returns {*} The content or null if not loaded
     */
    get(key) {
        if (!this.isInitialized) {
            console.warn(`ContentManager: Accessing '${key}' before initialization. Using static fallback.`);
            return this.getStaticFallback(key);
        }
        return this.content[key];
    }

    /**
     * Gets static fallback for a content key
     */
    getStaticFallback(key) {
        const fallbacks = {
            profile: staticProfileData,
            about: staticAboutData,
            experiences: staticExperienceData,
            projects: staticProjectsData,
            skills: staticSkillsData,
            certificates: staticCertificatesData,
            linkedInPosts: null
        };
        return fallbacks[key] || null;
    }

    /**
     * Refreshes all content by bypassing cache
     * @returns {Promise<void>}
     */
    async refresh() {
        await this.initialize({ bypassCache: true });
    }

    /**
     * Refreshes a single content type
     * @param {string} key - Content key to refresh
     * @returns {Promise<*>} The refreshed content
     */
    async refreshOne(key) {
        const loaders = {
            profile: loadProfile,
            about: loadAbout,
            experiences: loadExperiences,
            projects: loadProjects,
            skills: loadSkills,
            certificates: loadCertificates,
            linkedInPosts: loadLinkedInPosts
        };

        const loader = loaders[key];
        if (!loader) {
            console.warn(`ContentManager: Unknown content key '${key}'`);
            return null;
        }

        this.content[key] = await loader({ bypassCache: true });
        return this.content[key];
    }

    /**
     * Gets the current state of the content manager
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            isLoading: this.isLoading,
            contentKeys: Object.keys(this.content),
            loadedKeys: Object.entries(this.content)
                .filter(([_, v]) => v !== null)
                .map(([k, _]) => k)
        };
    }
}

// Create singleton instance
export const contentManager = new ContentManager();

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Checks if Contentful is configured and ready
 * @returns {boolean}
 */
export function isContentfulConfigured() {
    return ContentfulConfig.isConfigured();
}

/**
 * Gets content source information (for debugging)
 * @returns {Object} Cache statistics and source info
 */
export function getContentSourceInfo() {
    return {
        contentfulConfigured: isContentfulConfigured(),
        cacheStats: getCacheStats(),
        debug: ContentfulConfig.debug
    };
}

// Re-export cache management functions for convenience
export { invalidateCache, clearAllCache, getCacheStats, refreshAllContent };

// ---------------------------------------------------------------------------
// LOGGING HELPERS
// ---------------------------------------------------------------------------

/**
 * Logs the source of content (for debugging)
 */
function logSource(contentType, source) {
    if (!ContentfulConfig.debug) return;
    
    const icons = {
        contentful: '☁️',
        static: '📁',
        'fallback-needed': '⚠️'
    };
    
    const icon = icons[source] || '📦';
    console.log(`${icon} [Content] ${contentType}: loaded from ${source}`);
}

/**
 * Logs content loading errors (for debugging)
 */
function logError(contentType, error) {
    if (!ContentfulConfig.debug) return;
    console.error(`💥 [Content] ${contentType}: error loading`, error.message);
}

// ---------------------------------------------------------------------------
// DEFAULT EXPORT
// ---------------------------------------------------------------------------

export default {
    // Static data (backward compatible)
    profileData,
    aboutData,
    experienceData,
    projectsData,
    skillsData,
    certificatesData,
    
    // Async loaders
    loadProfile,
    loadAbout,
    loadExperiences,
    loadProjects,
    loadSkills,
    loadCertificates,
    loadLinkedInPosts,
    loadAllContent,
    
    // Content manager
    contentManager,
    
    // Utilities
    isContentfulConfigured,
    getContentSourceInfo,
    invalidateCache,
    clearAllCache,
    getCacheStats,
    refreshAllContent
};
