// assets/js/services/cacheService.js
// ============================================================================
// CACHE SERVICE
// ============================================================================
// Provides localStorage-based caching for Contentful API responses.
// This reduces API calls, improves load times, and enables offline support.
//
// Features:
//   - TTL (time-to-live) support per content type
//   - Automatic expiration checking
//   - Cache versioning (invalidates on schema changes)
//   - Graceful fallback if localStorage is unavailable
//
// Usage:
//   import cacheService from './cacheService.js';
//   
//   // Store data
//   cacheService.set('profile', profileData);
//   
//   // Retrieve data (returns null if expired or not found)
//   const cached = cacheService.get('profile');
//   
//   // Force refresh - bypass cache
//   cacheService.invalidate('profile');
// ============================================================================

import ContentfulConfig from '../config/contentful.config.js';

// Cache version - increment this when you change your Contentful schema
// This ensures old cached data with different structure is invalidated
const CACHE_VERSION = '1.0.0';

// Prefix for all cache keys - prevents conflicts with other localStorage data
const CACHE_PREFIX = 'sarpowsky_contentful_';

class CacheService {
    constructor() {
        // Check if localStorage is available (might not be in some contexts)
        this.isAvailable = this.checkAvailability();
        
        if (!this.isAvailable) {
            console.warn('⚠️ localStorage not available - caching disabled');
        }

        // Clean up any stale cache entries on initialization
        this.cleanup();
    }

    // -------------------------------------------------------------------------
    // AVAILABILITY CHECK
    // -------------------------------------------------------------------------

    /**
     * Checks if localStorage is available and working
     * Some browsers block it in private mode or when storage is full
     */
    checkAvailability() {
        try {
            const testKey = '__cache_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    // -------------------------------------------------------------------------
    // CORE CACHE OPERATIONS
    // -------------------------------------------------------------------------

    /**
     * Retrieves cached data for a content type
     * Returns null if:
     *   - Cache is disabled
     *   - No cached data exists
     *   - Cached data has expired
     *   - Cache version mismatch
     * 
     * @param {string} contentType - The content type key (e.g., 'profile', 'experience')
     * @returns {*} Cached data or null
     */
    get(contentType) {
        // Check if caching is enabled and available
        if (!this.isEnabled() || !this.isAvailable) {
            return null;
        }

        try {
            const key = this.buildKey(contentType);
            const cached = localStorage.getItem(key);

            if (!cached) {
                this.log('miss', contentType, 'No cached data');
                return null;
            }

            const { data, timestamp, version } = JSON.parse(cached);

            // Check cache version - invalidate if schema changed
            if (version !== CACHE_VERSION) {
                this.log('miss', contentType, 'Version mismatch');
                this.invalidate(contentType);
                return null;
            }

            // Check if cache has expired
            if (this.isExpired(contentType, timestamp)) {
                this.log('miss', contentType, 'Expired');
                this.invalidate(contentType);
                return null;
            }

            this.log('hit', contentType);
            return data;

        } catch (error) {
            // JSON parse error or other issues - invalidate and return null
            console.warn(`Cache read error for ${contentType}:`, error.message);
            this.invalidate(contentType);
            return null;
        }
    }

    /**
     * Stores data in cache for a content type
     * @param {string} contentType - The content type key
     * @param {*} data - The data to cache (will be JSON serialized)
     * @returns {boolean} True if successfully cached, false otherwise
     */
    set(contentType, data) {
        // Don't cache if disabled or unavailable
        if (!this.isEnabled() || !this.isAvailable) {
            return false;
        }

        // Don't cache null/undefined data
        if (data === null || data === undefined) {
            return false;
        }

        try {
            const key = this.buildKey(contentType);
            const cacheEntry = {
                data,
                timestamp: Date.now(),
                version: CACHE_VERSION
            };

            localStorage.setItem(key, JSON.stringify(cacheEntry));
            this.log('set', contentType);
            return true;

        } catch (error) {
            // Could be quota exceeded or other storage errors
            console.warn(`Cache write error for ${contentType}:`, error.message);
            
            // If quota exceeded, try clearing old entries and retry
            if (error.name === 'QuotaExceededError') {
                this.clearOldest();
                try {
                    localStorage.setItem(key, JSON.stringify(cacheEntry));
                    return true;
                } catch (e) {
                    // Still failing - give up
                    return false;
                }
            }
            
            return false;
        }
    }

    /**
     * Removes cached data for a specific content type
     * @param {string} contentType - The content type key
     */
    invalidate(contentType) {
        if (!this.isAvailable) return;

        try {
            const key = this.buildKey(contentType);
            localStorage.removeItem(key);
            this.log('invalidate', contentType);
        } catch (error) {
            console.warn(`Cache invalidate error for ${contentType}:`, error.message);
        }
    }

    /**
     * Clears all cached Contentful data
     * Useful when you want to force a complete refresh
     */
    clearAll() {
        if (!this.isAvailable) return;

        try {
            // Only remove our cache entries, not other localStorage data
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CACHE_PREFIX)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));
            this.log('clear', 'all', `Removed ${keysToRemove.length} entries`);

        } catch (error) {
            console.warn('Cache clear error:', error.message);
        }
    }

    // -------------------------------------------------------------------------
    // CACHE-AWARE FETCH WRAPPER
    // -------------------------------------------------------------------------

    /**
     * Wraps an async fetch function with caching
     * This is the main method used by contentFetchers
     * 
     * @param {string} contentType - The content type key
     * @param {Function} fetchFn - Async function that fetches fresh data
     * @param {Object} options - Options like { bypassCache: true }
     * @returns {Promise<*>} Cached data or freshly fetched data
     */
    async getOrFetch(contentType, fetchFn, options = {}) {
        const { bypassCache = false } = options;

        // Try cache first (unless bypassing)
        if (!bypassCache) {
            const cached = this.get(contentType);
            if (cached !== null) {
                return cached;
            }
        }

        // Cache miss or bypass - fetch fresh data
        const freshData = await fetchFn();

        // Cache the result if we got data
        if (freshData !== null) {
            this.set(contentType, freshData);
        }

        return freshData;
    }

    // -------------------------------------------------------------------------
    // HELPER METHODS
    // -------------------------------------------------------------------------

    /**
     * Checks if caching is enabled in config
     */
    isEnabled() {
        return ContentfulConfig.cache?.enabled ?? true;
    }

    /**
     * Builds the localStorage key for a content type
     */
    buildKey(contentType) {
        return `${CACHE_PREFIX}${contentType}`;
    }

    /**
     * Checks if cached data has expired based on TTL settings
     */
    isExpired(contentType, timestamp) {
        const ttl = this.getTTL(contentType);
        const age = Date.now() - timestamp;
        return age > ttl;
    }

    /**
     * Gets the TTL (time-to-live) for a content type from config
     * Falls back to 1 hour if not specified
     */
    getTTL(contentType) {
        const defaultTTL = 60 * 60 * 1000; // 1 hour default
        return ContentfulConfig.cache?.ttl?.[contentType] ?? defaultTTL;
    }

    /**
     * Formats TTL for human-readable display
     */
    formatTTL(contentType) {
        const ttl = this.getTTL(contentType);
        const hours = ttl / (60 * 60 * 1000);
        
        if (hours >= 24) {
            return `${Math.round(hours / 24)} days`;
        } else if (hours >= 1) {
            return `${Math.round(hours)} hours`;
        } else {
            return `${Math.round(hours * 60)} minutes`;
        }
    }

    /**
     * Cleans up expired cache entries
     * Called on initialization
     */
    cleanup() {
        if (!this.isAvailable) return;

        try {
            const contentTypes = Object.keys(ContentfulConfig.contentTypes || {});
            let cleaned = 0;

            contentTypes.forEach(contentType => {
                const key = this.buildKey(contentType);
                const cached = localStorage.getItem(key);
                
                if (cached) {
                    try {
                        const { timestamp, version } = JSON.parse(cached);
                        
                        // Remove if expired or version mismatch
                        if (version !== CACHE_VERSION || this.isExpired(contentType, timestamp)) {
                            localStorage.removeItem(key);
                            cleaned++;
                        }
                    } catch (e) {
                        // Malformed cache entry - remove it
                        localStorage.removeItem(key);
                        cleaned++;
                    }
                }
            });

            if (cleaned > 0) {
                this.log('cleanup', 'complete', `Removed ${cleaned} stale entries`);
            }

        } catch (error) {
            console.warn('Cache cleanup error:', error.message);
        }
    }

    /**
     * Removes the oldest cache entry to free up space
     * Used when storage quota is exceeded
     */
    clearOldest() {
        if (!this.isAvailable) return;

        try {
            let oldestKey = null;
            let oldestTime = Infinity;

            // Find the oldest cache entry
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CACHE_PREFIX)) {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        try {
                            const { timestamp } = JSON.parse(cached);
                            if (timestamp < oldestTime) {
                                oldestTime = timestamp;
                                oldestKey = key;
                            }
                        } catch (e) {
                            // Malformed - this is a good candidate for removal
                            oldestKey = key;
                            break;
                        }
                    }
                }
            }

            if (oldestKey) {
                localStorage.removeItem(oldestKey);
                this.log('evict', oldestKey.replace(CACHE_PREFIX, ''));
            }

        } catch (error) {
            console.warn('Cache eviction error:', error.message);
        }
    }

    /**
     * Returns cache statistics for debugging
     */
    getStats() {
        if (!this.isAvailable) {
            return { available: false };
        }

        const stats = {
            available: true,
            enabled: this.isEnabled(),
            version: CACHE_VERSION,
            entries: {}
        };

        try {
            const contentTypes = Object.keys(ContentfulConfig.contentTypes || {});
            
            contentTypes.forEach(contentType => {
                const key = this.buildKey(contentType);
                const cached = localStorage.getItem(key);
                
                if (cached) {
                    try {
                        const { timestamp, version } = JSON.parse(cached);
                        const age = Date.now() - timestamp;
                        const ttl = this.getTTL(contentType);
                        
                        stats.entries[contentType] = {
                            cached: true,
                            age: this.formatDuration(age),
                            ttl: this.formatTTL(contentType),
                            expired: age > ttl,
                            version
                        };
                    } catch (e) {
                        stats.entries[contentType] = { cached: true, error: 'malformed' };
                    }
                } else {
                    stats.entries[contentType] = { cached: false };
                }
            });

        } catch (error) {
            stats.error = error.message;
        }

        return stats;
    }

    /**
     * Formats duration in human-readable form
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ago`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s ago`;
        } else {
            return `${seconds}s ago`;
        }
    }

    // -------------------------------------------------------------------------
    // LOGGING
    // -------------------------------------------------------------------------

    /**
     * Logs cache operations (only in debug mode)
     */
    log(action, contentType, details = '') {
        if (!ContentfulConfig.debug) return;

        const icons = {
            hit: '✅',
            miss: '⬜',
            set: '💾',
            invalidate: '🗑️',
            clear: '🧹',
            cleanup: '🧽',
            evict: '📤'
        };

        const icon = icons[action] || '📦';
        const message = `${icon} [Cache] ${action}: ${contentType}`;
        
        if (details) {
            console.log(message, `(${details})`);
        } else {
            console.log(message);
        }
    }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

const cacheService = new CacheService();
export { CacheService, CACHE_VERSION, CACHE_PREFIX };
export default cacheService;
