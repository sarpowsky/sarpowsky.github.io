// assets/js/services/transformers/skillCategoryTransformer.js
// ============================================================================
// SKILL CATEGORY TRANSFORMER
// ============================================================================
// Converts Contentful 'skillCategory' entries to match skillsData.js structure
//
// Contentful Structure:
//   - name, skills (JSON), order
//
// The 'skills' field is stored as JSON in Contentful, which means it should
// already be in the format: [{ name: "Python", level: 70 }, ...]
//
// Target Structure:
//   {
//     title: "Technical Competencies",
//     categories: [
//       {
//         name: "Data Science & ML",
//         skills: [
//           { name: "Python", level: 70 },
//           ...
//         ]
//       }
//     ]
//   }
// ============================================================================

/**
 * Transforms a single Contentful skillCategory entry
 * @param {Object} entry - The raw Contentful entry
 * @returns {Object} - Transformed category with name and skills array
 */
export function transformSkillCategory(entry) {
    if (!entry || !entry.fields) {
        console.warn('SkillCategory transformer received invalid entry');
        return null;
    }

    const fields = entry.fields;

    // The skills field is JSON in Contentful
    // It should already be parsed into an array of { name, level } objects
    let skills = fields.skills || [];

    // Validate the skills structure - each should have name and level
    if (Array.isArray(skills)) {
        skills = skills.map(skill => {
            // Handle case where skill might just be a string
            if (typeof skill === 'string') {
                return { name: skill, level: 50 }; // Default level
            }
            
            // Ensure proper structure
            return {
                name: skill.name || 'Unknown Skill',
                level: typeof skill.level === 'number' ? skill.level : 50
            };
        });
    } else {
        // Skills wasn't an array - might be malformed JSON
        console.warn('Skills field is not an array for category:', fields.name);
        skills = [];
    }

    return {
        name: fields.name || 'Unnamed Category',
        skills: skills
    };
}

/**
 * Transforms the full Contentful response for skill categories
 * @param {Object} response - Full Contentful API response
 * @returns {Object} - Object with title and categories array
 */
export function transformSkillCategoryResponse(response) {
    if (!response || !response.items) {
        return null;
    }

    // Transform and sort in one pass
    let categories = response.items
        .map((item, index) => {
            const transformed = transformSkillCategory(item);
            if (transformed) {
                // Keep order for sorting
                transformed._order = item.fields.order ?? 999;
            }
            return transformed;
        })
        .filter(cat => cat !== null)
        .sort((a, b) => a._order - b._order)
        .map(({ _order, ...category }) => category); // Remove internal _order

    return {
        title: 'Technical Competencies',
        categories: categories
    };
}

export default {
    transform: transformSkillCategory,
    transformResponse: transformSkillCategoryResponse
};
