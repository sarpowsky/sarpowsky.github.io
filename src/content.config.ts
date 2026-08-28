import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Content model for the site.
 *
 * Every piece of editable content lives as Markdown in `src/content/` and is
 * validated against these schemas at build time. A typo in a frontmatter key or
 * a missing required field fails `astro check` and the CI build, so broken
 * content can never reach production -- the guarantee the old runtime Contentful
 * fetch could not make.
 */

const md = (dir: string) => glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` });

/**
 * Image paths are stored repo-root-absolute so a visual CMS can write them
 * without knowing where the entry file lives. `resolveImage()` in src/lib/images
 * turns them into build-optimized assets and throws if the file is missing, so
 * the reference is still verified -- just at resolve time rather than parse time.
 */
const assetPath = z
  .string()
  .regex(
    /^\/src\/assets\/.+\.(jpe?g|png|gif|webp|avif|svg)$/i,
    'must be a repo-root-absolute path under /src/assets/, e.g. /src/assets/certificates/aws.png'
  );

/** Ascending: 1 renders first. */
const order = z.number().int().nonnegative().default(99);

/** Singleton: identity, contact details, and social links used site-wide. */
const profile = defineCollection({
  loader: md('profile'),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    tagline: z.string(),
    avatar: assetPath,
    email: z.string().email(),
    resume: z.string().default('/resume/SarpCanKaraman_CV.pdf'),
    socials: z.object({
      github: z.string().url(),
      linkedin: z.string().url(),
      instagram: z.string().url().optional(),
      spotify: z.string().url().optional(),
    }),
  }),
});

/** Singleton: the `/hi` page. Long-form prose lives in the Markdown body. */
const about = defineCollection({
  loader: md('about'),
  schema: z.object({
    title: z.string(),
    greeting: z.string(),
    subtitle: z.string(),
  }),
});

/** Roles and internships. Detail sections are authored in the Markdown body. */
const experience = defineCollection({
  loader: md('experience'),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    location: z.string(),
    duration: z.string(),
    type: z.enum(['Internship', 'Voluntary', 'Full-time', 'Part-time', 'Freelance']),
    logo: assetPath,
    summary: z.string().optional(),
    order,
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: md('projects'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    link: z.string().url(),
    tags: z.array(z.string()).default([]),
    cover: assetPath.optional(),
    order,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const certificates = defineCollection({
  loader: md('certificates'),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    /** Human-readable, e.g. "September 2025". `issuedOn` drives sorting. */
    date: z.string(),
    issuedOn: z.coerce.date(),
    image: assetPath,
    description: z.string(),
    credentialUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const skills = defineCollection({
  loader: md('skills'),
  schema: z.object({
    name: z.string(),
    order,
    items: z
      .array(
        z.object({
          name: z.string(),
          level: z.number().int().min(0).max(100),
        })
      )
      .min(1),
  }),
});

/** Archived social posts retained in the content layer, but not rendered. */
const posts = defineCollection({
  loader: md('posts'),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    link: z.string().url(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { profile, about, experience, projects, certificates, skills, posts };
