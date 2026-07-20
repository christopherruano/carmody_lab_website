#!/usr/bin/env node
/**
 * edit-person.mjs — change a current lab member in place.
 * Finds the member's card, applies only the fields you filled in, and rebuilds
 * the card. If the role changes rank, the card moves to the right seniority spot.
 * Reads the issue-form body from ISSUE_BODY.
 *
 * Blank field = keep the current value. The word "none" = remove that line.
 * For testing without network, set CONTENT_PHOTO_PATH to a local image file.
 */

import fs from 'node:fs';
import {
  p, read, write, fail, setSummary, parseIssueForm, htmlEscape, jsEscape, slugify,
  decodeEntities, toPlain, rankOf, personCard, insertCurrentMember, currentGridRange, CARD_RE,
} from './content-lib.mjs';

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const f = parseIssueForm(body);
const name = (f['Name'] || '').trim();
if (!name) fail('The Name field is empty.');
const namePlain = toPlain(name);

const newRole = (f['New role'] || '').trim();
const newNote = (f['New extra note'] || '').trim();
const newEmail = (f['New email'] || '').trim();
const newBio = (f['New bio'] || '').trim();
const newPhoto = (f['New photo'] || '').trim();
const KEEP = '(keep the same)';

// --- find the member's card in the Current grid ---
let people = read(p('people.html'));
let range;
try { range = currentGridRange(people); } catch { fail('Could not find the Current grid in people.html.'); }
const re = new RegExp(CARD_RE.source, 'g');
const found = [];
let m;
while ((m = re.exec(people)) !== null) {
  if (m.index < range.start || m.index >= range.end) continue;
  const h3 = m[0].match(/<h3>([\s\S]*?)<\/h3>/);
  if (h3 && toPlain(h3[1]).includes(namePlain)) found.push(m[0]);
}
if (found.length === 0) {
  if (toPlain(people.slice(range.end)).includes(namePlain)) {
    fail(`"${name}" is in the Former list. Use the Edit-text form or Claude Code for former members.`);
  }
  fail(`Could not find a current member whose name matches "${name}".`);
}
if (found.length > 1) fail(`More than one member matches "${name}". Please give the full exact name.`);
const oldCard = found[0];

// --- parse the existing card ---
const grab = (rx) => { const mm = oldCard.match(rx); return mm ? mm[1] : ''; };
const idHtml = grab(/<div class="person-card"(?: id="([^"]*)")?>/);
const nameHtml = grab(/<h3>([\s\S]*?)<\/h3>/);
const roleHtml = grab(/<div class="person-role">([\s\S]*?)<\/div>/);
const noteHtml = grab(/<div class="person-role-former">([\s\S]*?)<\/div>/);
const emailHtml = grab(/<div class="person-email"><a href="mailto:([^"]+)">/);
const bioHtml = grab(/<p class="person-bio">([\s\S]*?)<\/p>/);
const oldPhoto = grab(/<img src="images\/people\/([^"]+)"/);
const slug = idHtml || slugify(name);

// --- apply overrides (blank = keep, "none" = remove) ---
const isNone = (v) => v.toLowerCase() === 'none';
const roleChanged = newRole && newRole !== KEEP;
const effRoleHtml = roleChanged ? htmlEscape(newRole) : roleHtml;
const effRolePlain = roleChanged ? newRole : decodeEntities(roleHtml);

const effNoteHtml = !newNote ? noteHtml : isNone(newNote) ? '' : htmlEscape(newNote);
const effEmailHtml = !newEmail ? emailHtml : isNone(newEmail) ? '' : htmlEscape(newEmail);
const effBioHtml = !newBio ? bioHtml : isNone(newBio) ? '' : htmlEscape(newBio);
const effBioPlain = !newBio ? decodeEntities(bioHtml) : isNone(newBio) ? '' : newBio;

// --- photo (optional replace) ---
let photoFile = oldPhoto;
if (process.env.CONTENT_PHOTO_PATH) {
  const src = process.env.CONTENT_PHOTO_PATH;
  const ext = (src.split('.').pop() || 'jpg').toLowerCase();
  photoFile = `${slug}.${ext}`;
  fs.copyFileSync(src, p('images', 'people', photoFile));
} else if (newPhoto) {
  const url = newPhoto.match(/https?:\/\/[^\s)]+/);
  if (!url) fail('The New photo field has no photo. Drag a photo into it, or leave it empty.');
  const res = await fetch(url[0]);
  if (!res.ok) fail(`Could not download the new photo (HTTP ${res.status}).`);
  const ct = res.headers.get('content-type') || '';
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('gif') ? 'gif' : 'jpg';
  photoFile = `${slug}.${ext}`;
  fs.writeFileSync(p('images', 'people', photoFile), Buffer.from(await res.arrayBuffer()));
}

// --- rebuild the card ---
const newCard = personCard({
  slug, photoFile, nameHtml,
  roleHtml: effRoleHtml,
  noteHtml: effNoteHtml,
  emailHtml: effEmailHtml,
  bioHtml: effBioHtml,
});

if (rankOf(effRolePlain) === rankOf(decodeEntities(roleHtml))) {
  people = people.replace(oldCard, newCard); // same rank -> edit in place
} else {
  people = people.replace(oldCard + '\n\n', ''); // remove, then re-insert by seniority
  people = insertCurrentMember(people, newCard, effRolePlain);
}
write(p('people.html'), people);

// --- update the searchIndex text ---
let main = read(p('js', 'main.js'));
const searchText = [effRolePlain, effBioPlain].filter(Boolean).join('. ');
const entryRe = /^( {4}\{ page: 'People', url: 'people\.html', title: ')((?:\\.|[^'])*)(', text: ')((?:\\.|[^'])*)(' \},\n)/gm;
let done = false;
main = main.replace(entryRe, (full, pre, title, mid, _text, suf) => {
  if (!done && toPlain(title.replace(/\\(['\\])/g, '$1')).includes(namePlain)) {
    done = true;
    return pre + title + mid + jsEscape(searchText) + suf;
  }
  return full;
});
write(p('js', 'main.js'), main);

setSummary(`Edit person: ${name}`);
