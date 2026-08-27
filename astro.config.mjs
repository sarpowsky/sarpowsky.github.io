// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// `sarpowsky.github.io` is a GitHub *user* site, so it is served from the domain
// root. That means `base` stays '/' and every internal URL can be root-absolute.
// If this repo is ever renamed to a project repo, set `base: '/<repo-name>'` and
// the `href()` helper in src/lib/paths.ts will keep every link correct.
export default defineConfig({
  site: 'https://sarpowsky.github.io',
  base: '/',
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: {
    // Emit `about/index.html` rather than `about.html` so URLs stay extensionless.
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    // Content images are optimized at build time; nothing is fetched at runtime.
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
