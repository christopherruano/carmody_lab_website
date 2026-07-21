#!/usr/bin/env node
/**
 * edit-publication.mjs — fix the authors, title, or link of a publication.
 * Finds the entry by words from its current title and applies only the fields you
 * filled in (blank = keep). It does NOT change the journal, year, or section — for
 * those, remove the entry and add it again. Reads the issue-form body from ISSUE_BODY.
 */

import {
  p, read, write, fail, setSummary, parseIssueForm, htmlEscape, jsEscape, toPlain, decodeEntities, boldAuthors, PUB_ENTRY_RE,
} from './content-lib.mjs';

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const f = parseIssueForm(body);
const words = (f['Find by title'] || '').trim();
const newAuthors = (f['New authors'] || '').trim();
const newLabAuthors = (f['New lab authors'] || '').trim();
const newTitle = (f['New title'] || '').trim();
const newLink = (f['New link'] || '').trim();
if (!words) fail('The "Find by title" field is empty.');
const needle = toPlain(words);

// find the entry
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
const oldEntry = found[0];

// existing pieces
const grab = (rx) => { const mm = oldEntry.match(rx); return mm ? mm[1] : ''; };
const authorsHtml = grab(/<div class="pub-authors">([\s\S]*?)<\/div>/);
const titleHtml = grab(/<div class="pub-title">([\s\S]*?)<\/div>/);
const journalHtml = grab(/<div class="pub-journal">([\s\S]*?)<\/div>/);
const oldPdf = grab(/<a href="(pdfs\/[^"]+)"/);

// apply overrides
const effAuthorsHtml = newAuthors ? boldAuthors(newAuthors, newLabAuthors) : authorsHtml;
const titleChanged = !!newTitle;
const effTitleClean = titleChanged ? (/[.?!]$/.test(newTitle) ? newTitle : `${newTitle}.`) : '';
const effTitleHtml = titleChanged ? htmlEscape(effTitleClean) : titleHtml;

// links: rebuild if a new link is given; always keep an existing PDF
let linksInner;
if (newLink) {
  const links = [`          <a href="${htmlEscape(newLink)}" target="_blank" rel="noopener">Link</a>`];
  if (oldPdf) links.push(`          <a href="${oldPdf}" target="_blank" rel="noopener">PDF</a>`);
  linksInner = `\n${links.join('\n')}\n        `;
} else {
  linksInner = grab(/<div class="pub-links">([\s\S]*?)<\/div>\n {6}<\/div>/);
}

const newEntry =
  `      <div class="pub-entry">\n` +
  `        <div class="pub-authors">${effAuthorsHtml}</div>\n` +
  `        <div class="pub-title">${effTitleHtml}</div>\n` +
  `        <div class="pub-journal">${journalHtml}</div>\n` +
  `        <div class="pub-links">${linksInner}</div>\n` +
  `      </div>`;

pubs = pubs.replace(oldEntry, newEntry);
write(p('publications.html'), pubs);

// update searchIndex text only if the title changed
if (titleChanged) {
  let main = read(p('js', 'main.js'));
  const journalPlain = decodeEntities(journalHtml).replace(/\.$/, '');
  const entryRe = /^( {4}\{ page: 'Publications', url: 'publications\.html', title: '(?:\\.|[^'])*', text: ')((?:\\.|[^'])*)(' \},\n)/gm;
  let done = false;
  main = main.replace(entryRe, (full, pre, text, suf) => {
    if (!done && toPlain(text.replace(/\\(['\\])/g, '$1')).includes(needle)) {
      done = true;
      return pre + jsEscape(`${effTitleClean} ${journalPlain}.`) + suf;
    }
    return full;
  });
  write(p('js', 'main.js'), main);
}

setSummary(`Edit publication: ${words}`);
