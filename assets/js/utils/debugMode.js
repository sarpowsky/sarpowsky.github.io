// assets/js/utils/debugMode.js
// ============================================================================
// DEBUG MODE UTILITIES
// ============================================================================
// Provides debugging tools for development and troubleshooting.
// These utilities help track content sources, cache status, and performance.
//
// USAGE:
// ------
// Debug mode is automatically enabled when ContentfulConfig.debug = true
// 
// Access debug utilities via window.__portfolioDebug:
//   window.__portfolioDebug.showStats()
//   window.__portfolioDebug.clearCache()
//   window.__portfolioDebug.testContentful()
// ============================================================================

import ContentfulConfig from '../config/contentful.config.js';
import cacheService from '../services/cacheService.js';
import { isContentfulConfigured } from '../data/content.js';

// ---------------------------------------------------------------------------
// DEBUG STATE
// ---------------------------------------------------------------------------

const debugState = {
    enabled: false,
    contentSources: {},
    loadTimes: {},
    errors: [],
    initialized: false
};

// ---------------------------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------------------------

/**
 * Initializes debug mode if enabled in config
 * Call this once during app initialization
 */
export function initDebugMode() {
    debugState.enabled = ContentfulConfig.debug === true;
    
    if (!debugState.enabled) {
        return;
    }
    
    debugState.initialized = true;
    
    // Expose debug utilities to window for console access
    window.__portfolioDebug = {
        showStats: showDebugStats,
        clearCache: () => cacheService.clearAll(),
        getCacheStats: () => cacheService.getStats(),
        testContentful: testContentfulConnection,
        getState: () => debugState,
        getContentSources: () => debugState.contentSources,
        getErrors: () => debugState.errors,
        toggleOverlay: toggleDebugOverlay,
        help: showDebugHelp
    };
    
    // Log initialization
    console.log('%c🔧 Debug Mode Enabled', 'color: #00ff41; font-weight: bold; font-size: 14px;');
    console.log('Access debug utilities via window.__portfolioDebug');
    console.log('Type window.__portfolioDebug.help() for available commands');
    
    // Show Contentful status
    if (isContentfulConfigured()) {
        console.log('%c✓ Contentful configured', 'color: #00ff41;');
    } else {
        console.log('%c⚠ Contentful not configured - using static data', 'color: #ff9800;');
    }
}

// ---------------------------------------------------------------------------
// LOGGING UTILITIES
// ---------------------------------------------------------------------------

/**
 * Logs a debug message with optional data
 * Only logs when debug mode is enabled
 */
export function debugLog(category, message, data = null) {
    if (!debugState.enabled) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] [${category}]`;
    
    if (data) {
        console.log(`%c${prefix}%c ${message}`, 'color: #888;', 'color: inherit;', data);
    } else {
        console.log(`%c${prefix}%c ${message}`, 'color: #888;', 'color: inherit;');
    }
}

/**
 * Logs an error with context
 */
export function debugError(category, message, error = null) {
    if (!debugState.enabled) return;
    
    const errorEntry = {
        timestamp: new Date().toISOString(),
        category,
        message,
        error: error?.message || error
    };
    
    debugState.errors.push(errorEntry);
    
    console.error(`[${category}] ${message}`, error);
}

/**
 * Tracks content source for a specific content type
 */
export function trackContentSource(contentType, source) {
    if (!debugState.enabled) return;
    
    debugState.contentSources[contentType] = {
        source,
        timestamp: new Date().toISOString()
    };
    
    debugLog('Content', `${contentType} loaded from ${source}`);
}

/**
 * Tracks load time for performance monitoring
 */
export function trackLoadTime(label, startTime) {
    if (!debugState.enabled) return;
    
    const duration = performance.now() - startTime;
    debugState.loadTimes[label] = duration;
    
    const color = duration < 100 ? '#00ff41' : duration < 500 ? '#ff9800' : '#ff0000';
    console.log(`%c⏱ ${label}: ${duration.toFixed(2)}ms`, `color: ${color};`);
}

// ---------------------------------------------------------------------------
// DEBUG DISPLAY
// ---------------------------------------------------------------------------

/**
 * Shows comprehensive debug statistics
 */
function showDebugStats() {
    console.group('%c📊 Portfolio Debug Stats', 'font-size: 14px; font-weight: bold;');
    
    // Contentful Status
    console.group('Contentful');
    console.log('Configured:', isContentfulConfigured());
    console.log('Space ID:', ContentfulConfig.spaceId ? '✓ Set' : '✗ Missing');
    console.log('Access Token:', ContentfulConfig.accessToken ? '✓ Set' : '✗ Missing');
    console.groupEnd();
    
    // Content Sources
    console.group('Content Sources');
    Object.entries(debugState.contentSources).forEach(([type, info]) => {
        const icon = info.source === 'contentful' ? '🌐' : info.source === 'cache' ? '💾' : '📁';
        console.log(`${icon} ${type}: ${info.source}`);
    });
    console.groupEnd();
    
    // Cache Stats
    console.group('Cache');
    const cacheStats = cacheService.getStats();
    console.log('Available:', cacheStats.available);
    console.log('Enabled:', cacheStats.enabled);
    console.log('Version:', cacheStats.version);
    console.log('Entries:', Object.keys(cacheStats.entries || {}).length);
    
    // Show individual entry status
    if (cacheStats.entries) {
        Object.entries(cacheStats.entries).forEach(([type, info]) => {
            if (info.cached) {
                console.log(`  ${type}: cached (${info.age}, TTL: ${info.ttl})`);
            } else {
                console.log(`  ${type}: not cached`);
            }
        });
    }
    console.groupEnd();
    
    // Load Times
    if (Object.keys(debugState.loadTimes).length > 0) {
        console.group('Load Times');
        Object.entries(debugState.loadTimes).forEach(([label, time]) => {
            console.log(`${label}: ${time.toFixed(2)}ms`);
        });
        console.groupEnd();
    }
    
    // Errors
    if (debugState.errors.length > 0) {
        console.group('Errors');
        debugState.errors.forEach(err => {
            console.error(`[${err.category}] ${err.message}`);
        });
        console.groupEnd();
    }
    
    console.groupEnd();
}

/**
 * Tests Contentful connection and displays results
 */
async function testContentfulConnection() {
    console.group('%c🔌 Testing Contentful Connection', 'font-size: 14px; font-weight: bold;');
    
    if (!isContentfulConfigured()) {
        console.error('Contentful is not configured. Check contentful.config.js');
        console.groupEnd();
        return false;
    }
    
    try {
        const { spaceId, accessToken, environment, baseUrl } = ContentfulConfig;
        const url = `${baseUrl}/spaces/${spaceId}/environments/${environment}/entries?limit=1`;
        
        console.log('Testing URL:', url);
        
        const startTime = performance.now();
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const duration = performance.now() - startTime;
        
        if (response.ok) {
            const data = await response.json();
            console.log('%c✓ Connection successful', 'color: #00ff41;');
            console.log(`Response time: ${duration.toFixed(2)}ms`);
            console.log(`Total entries in space: ${data.total}`);
            console.groupEnd();
            return true;
        } else {
            console.error(`✗ Connection failed: ${response.status} ${response.statusText}`);
            const errorData = await response.json().catch(() => ({}));
            console.error('Error details:', errorData);
            console.groupEnd();
            return false;
        }
    } catch (error) {
        console.error('✗ Connection error:', error.message);
        console.groupEnd();
        return false;
    }
}

/**
 * Toggles the debug overlay on the page
 */
function toggleDebugOverlay() {
    let overlay = document.getElementById('debug-overlay');
    
    if (overlay) {
        overlay.remove();
        return;
    }
    
    overlay = document.createElement('div');
    overlay.id = 'debug-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ff41;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 99999;
        max-width: 300px;
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid #00ff41;
    `;
    
    const updateOverlay = () => {
        const cacheStats = cacheService.getStats();
        const entryCount = Object.keys(cacheStats.entries || {}).length;
        const cachedCount = Object.values(cacheStats.entries || {}).filter(e => e.cached).length;
        
        overlay.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">
                🔧 Debug Overlay
                <span style="float: right; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">✕</span>
            </div>
            <div style="margin-bottom: 8px;">
                <strong>Contentful:</strong> ${isContentfulConfigured() ? '✓ Connected' : '✗ Not configured'}
            </div>
            <div style="margin-bottom: 8px;">
                <strong>Cache:</strong> ${cachedCount}/${entryCount} types cached
            </div>
            <div style="margin-bottom: 8px;">
                <strong>Content Sources:</strong>
                ${Object.entries(debugState.contentSources).map(([type, info]) => `
                    <div style="margin-left: 10px; color: ${info.source === 'contentful' ? '#00ff41' : '#ff9800'};">
                        ${type}: ${info.source}
                    </div>
                `).join('')}
            </div>
            ${debugState.errors.length > 0 ? `
                <div style="color: #ff0000;">
                    <strong>Errors:</strong> ${debugState.errors.length}
                </div>
            ` : ''}
            <div style="margin-top: 10px; font-size: 10px; color: #666;">
                Last updated: ${new Date().toLocaleTimeString()}
            </div>
        `;
    };
    
    updateOverlay();
    document.body.appendChild(overlay);
    
    // Update every 5 seconds
    const intervalId = setInterval(() => {
        if (!document.getElementById('debug-overlay')) {
            clearInterval(intervalId);
            return;
        }
        updateOverlay();
    }, 5000);
}

/**
 * Shows available debug commands
 */
function showDebugHelp() {
    console.log(`
%c📖 Portfolio Debug Commands
%c─────────────────────────────────────────

%cwindow.__portfolioDebug.showStats()%c
  Show comprehensive debug statistics

%cwindow.__portfolioDebug.clearCache()%c
  Clear all cached content

%cwindow.__portfolioDebug.getCacheStats()%c
  Get cache statistics

%cwindow.__portfolioDebug.testContentful()%c
  Test Contentful API connection

%cwindow.__portfolioDebug.getContentSources()%c
  Get content source for each type

%cwindow.__portfolioDebug.getErrors()%c
  Get list of errors

%cwindow.__portfolioDebug.toggleOverlay()%c
  Toggle debug overlay on page

%cwindow.__portfolioDebug.getState()%c
  Get full debug state object
`,
        'font-size: 14px; font-weight: bold; color: #00ff41;',
        'color: #666;',
        'color: #00bcd4;', 'color: inherit;',
        'color: #00bcd4;', 'color: inherit;',
        'color: #00bcd4;', 'color: inherit;',
        'color: #00bcd4;', 'color: inherit;',
        'color: #00bcd4;', 'color: inherit;',
        'color: #00bcd4;', 'color: inherit;',
        'color: #00bcd4;', 'color: inherit;',
        'color: #00bcd4;', 'color: inherit;'
    );
}

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Formats bytes to human-readable string
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

export default {
    initDebugMode,
    debugLog,
    debugError,
    trackContentSource,
    trackLoadTime,
    isEnabled: () => debugState.enabled
};
