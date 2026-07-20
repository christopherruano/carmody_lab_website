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

/** Decode common HTML entities to plain characters, keeping case. For search text. */
export function decodeEntities(s) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&rsquo;|&#8217;|&lsquo;|&#8216;/g, "'")
    .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, '"')
    .replace(/&ndash;|&#8211;/g, '–')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#241;/g, 'ñ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Seniority rank for the Current members grid. Lower = more senior = higher up. */
export function rankOf(roleText) {
  const r = (roleText || '').toLowerCase();
  if (r.includes('principal investigator') || r.includes('professor')) return 0;
  if (r.includes('lecturer')) return 1;
  if (r.includes('postdoc')) return 2;
  if (r.includes('graduate') && !r.includes('undergraduate')) return 3;
  if (r.includes('undergraduate')) return 4;
  if (r.includes('associate researcher') || r.includes('associate')) return 5;
  return 6; // unknown role -> most junior
}

/**
 * Build a .person-card. All *Html values must already be HTML-safe.
 * Returns the card block with no trailing newline.
 */
export function personCard({ slug, photoFile, nameHtml, roleHtml, noteHtml, emailHtml, bioHtml }) {
  const idAttr = slug ? ` id="${slug}"` : '';
  const lines = [
    `        <div class="person-card"${idAttr}>`,
    `          <img src="images/people/${photoFile}" alt="${nameHtml}" class="person-photo">`,
    `          <h3>${nameHtml}</h3>`,
    `          <div class="person-role">${roleHtml}</div>`,
  ];
  if (noteHtml) lines.push(`          <div class="person-role-former">${noteHtml}</div>`);
  if (emailHtml) lines.push(`          <div class="person-email"><a href="mailto:${emailHtml}">${emailHtml}</a></div>`);
  if (bioHtml) lines.push(`          <p class="person-bio">${bioHtml}</p>`);
  lines.push('        </div>');
  return lines.join('\n');
}

const GRID_CLOSE = `      </div>\n    </div>\n  </section>\n\n  <section class="section section-alt">`;

/** Regex matching a .person-card block (no trailing newline). */
export const CARD_RE = / {8}<div class="person-card"[^>]*>[\s\S]*?\n {8}<\/div>/g;

/** Index range [start, end) of the Current-members grid in people.html. */
export function currentGridRange(people) {
  const end = people.indexOf(GRID_CLOSE);
  const start = people.indexOf('Current Laboratory Members');
  if (end === -1 || start === -1) throw new Error('current grid not found');
  return { start, end };
}

/** Insert a card into the Current grid at the right seniority position. */
export function insertCurrentMember(people, card, role) {
  const { start, end } = currentGridRange(people);
  const newRank = rankOf(role);
  const re = new RegExp(CARD_RE.source, 'g');
  let insertAt = end;
  let m;
  while ((m = re.exec(people)) !== null) {
    if (m.index < start) continue;
    if (m.index >= end) break;
    const rm = m[0].match(/<div class="person-role">([\s\S]*?)<\/div>/);
    if (rm && rankOf(rm[1]) > newRank) { insertAt = m.index; break; }
  }
  return people.slice(0, insertAt) + card + '\n\n' + people.slice(insertAt);
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
