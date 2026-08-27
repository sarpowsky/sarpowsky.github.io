/**
 * Builds an internal URL that is correct regardless of where the site is
 * mounted.
 *
 * The previous build hardcoded root-absolute paths like `/assets/js/data/...`,
 * which worked only on the live domain and 404'd in every local preview and any
 * sub-path deployment. Routing every internal link through this helper means a
 * single `base` change in astro.config.mjs relocates the whole site.
 */
const BASE = import.meta.env.BASE_URL;

export function href(path: string): string {
  const cleaned = path.startsWith('/') ? path.slice(1) : path;
  const base = BASE.endsWith('/') ? BASE : `${BASE}/`;
  return `${base}${cleaned}`;
}

/** True when `pathname` is the current route, ignoring trailing slashes. */
export function isCurrent(pathname: string, target: string): boolean {
  const norm = (p: string) => p.replace(/\/+$/, '') || '/';
  return norm(pathname) === norm(href(target));
}
