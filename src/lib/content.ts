import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

/**
 * Content access helpers.
 *
 * Centralising reads means sorting rules and the draft filter are defined once
 * instead of being re-implemented per page. Everything here runs at build time;
 * no content is fetched in the browser.
 */

/** Drafts render locally but are excluded from production builds. */
const published = <T extends { data: { draft?: boolean } }>(entry: T) =>
  import.meta.env.DEV || !entry.data.draft;

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) =>
  a.data.order - b.data.order;

export async function getProfile(): Promise<CollectionEntry<'profile'>> {
  const entry = await getEntry('profile', 'profile');
  if (!entry) {
    throw new Error('Missing src/content/profile/profile.md — the site cannot render without it.');
  }
  return entry;
}

export async function getAbout(): Promise<CollectionEntry<'about'>> {
  const entry = await getEntry('about', 'about');
  if (!entry) {
    throw new Error('Missing src/content/about/about.md — the /hi page cannot render without it.');
  }
  return entry;
}

export async function getExperience() {
  return (await getCollection('experience', published)).sort(byOrder);
}

export async function getProjects() {
  return (await getCollection('projects', published)).sort(byOrder);
}

/** Newest first, so recent certificates lead. */
export async function getCertificates() {
  return (await getCollection('certificates', published)).sort(
    (a, b) => b.data.issuedOn.getTime() - a.data.issuedOn.getTime()
  );
}

export async function getSkills() {
  return (await getCollection('skills')).sort(byOrder);
}

export async function getPosts() {
  return (await getCollection('posts', published)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}
