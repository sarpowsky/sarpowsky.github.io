// assets/js/utils/loadingHelper.js
// ============================================================================
// LOADING HELPER - Utility Functions for Loading States
// ============================================================================
// Provides easy-to-use functions for showing/hiding loading indicators,
// creating skeleton loaders, and managing content transitions.
//
// USAGE:
// ------
// import { showLoading, hideLoading, createSkeleton } from './utils/loadingHelper.js';
// 
// // Show spinner while loading
// showLoading(container, 'spinner');
// await fetchContent();
// hideLoading(container);
//
// // Show skeleton placeholders
// showLoading(container, 'skeleton', { type: 'cards', count: 3 });
// ============================================================================

// ---------------------------------------------------------------------------
// SKELETON TEMPLATES
// ---------------------------------------------------------------------------

// Templates for different content types - these mimic the actual content shape
const skeletonTemplates = {
    
    // Profile skeleton (homepage left column)
    profile: () => `
        <div class="skeleton-profile">
            <div class="skeleton skeleton-avatar"></div>
            <div class="skeleton skeleton-name"></div>
            <div class="skeleton skeleton-title"></div>
        </div>
    `,
    
    // Experience card skeleton
    experienceCard: () => `
        <div class="skeleton-experience-card">
            <div class="skeleton skeleton-logo"></div>
            <div class="skeleton-info">
                <div class="skeleton skeleton-text medium"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-text short"></div>
            </div>
        </div>
    `,
    
    // Project card skeleton
    projectCard: () => `
        <div class="skeleton-card bg-gray p-6 rounded-lg">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text medium"></div>
            <div class="skeleton skeleton-text short"></div>
            <div class="skeleton skeleton-button" style="margin-top: 1rem;"></div>
        </div>
    `,
    
    // Skill category skeleton
    skillCategory: () => `
        <div class="bg-gray p-6 rounded-lg">
            <div class="skeleton skeleton-title" style="width: 40%;"></div>
            ${Array(4).fill().map(() => `
                <div class="skeleton-skill-bar">
                    <div class="skeleton-label">
                        <span class="skeleton"></span>
                        <span class="skeleton"></span>
                    </div>
                    <div class="skeleton skeleton-progress"></div>
                </div>
            `).join('')}
        </div>
    `,
    
    // Certificate card skeleton
    certificateCard: () => `
        <div class="certificate-card bg-gray p-0 rounded-lg">
            <div class="skeleton skeleton-image" style="height: 192px; border-radius: 8px 8px 0 0;"></div>
            <div style="padding: 1rem;">
                <div class="skeleton skeleton-text medium"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-text short" style="width: 30%;"></div>
            </div>
        </div>
    `,
    
    // LinkedIn post skeleton
    linkedInPost: () => `
        <div class="skeleton" style="height: 200px; border-radius: 8px; padding: 1rem;">
            <div class="skeleton skeleton-text medium" style="background: rgba(255,255,255,0.1);"></div>
            <div class="skeleton skeleton-text" style="background: rgba(255,255,255,0.1); margin-top: 0.5rem;"></div>
            <div class="skeleton skeleton-text" style="background: rgba(255,255,255,0.1); margin-top: 0.5rem;"></div>
            <div class="skeleton skeleton-text short" style="background: rgba(255,255,255,0.1); margin-top: 0.5rem;"></div>
        </div>
    `,
    
    // About page skeleton
    about: () => `
        <div style="text-align: center;">
            <div class="skeleton skeleton-title" style="width: 100px; margin: 0 auto 1rem;"></div>
            <div class="skeleton skeleton-title" style="width: 200px; margin: 0 auto 2rem;"></div>
            <div class="skeleton skeleton-text" style="width: 60%; margin: 0 auto 0.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 90%; margin: 0 auto 1.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 85%; margin: 0 auto 0.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 80%; margin: 0 auto 0.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 70%; margin: 0 auto;"></div>
        </div>
    `,
    
    // GitHub calendar skeleton
    githubCalendar: () => `
        <div style="text-align: center;">
            <div class="skeleton skeleton-title" style="width: 200px; margin: 0 auto 1rem;"></div>
            <div class="skeleton" style="height: 100px; max-width: 800px; margin: 0 auto; border-radius: 8px;"></div>
        </div>
    `
};

// ---------------------------------------------------------------------------
// LOADING STATE MANAGEMENT
// ---------------------------------------------------------------------------

/**
 * Shows a loading indicator in the specified container
 * @param {HTMLElement|string} container - Container element or selector
 * @param {string} type - Type of loading indicator: 'spinner', 'skeleton', 'overlay'
 * @param {Object} options - Additional options
 * @param {string} options.skeletonType - Type of skeleton template to use
 * @param {number} options.count - Number of skeleton items to show
 * @param {string} options.message - Loading message to display
 */
export function showLoading(container, type = 'spinner', options = {}) {
    const element = typeof container === 'string' 
        ? document.querySelector(container) 
        : container;
    
    if (!element) {
        console.warn('Loading container not found:', container);
        return;
    }
    
    // Store original content so we can restore it later
    if (!element.dataset.originalContent) {
        element.dataset.originalContent = element.innerHTML;
    }
    
    // Mark as loading
    element.classList.add('content-loading');
    element.dataset.loadingType = type;
    
    switch (type) {
        case 'spinner':
            showSpinner(element, options);
            break;
        case 'skeleton':
            showSkeleton(element, options);
            break;
        case 'overlay':
            showOverlay(element, options);
            break;
        default:
            showSpinner(element, options);
    }
}

/**
 * Hides the loading indicator and optionally shows new content
 * @param {HTMLElement|string} container - Container element or selector
 * @param {string} newContent - Optional new content to display
 * @param {boolean} animate - Whether to animate the content in
 */
export function hideLoading(container, newContent = null, animate = true) {
    const element = typeof container === 'string' 
        ? document.querySelector(container) 
        : container;
    
    if (!element) return;
    
    // Remove loading state
    element.classList.remove('content-loading');
    
    // Remove any loading indicators we added
    const loadingIndicator = element.querySelector('.loading-indicator-wrapper');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
    
    const overlay = element.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
    
    // If new content provided, use it; otherwise restore original
    if (newContent !== null) {
        element.innerHTML = newContent;
    } else if (element.dataset.originalContent) {
        // Only restore if we haven't received new content
        // This check prevents overwriting dynamically loaded content
    }
    
    // Add animation class if requested
    if (animate) {
        element.classList.add('content-loaded');
        // Remove animation class after it completes
        setTimeout(() => element.classList.remove('content-loaded'), 300);
    }
    
    // Clean up data attributes
    delete element.dataset.loadingType;
}

// ---------------------------------------------------------------------------
// LOADING INDICATOR IMPLEMENTATIONS
// ---------------------------------------------------------------------------

/**
 * Shows a spinner in the container
 */
function showSpinner(element, options = {}) {
    const { message = 'Loading...' } = options;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'loading-indicator-wrapper';
    wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 150px;
        gap: 1rem;
    `;
    
    wrapper.innerHTML = `
        <div class="loading-spinner large"></div>
        ${message ? `<p class="loading-overlay-text">${message}</p>` : ''}
    `;
    
    element.innerHTML = '';
    element.appendChild(wrapper);
}

/**
 * Shows skeleton placeholders in the container
 */
function showSkeleton(element, options = {}) {
    const { skeletonType = 'card', count = 1 } = options;
    
    // Get the appropriate template
    const templateFn = skeletonTemplates[skeletonType] || skeletonTemplates.projectCard;
    
    // Generate skeleton HTML
    const skeletons = Array(count).fill().map(() => templateFn()).join('');
    
    // Determine if we need a grid wrapper
    const needsGrid = ['projectCard', 'certificateCard', 'skillCategory'].includes(skeletonType);
    
    if (needsGrid && count > 1) {
        element.innerHTML = `
            <div class="grid md:grid-cols-3 gap-6">
                ${skeletons}
            </div>
        `;
    } else if (skeletonType === 'experienceCard') {
        element.innerHTML = `
            <div class="space-y-6">
                ${skeletons}
            </div>
        `;
    } else {
        element.innerHTML = skeletons;
    }
}

/**
 * Shows an overlay on top of existing content
 */
function showOverlay(element, options = {}) {
    const { message = 'Loading...' } = options;
    
    // Make sure container is positioned
    const currentPosition = window.getComputedStyle(element).position;
    if (currentPosition === 'static') {
        element.style.position = 'relative';
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-overlay-content">
            <div class="loading-spinner large"></div>
            ${message ? `<p class="loading-overlay-text">${message}</p>` : ''}
        </div>
    `;
    
    element.appendChild(overlay);
    
    // Trigger animation
    requestAnimationFrame(() => overlay.classList.add('active'));
}

// ---------------------------------------------------------------------------
// CONTENT SOURCE INDICATOR (Debug Mode)
// ---------------------------------------------------------------------------

/**
 * Shows a badge indicating where content came from
 * @param {string} source - Content source: 'contentful', 'static', 'cached'
 * @param {string} page - Optional page identifier
 */
export function showContentSourceIndicator(source, page = '') {
    // Remove existing indicator
    const existing = document.querySelector('.content-source-indicator');
    if (existing) existing.remove();
    
    const indicator = document.createElement('div');
    indicator.className = `content-source-indicator ${source}`;
    indicator.textContent = `${source.toUpperCase()}${page ? ` (${page})` : ''}`;
    
    document.body.appendChild(indicator);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
    }, 5000);
}

/**
 * Removes the content source indicator
 */
export function hideContentSourceIndicator() {
    const indicator = document.querySelector('.content-source-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
    }
}

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Creates a skeleton element without inserting it
 * @param {string} type - Type of skeleton to create
 * @returns {string} HTML string of the skeleton
 */
export function createSkeleton(type) {
    const templateFn = skeletonTemplates[type];
    return templateFn ? templateFn() : '';
}

/**
 * Wraps content loading with automatic loading state
 * @param {HTMLElement|string} container - Container element
 * @param {Function} loadFn - Async function that loads content
 * @param {Object} options - Loading options
 * @returns {Promise} Result of loadFn
 */
export async function withLoading(container, loadFn, options = {}) {
    const { type = 'skeleton', showIndicator = true, ...restOptions } = options;
    
    if (showIndicator) {
        showLoading(container, type, restOptions);
    }
    
    try {
        const result = await loadFn();
        return result;
    } finally {
        if (showIndicator) {
            hideLoading(container);
        }
    }
}

/**
 * Adds staggered fade-in animation to child elements
 * @param {HTMLElement|string} container - Container element
 */
export function animateChildrenIn(container) {
    const element = typeof container === 'string' 
        ? document.querySelector(container) 
        : container;
    
    if (!element) return;
    
    const children = element.children;
    Array.from(children).forEach((child, index) => {
        child.style.opacity = '0';
        child.style.animation = `content-fade-in 0.3s ease-out ${index * 0.05}s forwards`;
    });
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

export default {
    showLoading,
    hideLoading,
    showContentSourceIndicator,
    hideContentSourceIndicator,
    createSkeleton,
    withLoading,
    animateChildrenIn,
    skeletonTemplates
};
