// assets/js/services/transformers/profileTransformer.js
// ============================================================================
// PROFILE TRANSFORMER
// ============================================================================
// Converts Contentful 'profile' entry to match the structure in profileData.js
//
// Contentful Structure:
//   - name, title, profileImage (asset), github, linkedin, instagram, spotify
//
// Target Structure:
//   {
//     name: "...",
//     profileImage: "url",
//     title: "...",
//     social: { github, linkedin, instagram, spotify }
//   }
// ============================================================================

import contentfulService from '../contentfulService.js';

/**
 * Transforms a Contentful profile entry to match our app's expected format
 * @param {Object} entry - The raw Contentful entry with resolved assets
 * @returns {Object} - Transformed profile data matching profileData.js structure
 */
export function transformProfile(entry) {
    // Safety check - return null if entry is invalid
    if (!entry || !entry.fields) {
        console.warn('Profile transformer received invalid entry');
        return null;
    }

    const fields = entry.fields;

    // Extract the profile image URL from the Contentful asset
    // The asset should already be resolved by contentfulService
    const profileImageUrl = contentfulService.getAssetUrl(fields.profileImage) 
        || '../images/profile-picture.png'; // Fallback to default

    return {
        // Direct field mappings
        name: fields.name || 'Name Not Set',
        title: fields.title || '',
        
        // Image needs URL extraction from Contentful asset
        profileImage: profileImageUrl,
        
        // Social links are grouped in the original structure
        // Contentful stores them as flat fields, we nest them here
        social: {
            github: fields.github || 'https://github.com',
            linkedin: fields.linkedin || 'https://linkedin.com',
            instagram: fields.instagram || '',
            spotify: fields.spotify || ''
        }
    };
}

/**
 * Transforms the full Contentful response (with potentially multiple entries)
 * For profile, we only expect one entry, so we take the first one
 * @param {Object} response - Full Contentful API response
 * @returns {Object} - Single transformed profile object
 */
export function transformProfileResponse(response) {
    if (!response || !response.items || response.items.length === 0) {
        return null;
    }

    // Profile is a singleton - we only need the first (and should be only) entry
    return transformProfile(response.items[0]);
}

export default {
    transform: transformProfile,
    transformResponse: transformProfileResponse
};
