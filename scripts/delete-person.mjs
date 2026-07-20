#!/usr/bin/env node
/**
 * delete-person.mjs — remove a lab member from the People page.
 * Removes the matching .person-card and the searchIndex entry.
 * Reads the issue-form body from ISSUE_BODY.
 */

import { p, read, write, fail, setSummary, parseIssueForm, jsEscape, toPlain } from './content-lib.mjs';

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const fields = parseIssueForm(body);
const name = (fields['Name'] || '').trim();
if (!name) fail('The Name field is empty.');
const needlePlain = toPlain(name);

// --- remove the person card whose <h3> matches the name ---
let people = read(p('people.html'));
const cardRe = / {8}<div class="person-card"[^>]*>[\s\S]*?\n {8}<\/div>\n\n?/g;
const matches = [];
people.replace(cardRe, (m, offset) => {
  const h3 = m.match(/<h3>([\s\S]*?)<\/h3>/);
  if (h3 && toPlain(h3[1]).includes(needlePlain)) matches.push({ m, offset });
  return m;
});
if (matches.length === 0) fail(`Could not find a person whose name matches "${name}".`);
if (matches.length > 1) fail(`More than one person matches "${name}". Please give the full exact name.`);
people = people.replace(matches[0].m, '');
write(p('people.html'), people);

// --- remove the searchIndex entry ---
let main = read(p('js', 'main.js'));
const entryRe = /^ {4}\{ page: 'People', url: 'people\.html', title: '([^']*)',[\s\S]*?\},\n/gm;
let removed = false;
main = main.replace(entryRe, (line, title) => {
  if (!removed && toPlain(title).includes(needlePlain)) {
    removed = true;
    return '';
  }
  return line;
});
write(p('js', 'main.js'), main);

setSummary(`Remove person: ${name}`);
