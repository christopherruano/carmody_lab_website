#!/usr/bin/env node
/**
 * add-person.mjs — add a current lab member to the People page.
 * Inserts a .person-card at the end of the Current Laboratory Members grid,
 * saves the photo into images/people/, and adds a searchIndex entry.
 * Reads the issue-form body from ISSUE_BODY.
 *
 * For testing without network, set CONTENT_PHOTO_PATH to a local image file.
 */

import fs from 'node:fs';
import { p, read, write, fail, setSummary, parseIssueForm, htmlEscape, jsEscape, slugify } from './content-lib.mjs';

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const fields = parseIssueForm(body);
const name = (fields['Name'] || '').trim();
const role = (fields['Role'] || '').trim();
const email = (fields['Email'] || '').trim();
const bio = (fields['Bio'] || '').trim();
const photoField = (fields['Photo'] || '').trim();

if (!name) fail('The Name field is empty.');
if (!role) fail('The Role field is empty.');

const slug = slugify(name);
if (!slug) fail(`Could not make a file name from "${name}".`);

// --- resolve the photo -> images/people/<slug>.<ext> ---
const extFromType = (ct) =>
  ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('gif') ? 'gif' : 'jpg';

let photoFile;
if (process.env.CONTENT_PHOTO_PATH) {
  const src = process.env.CONTENT_PHOTO_PATH;
  const ext = (src.split('.').pop() || 'jpg').toLowerCase();
  photoFile = `${slug}.${ext}`;
  fs.copyFileSync(src, p('images', 'people', photoFile));
} else {
  const urlMatch = photoField.match(/https?:\/\/[^\s)]+/);
  if (!urlMatch) fail('No photo was found. Drag a photo into the Photo field.');
  const res = await fetch(urlMatch[0]);
  if (!res.ok) fail(`Could not download the photo (HTTP ${res.status}).`);
  const ext = extFromType(res.headers.get('content-type') || '');
  photoFile = `${slug}.${ext}`;
  fs.writeFileSync(p('images', 'people', photoFile), Buffer.from(await res.arrayBuffer()));
}

// --- build the card ---
const lines = [
  `        <div class="person-card" id="${slug}">`,
  `          <img src="images/people/${photoFile}" alt="${htmlEscape(name)}" class="person-photo">`,
  `          <h3>${htmlEscape(name)}</h3>`,
  `          <div class="person-role">${htmlEscape(role)}</div>`,
];
if (email && email.toLowerCase() !== 'none') {
  lines.push(`          <div class="person-email"><a href="mailto:${htmlEscape(email)}">${htmlEscape(email)}</a></div>`);
}
if (bio && bio.toLowerCase() !== 'none') {
  lines.push(`          <p class="person-bio">${htmlEscape(bio)}</p>`);
}
lines.push('        </div>');
const card = lines.join('\n') + '\n\n';

// --- insert into the current-members grid, ordered by seniority ---
// The Current grid is ordered by role. Lower rank = more senior = higher up.
// A new person goes after the last person of the same rank, before the first
// person of a more-junior rank. Unknown roles go to the end.
function rankOf(roleText) {
  const r = roleText.toLowerCase();
  if (r.includes('principal investigator') || r.includes('professor')) return 0;
  if (r.includes('lecturer')) return 1;
  if (r.includes('postdoc')) return 2;
  if (r.includes('graduate') && !r.includes('undergraduate')) return 3;
  if (r.includes('undergraduate')) return 4;
  if (r.includes('associate researcher') || r.includes('associate')) return 5;
  return 6;
}
const newRank = rankOf(role);

let people = read(p('people.html'));
const gridClose = `      </div>\n    </div>\n  </section>\n\n  <section class="section section-alt">`;
const gridCloseIdx = people.indexOf(gridClose);
if (gridCloseIdx === -1) fail('Could not find the Current Laboratory Members grid in people.html.');
const currentStart = people.indexOf('Current Laboratory Members');

const cardRe = / {8}<div class="person-card"[^>]*>[\s\S]*?\n {8}<\/div>\n/g;
let insertAt = gridCloseIdx; // default: end of the current grid
let m;
while ((m = cardRe.exec(people)) !== null) {
  if (m.index < currentStart) continue;   // before the Current section
  if (m.index >= gridCloseIdx) break;     // reached the Former section
  const roleMatch = m[0].match(/<div class="person-role">([\s\S]*?)<\/div>/);
  const existingRank = roleMatch ? rankOf(roleMatch[1]) : 6;
  if (existingRank > newRank) { insertAt = m.index; break; }
}
people = people.slice(0, insertAt) + card + people.slice(insertAt);
write(p('people.html'), people);

// --- searchIndex entry ---
let main = read(p('js', 'main.js'));
const needle = `    // People - Current\n`;
if (!main.includes(needle)) fail('Could not find the People search section in js/main.js.');
const searchText = [role, bio].filter((s) => s && s.toLowerCase() !== 'none').join('. ');
const entry =
  `    { page: 'People', url: 'people.html', title: '${jsEscape(name)}', text: '${jsEscape(searchText)}' },\n`;
main = main.replace(needle, needle + entry);
write(p('js', 'main.js'), main);

setSummary(`Add person: ${name}`);
