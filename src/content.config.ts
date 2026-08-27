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
 *
 * Image fields use the `image()` helper, which resolves the path *relative to
 * the Markdown file* and hands the component an optimized, correctly-sized
 * asset. Decap CMS is configured with matching relative `public_folder` values
 * so uploads from the browser land in the same place.
 */

const md = (dir: string) => glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` });

/** Singleton: identity, contact details, and social links used site-wide. */
const profile = defineCollection({
  loader: md('profile'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      title: z.string(),
      tagline: z.string(),
      avatar: image(),
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
  schema: ({ image }) =>
    z.object({
      role: z.string(),
      company: z.string(),
      location: z.string(),
      duration: z.string(),
      type: z.enum(['Internship', 'Voluntary', 'Full-time', 'Part-time', 'Freelance']),
      logo: image(),
      summary: z.string().optional(),
      /** Ascending: 1 renders first. */
      order: z.number().int().nonnegative().default(99),
      draft: z.boolean().default(false),
    }),
});

const projects = defineCollection({
  loader: md('projects'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().url(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      order: z.number().int().nonnegative().default(99),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const certificates = defineCollection({
  loader: md('certificates'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      issuer: z.string(),
      /** Human-readable, e.g. "September 2025". `issuedOn` drives sorting. */
      date: z.string(),
      issuedOn: z.coerce.date(),
      image: image(),
      description: z.string(),
      credentialUrl: z.string().url().optional(),
      draft: z.boolean().default(false),
    }),
});

const skills = defineCollection({
  loader: md('skills'),
  schema: z.object({
    name: z.string(),
    order: z.number().int().nonnegative().default(99),
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

/** Cross-posted LinkedIn highlights shown on the home page carousel. */
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
