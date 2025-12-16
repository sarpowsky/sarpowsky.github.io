// assets/js/services/transformers/index.js
// ============================================================================
// TRANSFORMERS INDEX
// ============================================================================
// Central export point for all content type transformers
// This makes it easy to import multiple transformers in one statement
//
// Usage:
//   import { profileTransformer, experienceTransformer } from './transformers';
//   
//   // Or import all
//   import * as transformers from './transformers';
// ============================================================================

// Import all transformers
import profileTransformer, { 
    transformProfile, 
    transformProfileResponse 
} from './profileTransformer.js';

import aboutTransformer, { 
    transformAbout, 
    transformAboutResponse 
} from './aboutTransformer.js';

import experienceTransformer, { 
    transformExperience, 
    transformExperienceResponse 
} from './experienceTransformer.js';

import projectTransformer, { 
    transformProject, 
    transformProjectResponse 
} from './projectTransformer.js';

import skillCategoryTransformer, { 
    transformSkillCategory, 
    transformSkillCategoryResponse 
} from './skillCategoryTransformer.js';

import certificateTransformer, { 
    transformCertificate, 
    transformCertificateResponse 
} from './certificateTransformer.js';

import linkedInPostTransformer, { 
    transformLinkedInPost, 
    transformLinkedInPostResponse 
} from './linkedInPostTransformer.js';

// Export individual transform functions for direct use
export {
    transformProfile,
    transformProfileResponse,
    transformAbout,
    transformAboutResponse,
    transformExperience,
    transformExperienceResponse,
    transformProject,
    transformProjectResponse,
    transformSkillCategory,
    transformSkillCategoryResponse,
    transformCertificate,
    transformCertificateResponse,
    transformLinkedInPost,
    transformLinkedInPostResponse
};

// Export transformer objects (containing both transform and transformResponse)
export {
    profileTransformer,
    aboutTransformer,
    experienceTransformer,
    projectTransformer,
    skillCategoryTransformer,
    certificateTransformer,
    linkedInPostTransformer
};

// ============================================================================
// TRANSFORMER REGISTRY
// ============================================================================
// A map of content type IDs to their transformers
// Useful for dynamic transformer selection based on content type

export const transformerRegistry = {
    profile: profileTransformer,
    about: aboutTransformer,
    experience: experienceTransformer,
    project: projectTransformer,
    skillCategory: skillCategoryTransformer,
    certificate: certificateTransformer,
    linkedInPost: linkedInPostTransformer
};

/**
 * Get the appropriate transformer for a content type
 * @param {string} contentType - The Contentful content type ID
 * @returns {Object|null} - The transformer object or null if not found
 */
export function getTransformer(contentType) {
    return transformerRegistry[contentType] || null;
}

/**
 * Transform a Contentful response using the appropriate transformer
 * @param {string} contentType - The Contentful content type ID
 * @param {Object} response - The raw Contentful API response
 * @returns {*} - Transformed data or null if transformer not found
 */
export function transformResponse(contentType, response) {
    const transformer = getTransformer(contentType);
    if (!transformer) {
        console.warn(`No transformer found for content type: ${contentType}`);
        return null;
    }
    return transformer.transformResponse(response);
}

// Default export - the registry and helper functions
export default {
    registry: transformerRegistry,
    getTransformer,
    transformResponse
};
