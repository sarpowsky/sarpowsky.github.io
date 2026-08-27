#!/usr/bin/env node
/**
 * Verifies every internal link and asset reference in dist/ resolves to a file
 * that actually exists.
 *
 * Deliberately dependency-free and offline: external URLs are not requested, so
 * the check is deterministic and never fails because LinkedIn returned a 999 or
 * a CDN was briefly slow. It catches exactly the class of bug that shipped in
 * the previous site -- links to `assets/resume.pdf`, which was never in the
 * repository, and root-absolute fetches that resolved only on the live domain.
 */

import { readdir, readFile, access } from 'node:fs/promises';
import { join, resolve, dirname, relative } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

/** Map a site URL path to the file that would serve it. */
async function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const base = join(DIST, clean);
  if (await exists(base)) {
    // A directory URL is served by its index.html.
    if (clean.endsWith('/') || !clean.split('/').pop().includes('.')) {
      return (await exists(join(base, 'index.html'))) ? join(base, 'index.html') : base;
    }
    return base;
  }
  if (await exists(`${base}.html`)) return `${base}.html`;
  if (await exists(join(base, 'index.html'))) return join(base, 'index.html');
  return null;
}

const ATTR = /(?:href|src)\s*=\s*"([^"]+)"/gi;
const SRCSET = /srcset\s*=\s*"([^"]+)"/gi;

const broken = [];
let checked = 0;

if (!(await exists(DIST))) {
  console.error('✗ dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

for await (const file of walk(DIST)) {
  if (!file.endsWith('.html')) continue;
  const html = await readFile(file, 'utf8');
  const from = relative(DIST, file);

  const candidates = [];
  for (const [, value] of html.matchAll(ATTR)) candidates.push(value);
  for (const [, value] of html.matchAll(SRCSET)) {
    for (const part of value.split(',')) candidates.push(part.trim().split(/\s+/)[0]);
  }

  for (const raw of candidates) {
    if (!raw) continue;
    // Skip anything that leaves the site or is not a file reference.
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw)) continue;

    const urlPath = raw.startsWith('/')
      ? raw
      : '/' +
        relative(DIST, resolve(dirname(file), raw))
          .split('\\')
          .join('/');

    checked++;
    if (!(await resolveTarget(urlPath))) broken.push({ from, raw });
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} broken internal reference(s) of ${checked} checked:\n`);
  for (const b of broken) console.error(`  ${b.from}  ->  ${b.raw}`);
  process.exit(1);
}

console.log(`✓ All ${checked} internal references resolve.`);
