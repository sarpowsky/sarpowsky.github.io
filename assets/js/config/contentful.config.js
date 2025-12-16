// assets/js/config/contentful.config.js
// ============================================================================
// CONTENTFUL CONFIGURATION
// ============================================================================
// 
// SECURITY NOTE:
// This file contains the Content Delivery API (CDA) access token.
// The CDA token is READ-ONLY and designed to be safe for client-side use.
// It can only fetch published content - it cannot modify anything.
//
// However, if you want extra security:
// 1. Restrict the token's environments in Contentful settings
// 2. Use Contentful's API key policies to limit access
// 3. Consider using a build-time approach for truly sensitive data
//
// NEVER put Content Management API (CMA) tokens in client-side code!
// ============================================================================

const ContentfulConfig = {
    // Your Contentful Space ID - find this in Settings > General Settings
    spaceId: 'td4wx30xvzbg',
    
    // Content Delivery API access token - find in Settings > API keys
    // This is the read-only token, safe for client-side use
    accessToken: 'REDACTED_REVOKED_CONTENTFUL_TOKEN',
    
    // Environment (usually 'master' for production)
    environment: 'master',
    
    // Base URL for Contentful's Content Delivery API
    baseUrl: 'https://cdn.contentful.com',
    
    // Preview API settings (optional - for draft content)
    // Only use preview token during development, never in production
    preview: {
        enabled: false,
        accessToken: '', // Preview API token - also read-only but shows drafts
        baseUrl: 'https://preview.contentful.com'
    },
    
    // Cache settings - how long to keep data before refetching (in milliseconds)
    cache: {
        enabled: true,
        ttl: {
            profile: 24 * 60 * 60 * 1000,      // 24 hours - rarely changes
            about: 24 * 60 * 60 * 1000,        // 24 hours
            experience: 12 * 60 * 60 * 1000,   // 12 hours
            project: 6 * 60 * 60 * 1000,       // 6 hours - might update more often
            skillCategory: 24 * 60 * 60 * 1000, // 24 hours
            certificate: 12 * 60 * 60 * 1000,  // 12 hours
            linkedInPost: 1 * 60 * 60 * 1000   // 1 hour - most dynamic content
        }
    },
    
    // Content type IDs as defined in your Contentful model
    // These should match your API IDs exactly
    contentTypes: {
        profile: 'profile',
        about: 'about',
        experience: 'experience',
        project: 'project',
        skillCategory: 'skillCategory',
        certificate: 'certificate',
        linkedInPost: 'linkedInPost'
    },
    
    // Debug mode - set to true during development to see API calls in console
    debug: false
};

// Quick validation to remind you to set up your credentials
if (ContentfulConfig.spaceId === 'YOUR_SPACE_ID' || 
    ContentfulConfig.accessToken === 'YOUR_CDA_ACCESS_TOKEN') {
    console.warn(
        '⚠️ Contentful not configured! Update assets/js/config/contentful.config.js\n' +
        'Using static fallback data instead.'
    );
}

// Helper to check if Contentful is properly configured
ContentfulConfig.isConfigured = () => {
    return ContentfulConfig.spaceId !== 'YOUR_SPACE_ID' && 
           ContentfulConfig.accessToken !== 'YOUR_CDA_ACCESS_TOKEN';
};

// Helper to get the active API URL based on preview setting
ContentfulConfig.getApiUrl = () => {
    if (ContentfulConfig.preview.enabled && ContentfulConfig.preview.accessToken) {
        return ContentfulConfig.preview.baseUrl;
    }
    return ContentfulConfig.baseUrl;
};

// Helper to get the active access token
ContentfulConfig.getAccessToken = () => {
    if (ContentfulConfig.preview.enabled && ContentfulConfig.preview.accessToken) {
        return ContentfulConfig.preview.accessToken;
    }
    return ContentfulConfig.accessToken;
};

export default ContentfulConfig;
