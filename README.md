# sarpowsky.github.io

Personal portfolio for **Sarp Can Karaman** — an Astro static site deployed to
GitHub Pages, with all content managed as Markdown in this repository.

[![CI](https://github.com/sarpowsky/sarpowsky.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/sarpowsky/sarpowsky.github.io/actions/workflows/ci.yml)
[![Deploy](https://github.com/sarpowsky/sarpowsky.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/sarpowsky/sarpowsky.github.io/actions/workflows/deploy.yml)

---

## Quick start

```bash
nvm use          # Node version from .nvmrc
npm ci           # install exactly the lockfile
npm run dev      # http://localhost:4321
```

| Command               | What it does                                                  |
| --------------------- | ------------------------------------------------------------- |
| `npm run dev`         | Dev server with hot reload                                    |
| `npm run build`       | Type-check, validate content, then build to `dist/`           |
| `npm run preview`     | Serve the production build locally                            |
| `npm run verify`      | Everything CI runs: format, types, content, build, links      |
| `npm run check:links` | Verify every internal link and asset resolves (needs `dist/`) |
| `npm run format`      | Apply Prettier                                                |
| `npm run data:github` | Refresh the contribution heatmap (needs `GITHUB_TOKEN`)       |

Run `npm run verify` before opening a pull request — it is the same gate CI applies.

---

## Editing content

**No code changes are needed to update the site.** Every editable thing is a
Markdown file under `src/content/`, validated against a schema at build time.

### Option 1 — Visual editor (no terminal)

Go to **[pagescms.org](https://pagescms.org)**, sign in with GitHub, and grant
access to this repository. It reads [`.pages.yml`](.pages.yml) and generates
editing forms with image upload for every collection. Saving commits to the
repo, which triggers a rebuild and redeploy.

There is nothing to install or host — no OAuth app, no admin bundle, no server.

### Option 2 — Edit the Markdown directly

In your editor, or straight from github.com (press `.` in the repo to open the
web editor).

```
src/content/
├── profile/profile.md      # name, tagline, email, résumé, social links
├── about/about.md          # the /hi page; prose lives in the Markdown body
├── experience/*.md         # one file per role
├── projects/*.md           # one file per project
├── certificates/*.md       # one file per certificate
├── skills/*.md             # one file per skill group
└── posts/*.md              # Archived social posts (not rendered on the site)
```

Adding a project is one new file:

```markdown
---
title: My New Project
description: What it does and what it is built with.
link: https://github.com/sarpowsky/my-new-project
order: 3
tags:
  - Python
  - PyTorch
---
```

**Images** go in `src/assets/` and are referenced by a repo-root-absolute path
(`/src/assets/certificates/aws.png`). Astro resizes, converts to WebP, and
hashes them at build time — a 1.3MB source PNG ships as a 5KB WebP.

**Drafts:** set `draft: true` on any entry. It renders in `npm run dev` and is
excluded from the production build.

Schemas live in [`src/content.config.ts`](src/content.config.ts). If a required
field is missing or an image path is wrong, `npm run build` fails with the file
and field named — broken content cannot reach production.

---

## Architecture

```
src/
├── content.config.ts     # zod schemas — the contract for all content
├── content/              # the content itself (Markdown)
├── assets/               # images, optimized at build time
├── data/                 # generated data (GitHub contributions)
├── layouts/              # BaseLayout: head, nav, footer, backdrop
├── components/
│   ├── layout/           # BaseHead, Nav, Footer
│   ├── ui/               # Icon, Modal, ThemeToggle, Clock
│   ├── features/         # GitHubCalendar
│   └── effects/          # MatrixRain
├── lib/                  # content access, image resolution, paths, icons
├── pages/                # one file per route
└── styles/               # global.css (tokens + base), components.css
```

Principles the structure enforces:

- **Content is data, not markup.** Pages read from collections; they never
  hardcode a job title or a certificate name.
- **One definition per concept.** Nav links live in `src/lib/nav.ts`. Colours are
  custom properties defined once and swapped per theme. The header and footer
  exist in exactly one file each.
- **Nothing is fetched at runtime.** Everything — content, images, the
  contribution heatmap — is resolved at build time. The site is HTML, CSS, and
  ~4KB of progressive-enhancement JavaScript.
- **Broken things fail the build**, not the visitor's browser.

### Theming

Colours are declared once as custom properties on `:root` and re-declared only
where the palette changes:

- `:root` — light palette (the default)
- `@media (prefers-color-scheme: dark)` — dark palette for "system"
- `:root[data-theme="dark"|"light"]` — an explicit choice, which wins

An inline script in `BaseHead.astro` stamps `data-theme` before first paint, so
there is no flash of the wrong theme.

---

## Deployment

Pushes to `main` trigger [`deploy.yml`](.github/workflows/deploy.yml), which
type-checks, validates content, builds, verifies links, and publishes to GitHub
Pages via the Actions pipeline.

**Required repository settings:**

| Setting                         | Value            |
| ------------------------------- | ---------------- |
| Settings → Pages → Source       | _GitHub Actions_ |
| Settings → General → Visibility | _Public_         |

Pages will not serve a site from a private repository on a free account — it
builds successfully and then returns 404 on every path, which is exactly the
failure this repo hit. Either keep the repo public or upgrade to GitHub Pro.

`public/.nojekyll` is required and must stay: without it, Pages runs Jekyll over
the output and silently drops Astro's `_astro/` directory of hashed CSS, JS, and
images.

### Secrets

| Secret      | Used by                  | Needs                                       |
| ----------- | ------------------------ | ------------------------------------------- |
| `PAT_TOKEN` | `update-github-data.yml` | `read:user`, plus write access to this repo |

This secret already exists on the repository. The workflow checks out with it
rather than the default `GITHUB_TOKEN`, because GitHub suppresses workflow
triggers for pushes made with the default token — a refreshed heatmap would
otherwise land on `main` without ever rebuilding the site.

Nothing else needs a secret: the site makes no runtime API calls and ships no
client-side keys.

---

## CI

| Workflow                 | Trigger                        | Does                                                     |
| ------------------------ | ------------------------------ | -------------------------------------------------------- |
| `ci.yml`                 | PRs, pushes to non-`main`      | Format, types, content schemas, build, links, Lighthouse |
| `deploy.yml`             | Push to `main`, manual         | Same gates, then publish to Pages                        |
| `update-github-data.yml` | Weekly (Mon 04:00 UTC), manual | Refresh contribution heatmap, commit if changed          |

Dependabot ([`dependabot.yml`](.github/dependabot.yml)) opens grouped weekly
dependency PRs and monthly action updates.

Accessibility is a **hard** Lighthouse gate (≥ 0.95). Performance is collected
but only warns, because runner timing is too variable to assert strictly.

---

## Known trade-offs

- **The display font (`TheGoodMonolith`) is loaded from cdnfonts**, the one
  remaining third-party asset on the critical path. It is loaded with
  `display=swap` behind a `preconnect`, so it never blocks text from painting.
  Self-hosting a subset in `public/fonts/` would remove the dependency; it was
  left external to preserve the exact typeface without redistributing the file.
- **The contribution heatmap is refreshed weekly, not live.** That is
  deliberate: it costs the visitor zero requests, and a day-stale heatmap is a
  better trade than an API call on every page view.

---

## History

Version 2 is a rebuild. The previous site was a hand-written multi-page vanilla
JS app that fetched content from Contentful at runtime. What changed and why is
recorded in the commit history on the `rebuild/astro-architecture` branch —
each commit explains the problem it addresses.

## License

[MIT](LICENSE.md)
