// assets/js/services/transformers/aboutTransformer.js
// ============================================================================
// ABOUT TRANSFORMER
// ============================================================================
// Converts Contentful 'about' entry to match the structure in aboutData.js
//
// Contentful Structure:
//   - title, greeting, subtitle, paragraphs (list of long text)
//
// Target Structure:
//   {
//     title: "hi",
//     greeting: "Hello, I am Sarp",
//     subtitle: "a Computer Engineering Student...",
//     paragraphs: ["...", "...", "..."]
//   }
// ============================================================================

/**
 * Transforms a Contentful about entry to match our app's expected format
 * This is pretty much a direct mapping since the structures are similar
 * @param {Object} entry - The raw Contentful entry
 * @returns {Object} - Transformed about data matching aboutData.js structure
 */
export function transformAbout(entry) {
    if (!entry || !entry.fields) {
        console.warn('About transformer received invalid entry');
        return null;
    }

    const fields = entry.fields;

    return {
        title: fields.title || 'hi',
        greeting: fields.greeting || 'Hello',
        subtitle: fields.subtitle || '',
        
        // Paragraphs comes as an array from Contentful (Long text list)
        // Make sure it's always an array even if empty
        paragraphs: Array.isArray(fields.paragraphs) 
            ? fields.paragraphs 
            : (fields.paragraphs ? [fields.paragraphs] : [])
    };
}

/**
 * Transforms the full Contentful response
 * About is a singleton content type - only one entry expected
 * @param {Object} response - Full Contentful API response
 * @returns {Object} - Single transformed about object
 */
export function transformAboutResponse(response) {
    if (!response || !response.items || response.items.length === 0) {
        return null;
    }

    return transformAbout(response.items[0]);
}

export default {
    transform: transformAbout,
    transformResponse: transformAboutResponse
};
