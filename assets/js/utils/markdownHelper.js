// assets/js/utils/markdownHelper.js
// ============================================================================
// MARKDOWN HELPER
// ============================================================================
// Provides markdown parsing functionality using marked.js (loaded via CDN)
// Falls back to basic formatting if marked.js is not available.
// ============================================================================

/**
 * Parses markdown text to HTML
 * Uses marked.js if available, falls back to basic formatting
 * @param {string} text - Markdown text to parse
 * @returns {string} - HTML string
 */
export function parseMarkdown(text) {
    if (!text) return '';

    // Check if marked.js is available (loaded via CDN)
    if (typeof marked !== 'undefined') {
        // Configure marked for safe output
        marked.setOptions({
            gfm: true,          // GitHub Flavored Markdown
            breaks: true,       // Convert \n to <br>
            headerIds: false,   // Don't add IDs to headers
            mangle: false       // Don't mangle email addresses
        });
        return marked.parse(text);
    }

    // Fallback: Basic markdown parsing without library
    return parseBasicMarkdown(text);
}

/**
 * Basic markdown parser fallback (no external library)
 * Handles common formatting: bold, italic, links, lists, paragraphs
 * @param {string} text - Markdown text
 * @returns {string} - HTML string
 */
function parseBasicMarkdown(text) {
    let html = escapeHtml(text);

    // Bold: **text** or __text__
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Unordered lists: lines starting with - or *
    html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Headers: # Header
    html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');

    // Line breaks: double newline = paragraph
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>\s*(<[hul])/g, '$1');
    html = html.replace(/(<\/[hul][^>]*>)\s*<\/p>/g, '$1');

    // Single line breaks within paragraphs
    html = html.replace(/\n/g, '<br>');

    return html;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Raw text
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Safely render markdown to an element
 * @param {HTMLElement} element - Target element
 * @param {string} markdown - Markdown content
 */
export function renderMarkdown(element, markdown) {
    if (!element) return;
    element.innerHTML = parseMarkdown(markdown);
}

export default {
    parse: parseMarkdown,
    render: renderMarkdown
};
