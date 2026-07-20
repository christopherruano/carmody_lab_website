#!/usr/bin/env node
/**
 * add-person.mjs — add a current lab member to the People page.
 * Inserts a .person-card at the right seniority position in the Current grid,
 * saves the photo into images/people/, and adds a searchIndex entry.
 * Reads the issue-form body from ISSUE_BODY.
 *
 * For testing without network, set CONTENT_PHOTO_PATH to a local image file.
 */

import fs from 'node:fs';
import {
  p, read, write, fail, setSummary, parseIssueForm, htmlEscape, jsEscape, slugify,
  personCard, insertCurrentMember,
} from './content-lib.mjs';

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const fields = parseIssueForm(body);
const name = (fields['Name'] || '').trim();
const role = (fields['Role'] || '').trim();
const note = (fields['Extra note'] || '').trim();
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

// --- build and insert the card ---
const hasEmail = email && email.toLowerCase() !== 'none';
const hasBio = bio && bio.toLowerCase() !== 'none';
const hasNote = note && note.toLowerCase() !== 'none';
const card = personCard({
  slug,
  photoFile,
  nameHtml: htmlEscape(name),
  roleHtml: htmlEscape(role),
  noteHtml: hasNote ? htmlEscape(note) : '',
  emailHtml: hasEmail ? htmlEscape(email) : '',
  bioHtml: hasBio ? htmlEscape(bio) : '',
});

let people = read(p('people.html'));
try {
  people = insertCurrentMember(people, card, role);
} catch {
  fail('Could not find the Current Laboratory Members grid in people.html.');
}
write(p('people.html'), people);

// --- searchIndex entry ---
let main = read(p('js', 'main.js'));
const needle = `    // People - Current\n`;
if (!main.includes(needle)) fail('Could not find the People search section in js/main.js.');
const searchText = [role, hasBio ? bio : ''].filter(Boolean).join('. ');
const entry =
  `    { page: 'People', url: 'people.html', title: '${jsEscape(name)}', text: '${jsEscape(searchText)}' },\n`;
main = main.replace(needle, needle + entry);
write(p('js', 'main.js'), main);

setSummary(`Add person: ${name}`);
