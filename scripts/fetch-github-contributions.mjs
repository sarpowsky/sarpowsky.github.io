#!/usr/bin/env node
/**
 * Refreshes src/data/github-contributions.json from the GitHub GraphQL API.
 *
 * Deliberate change from the previous version: there is **no mock-data
 * fallback**. The old script silently substituted `Math.random()` contribution
 * counts whenever the API call failed -- for a bad token, a rate limit, a
 * network blip -- and the workflow then committed that fabricated history to
 * the repository, where it was published as if it were real. This script exits
 * non-zero instead, leaving the last known-good data in place and turning the
 * workflow red so the failure is visible.
 *
 * Usage: GITHUB_TOKEN=<pat> GITHUB_USERNAME=sarpowsky node scripts/fetch-github-contributions.mjs
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/data/github-contributions.json'
);

const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (!token) fail('GITHUB_TOKEN is not set. A token with read:user scope is required.');
if (!username) fail('GITHUB_USERNAME is not set.');

const query = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

/** GitHub's own thresholds for heatmap intensity. */
function levelFor(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'sarpowsky-portfolio-build',
  },
  body: JSON.stringify({ query, variables: { login: username } }),
});

if (!response.ok) {
  fail(`GitHub API returned HTTP ${response.status} ${response.statusText}`);
}

const payload = await response.json();

if (payload.errors?.length) {
  fail(`GitHub API errors: ${payload.errors.map((e) => e.message).join('; ')}`);
}

const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar) {
  fail(`No contribution calendar returned for user "${username}".`);
}

const days = calendar.weeks
  .flatMap((week) => week.contributionDays)
  .map((day) => ({
    date: day.date,
    count: day.contributionCount,
    level: levelFor(day.contributionCount),
  }));

// A year of data is ~365 entries. Anything far below that means a partial or
// malformed response, which should not overwrite good data.
if (days.length < 300) {
  fail(`Refusing to write: expected ~365 days, received ${days.length}.`);
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(days, null, 2)}\n`, 'utf8');

console.log(
  `✓ Wrote ${days.length} days (${calendar.totalContributions} contributions) for ${username} to ${OUT}`
);
