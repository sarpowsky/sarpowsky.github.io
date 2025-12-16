// assets/js/services/transformers/certificateTransformer.js
// ============================================================================
// CERTIFICATE TRANSFORMER
// ============================================================================
// Converts Contentful 'certificate' entries to match certificatesData.js
//
// Contentful Structure:
//   - name, company, date, image (asset), description, order
//
// Target Structure (each certificate):
//   {
//     name: "HCCDA - Tech Essentials",
//     company: "Huawei Cloud",
//     date: "September 2025",
//     image: "../images/certificates/...",
//     description: "..."
//   }
// ============================================================================

import contentfulService from '../contentfulService.js';

/**
 * Transforms a single Contentful certificate entry
 * @param {Object} entry - The raw Contentful entry with resolved assets
 * @returns {Object} - Transformed certificate matching certificatesData.js
 */
export function transformCertificate(entry) {
    if (!entry || !entry.fields) {
        console.warn('Certificate transformer received invalid entry');
        return null;
    }

    const fields = entry.fields;

    // Extract image URL from Contentful asset
    // Fall back to a placeholder if no image is set
    const imageUrl = contentfulService.getAssetUrl(fields.image)
        || '../images/certificates/placeholder.png';

    return {
        name: fields.name || 'Certificate',
        company: fields.company || '',
        date: fields.date || '',
        image: imageUrl,
        description: fields.description || ''
    };
}

/**
 * Transforms the full Contentful response for certificates
 * @param {Object} response - Full Contentful API response
 * @returns {Object} - Object with title and certificates array
 */
export function transformCertificateResponse(response) {
    if (!response || !response.items) {
        return null;
    }

    // Transform, sort, and clean up
    let certificates = response.items
        .map((item) => {
            const transformed = transformCertificate(item);
            if (transformed) {
                transformed._order = item.fields.order ?? 999;
            }
            return transformed;
        })
        .filter(cert => cert !== null)
        .sort((a, b) => a._order - b._order)
        .map(({ _order, ...certificate }) => certificate);

    return {
        title: 'Certificates & Achievements',
        certificates: certificates
    };
}

export default {
    transform: transformCertificate,
    transformResponse: transformCertificateResponse
};
