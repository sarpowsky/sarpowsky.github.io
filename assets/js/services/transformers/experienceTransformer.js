// assets/js/services/transformers/experienceTransformer.js
// ============================================================================
// EXPERIENCE TRANSFORMER
// ============================================================================
// Converts Contentful 'experience' entries to match experienceData.js structure
//
// This is one of the more complex transformers because:
// 1. Field names differ between Contentful and our app (jobTitle → title)
// 2. Need to extract logo URL from Contentful asset
// 3. Multiple entries that need to be sorted by 'order' field
// 4. snake_case vs camelCase for skills_gained
//
// Contentful Structure:
//   - internalId, jobTitle, company, location, duration, type, logo (asset),
//     summary, description, responsibilities, technologies, achievements,
//     skillsGained, order
//
// Target Structure (each experience):
//   {
//     id: "...",
//     title: "...",        // Note: 'jobTitle' in Contentful
//     company: "...",
//     location: "...",
//     duration: "...",
//     type: "...",
//     logo: "url",
//     summary: "...",
//     description: "...",
//     responsibilities: [...],
//     technologies: [...],
//     achievements: [...],
//     skills_gained: [...]  // Note: 'skillsGained' in Contentful (camelCase)
//   }
// ============================================================================

import contentfulService from '../contentfulService.js';

/**
 * Transforms a single Contentful experience entry
 * @param {Object} entry - The raw Contentful entry with resolved assets
 * @returns {Object} - Transformed experience matching experienceData.js structure
 */
export function transformExperience(entry) {
    if (!entry || !entry.fields) {
        console.warn('Experience transformer received invalid entry');
        return null;
    }

    const fields = entry.fields;

    // Extract logo URL - falls back to default placeholder if not set
    const logoUrl = contentfulService.getAssetUrl(fields.logo) 
        || '../images/experience/default-company.png';

    return {
        // 'internalId' in Contentful becomes 'id' in our app
        // This is used for unique identification and URL generation
        id: fields.internalId || entry.sys.id,
        
        // 'jobTitle' in Contentful becomes 'title' in our app
        // We renamed it because "title" is more generic and works better in templates
        title: fields.jobTitle || 'Position Not Specified',
        
        // These fields map directly - same names
        company: fields.company || 'Company',
        location: fields.location || '',
        duration: fields.duration || '',
        type: fields.type || 'Full-time',
        
        // Logo needs URL extraction from the Contentful asset
        logo: logoUrl,
        
        // Text fields - provide empty strings as defaults
        summary: fields.summary || '',
        description: fields.description || '',
        
        // Array fields - ensure they're always arrays
        responsibilities: ensureArray(fields.responsibilities),
        technologies: ensureArray(fields.technologies),
        achievements: ensureArray(fields.achievements),
        
        // Note the naming convention change:
        // Contentful uses 'skillsGained' (camelCase)
        // Our app expects 'skills_gained' (snake_case)
        // This matches the existing experienceData.js structure
        skills_gained: ensureArray(fields.skillsGained)
    };
}

/**
 * Transforms the full Contentful response for experiences
 * Handles sorting by the 'order' field and wraps in expected structure
 * @param {Object} response - Full Contentful API response
 * @returns {Object} - Object with title and experiences array
 */
export function transformExperienceResponse(response) {
    if (!response || !response.items) {
        return null;
    }

    // Transform each entry
    let experiences = response.items
        .map(transformExperience)
        .filter(exp => exp !== null); // Remove any failed transforms

    // Sort by order field (lower number = appears first)
    // If order isn't set, those items go to the end
    experiences.sort((a, b) => {
        const orderA = response.items.find(i => i.fields.internalId === a.id)?.fields.order ?? 999;
        const orderB = response.items.find(i => i.fields.internalId === b.id)?.fields.order ?? 999;
        return orderA - orderB;
    });

    // Return in the format expected by the app
    // The static experienceData.js has a 'title' property too
    return {
        title: 'Experience',
        experiences: experiences
    };
}

/**
 * Helper function to ensure a value is always an array
 * Contentful list fields should already be arrays, but let's be safe
 */
function ensureArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (value === null || value === undefined) {
        return [];
    }
    // Single value - wrap in array
    return [value];
}

export default {
    transform: transformExperience,
    transformResponse: transformExperienceResponse
};
