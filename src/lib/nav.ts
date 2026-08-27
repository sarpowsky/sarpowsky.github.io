/**
 * The site's navigation, defined once.
 *
 * The previous build copy-pasted this list into all five HTML files, with the
 * home link pointing at `../index.html` even from the root page. Adding a route
 * meant five edits; here it means one.
 */
export const NAV_LINKS = [
  { href: '/hi', label: '/hi' },
  { href: '/experience', label: '/experience' },
  { href: '/projects', label: '/projects' },
  { href: '/certificates', label: '/certificates' },
] as const;
