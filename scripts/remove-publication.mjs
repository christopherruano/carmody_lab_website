#!/usr/bin/env node
/**
 * remove-publication.mjs — remove a publication from the Publications page.
 * Finds the entry by words from its title, removes it and its searchIndex entry.
 * Reads the issue-form body from ISSUE_BODY.
 */

import { p, read, write, fail, setSummary, parseIssueForm, toPlain, PUB_ENTRY_RE } from './content-lib.mjs';

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const words = (parseIssueForm(body)['Title'] || '').trim();
if (!words) fail('The Title field is empty.');
const needle = toPlain(words);

// remove the matching pub-entry
let pubs = read(p('publications.html'));
const re = new RegExp(PUB_ENTRY_RE.source, 'g');
const found = [];
let m;
while ((m = re.exec(pubs)) !== null) {
  const t = m[0].match(/<div class="pub-title">([\s\S]*?)<\/div>/);
  if (t && toPlain(t[1]).includes(needle)) found.push(m[0]);
}
if (found.length === 0) fail(`Could not find a publication whose title matches "${words}".`);
if (found.length > 1) fail(`More than one publication matches "${words}". Use more words from the title.`);
pubs = pubs.replace(found[0] + '\n\n', '');
write(p('publications.html'), pubs);

// remove the matching searchIndex entry
let main = read(p('js', 'main.js'));
const entryRe = /^ {4}\{ page: 'Publications', url: 'publications\.html', title: '(?:\\.|[^'])*', text: '((?:\\.|[^'])*)' \},\n/gm;
let removed = false;
main = main.replace(entryRe, (full, text) => {
  if (!removed && toPlain(text.replace(/\\(['\\])/g, '$1')).includes(needle)) {
    removed = true;
    return '';
  }
  return full;
});
write(p('js', 'main.js'), main);

setSummary(`Remove publication: ${words}`);
