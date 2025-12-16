// assets/js/services/transformers/linkedInPostTransformer.js
// ============================================================================
// LINKEDIN POST TRANSFORMER
// ============================================================================
// Converts Contentful 'linkedInPost' entries to match linkedin-posts.json
//
// Contentful Structure:
//   - title, excerpt, date (Date type), link, image (asset)
//
// Target Structure (each post):
//   {
//     title: "...",
//     excerpt: "...",
//     date: "2025-08-25",  // ISO date string format
//     link: "https://linkedin.com/...",
//     image: null or "url"
//   }
//
// Note: The linkedin-posts.json uses ISO date format (YYYY-MM-DD)
// Contentful stores dates in ISO 8601 format with time, we need to extract just the date
// ============================================================================

import contentfulService from '../contentfulService.js';

/**
 * Transforms a single Contentful linkedInPost entry
 * @param {Object} entry - The raw Contentful entry with resolved assets
 * @returns {Object} - Transformed post matching linkedin-posts.json structure
 */
export function transformLinkedInPost(entry) {
    if (!entry || !entry.fields) {
        console.warn('LinkedInPost transformer received invalid entry');
        return null;
    }

    const fields = entry.fields;

    // Format the date - Contentful returns ISO 8601 with time
    // We need just the date part (YYYY-MM-DD)
    let dateString = null;
    if (fields.date) {
        // Handle both full ISO string and date-only string
        dateString = fields.date.split('T')[0];
    }

    // Extract image URL if present
    const imageUrl = fields.image 
        ? contentfulService.getAssetUrl(fields.image) 
        : null;

    return {
        title: fields.title || 'LinkedIn Post',
        excerpt: fields.excerpt || '',
        date: dateString || new Date().toISOString().split('T')[0],
        link: fields.link || '#',
        image: imageUrl
    };
}

/**
 * Transforms the full Contentful response for LinkedIn posts
 * Posts are sorted by date (most recent first)
 * @param {Object} response - Full Contentful API response
 * @returns {Array} - Array of transformed posts (not wrapped in object)
 */
export function transformLinkedInPostResponse(response) {
    if (!response || !response.items) {
        return null;
    }

    // Transform all posts
    let posts = response.items
        .map(transformLinkedInPost)
        .filter(post => post !== null);

    // Sort by date (most recent first)
    // The date is in YYYY-MM-DD format, so string comparison works
    posts.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
    });

    // LinkedIn posts are returned as a plain array (not wrapped in object)
    // This matches the linkedin-posts.json structure
    return posts;
}

export default {
    transform: transformLinkedInPost,
    transformResponse: transformLinkedInPostResponse
};
