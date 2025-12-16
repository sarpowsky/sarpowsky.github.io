// assets/js/services/transformers/projectTransformer.js
// ============================================================================
// PROJECT TRANSFORMER
// ============================================================================
// Converts Contentful 'project' entries to match projectsData.js structure
//
// Contentful Structure:
//   - title, description, link, note, image (asset), order
//
// Target Structure (each project):
//   {
//     title: "...",
//     description: "...",
//     link: "...",      // Optional - URL to project
//     note: "..."       // Optional - shown instead of link button
//   }
//
// Note: The current static data doesn't include images, but we'll support
// them for future use. The image URL will be available if you add it to templates.
// ============================================================================

import contentfulService from '../contentfulService.js';

/**
 * Transforms a single Contentful project entry
 * @param {Object} entry - The raw Contentful entry with resolved assets
 * @returns {Object} - Transformed project matching projectsData.js structure
 */
export function transformProject(entry) {
    if (!entry || !entry.fields) {
        console.warn('Project transformer received invalid entry');
        return null;
    }

    const fields = entry.fields;

    // Build the base project object
    const project = {
        title: fields.title || 'Untitled Project',
        description: fields.description || ''
    };

    // Only include 'link' if it exists
    // The app logic checks for presence of 'link' vs 'note' to decide what to show
    if (fields.link) {
        project.link = fields.link;
    }

    // Only include 'note' if it exists and there's no link
    // Note is an alternative to link - shows text instead of "View Project" button
    if (fields.note) {
        project.note = fields.note;
    }

    // Image is optional and not in current static data
    // But we'll include it for future enhancements
    if (fields.image) {
        project.image = contentfulService.getAssetUrl(fields.image);
    }

    return project;
}

/**
 * Transforms the full Contentful response for projects
 * Handles sorting by 'order' field
 * @param {Object} response - Full Contentful API response
 * @returns {Object} - Object with title and projects array
 */
export function transformProjectResponse(response) {
    if (!response || !response.items) {
        return null;
    }

    // Keep original items for order lookup
    const originalItems = response.items;

    // Transform each entry
    let projects = originalItems
        .map((item, index) => {
            const transformed = transformProject(item);
            if (transformed) {
                // Attach order for sorting (keep it internal, not in final output)
                transformed._order = item.fields.order ?? 999;
            }
            return transformed;
        })
        .filter(project => project !== null);

    // Sort by order field (lower = first)
    projects.sort((a, b) => a._order - b._order);

    // Remove the internal _order property before returning
    projects = projects.map(({ _order, ...project }) => project);

    return {
        title: 'Projects',
        projects: projects
    };
}

export default {
    transform: transformProject,
    transformResponse: transformProjectResponse
};
