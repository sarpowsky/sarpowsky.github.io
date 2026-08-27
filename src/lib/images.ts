import type { ImageMetadata } from 'astro';

/**
 * Resolves a repo-root-absolute image path from content frontmatter into an
 * `ImageMetadata` object that `<Image>` can optimize.
 *
 * Why not the `image()` schema helper? That helper resolves paths *relative to
 * the Markdown file* (`../../assets/foo.png`). A visual CMS writes paths
 * relative to the repository root (`/src/assets/foo.png`) because it has no
 * notion of where the entry lives. Going through this resolver lets frontmatter
 * hold the CMS-native form while Astro still hashes, converts, and resizes
 * every image at build time.
 *
 * `eager: true` means the glob is resolved during the build, so a missing file
 * throws here and fails the build -- keeping the "broken content cannot ship"
 * guarantee that `image()` provided.
 */
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,gif,webp,avif,svg}',
  { eager: true }
);

export function resolveImage(path: string): ImageMetadata {
  const found = images[path];
  if (!found) {
    const available = Object.keys(images).sort().join('\n  ');
    throw new Error(
      `Image not found: "${path}"\n\n` +
        `Content image paths must be absolute from the repository root and live under /src/assets/.\n` +
        `Available images:\n  ${available}`
    );
  }
  return found.default;
}
