/**
 * content-lib.mjs — shared helpers for the content-bot generator scripts.
 *
 * These scripts edit the site's existing HTML/JS the correct way. The site has
 * no build step, so the generators only rewrite the files that are already there.
 * Set CONTENT_ROOT to run against a copy of the repo (used for testing).
 */

import fs from 'node:fs';
import path from 'node:path';

export const ROOT = process.env.CONTENT_ROOT || process.cwd();

export function p(...parts) {
  return path.join(ROOT, ...parts);
}

export function read(file) {
  return fs.readFileSync(file, 'utf8');
}

export function write(file, data) {
  fs.writeFileSync(file, data);
}

export function fail(message) {
  console.error(`content-bot: ${message}`);
  process.exit(1);
}

/** Print a one-line summary the workflow uses for the pull-request title. */
export function setSummary(summary) {
  console.log(summary);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `summary=${summary}\n`);
  }
}

/** Parse a GitHub issue-form body into { 'Field label': 'value' }. */
export function parseIssueForm(body) {
  const fields = {};
  const parts = body.split(/\r?\n?###\s+/).map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const label = (nl === -1 ? part : part.slice(0, nl)).trim();
    let value = nl === -1 ? '' : part.slice(nl + 1).trim();
    if (value === '_No response_') value = '';
    fields[label] = value;
  }
  return fields;
}

/** Escape text for use inside HTML element content. */
export function htmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escape text for a single-quoted JavaScript string on one line. */
export function jsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n+/g, ' ').trim();
}

/** Make a file-name-safe slug from a person's name. */
export function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Remove HTML tags and decode a few common entities, for loose text matching. */
export function toPlain(s) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, '"')
    .replace(/&ndash;|&#8211;/g, '-')
    .replace(/&mdash;|&#8212;/g, '-')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#241;/g, 'n')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
