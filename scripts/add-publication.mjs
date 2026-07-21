#!/usr/bin/env node
/**
 * add-publication.mjs — add a publication to the Publications page.
 * Inserts a .pub-entry under the right section (a year, or Preprints), bolds the
 * lab-member authors, saves an attached PDF to pdfs/, and adds a searchIndex entry.
 * Reads the issue-form body from ISSUE_BODY.
 *
 * For testing without network, set CONTENT_PDF_PATH to a local PDF file.
 */

import fs from 'node:fs';
import { p, read, write, fail, setSummary, parseIssueForm, htmlEscape, jsEscape, slugify } from './content-lib.mjs';

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const f = parseIssueForm(body);
const authors = (f['Authors'] || '').trim();
const labAuthors = (f['Lab authors'] || '').trim();
const title = (f['Title'] || '').trim();
const journal = (f['Journal'] || '').trim();
const details = (f['Details'] || '').trim();
const year = (f['Year'] || '').trim();
const isPreprint = (f['Preprint'] || 'No').trim().toLowerCase() === 'yes';
const link = (f['Link'] || '').trim();
const pdfField = (f['PDF'] || '').trim();

if (!authors) fail('The Authors field is empty.');
if (!title) fail('The Title field is empty.');
if (!journal) fail('The Journal field is empty.');
if (!/\b(19|20)\d{2}\b/.test(year)) fail(`The Year field must be a 4-digit year (got "${year}").`);

const firstSurname = authors.split(',')[0].trim().split(/\s+/)[0] || 'paper';
const multiAuthor = authors.includes(',');

// --- authors, with lab members in bold ---
let authorsHtml = htmlEscape(authors);
labAuthors.split(',').map((s) => s.trim()).filter(Boolean).forEach((la) => {
  const e = htmlEscape(la);
  if (e && authorsHtml.includes(e)) authorsHtml = authorsHtml.split(e).join(`<strong>${e}</strong>`);
});

// --- title (ensure it ends with a period) ---
const titleClean = /[.?!]$/.test(title) ? title : `${title}.`;

// --- journal citation ---
const journalHtml = `<em>${htmlEscape(journal)}</em>${details ? `, ${htmlEscape(details)}` : ''}. ${htmlEscape(year)}.`;

// --- optional PDF -> pdfs/<slug>.pdf ---
let pdfFile = '';
const pdfName = `${slugify(`${firstSurname}-${year}-${title.split(/\s+/).slice(0, 3).join('-')}`)}.pdf`;
if (process.env.CONTENT_PDF_PATH) {
  pdfFile = pdfName;
  fs.copyFileSync(process.env.CONTENT_PDF_PATH, p('pdfs', pdfFile));
} else if (pdfField) {
  const url = pdfField.match(/https?:\/\/[^\s)]+/);
  if (!url) fail('The PDF field has no file. Drag a PDF into it, or leave it empty.');
  const res = await fetch(url[0]);
  if (!res.ok) fail(`Could not download the PDF (HTTP ${res.status}).`);
  pdfFile = pdfName;
  fs.writeFileSync(p('pdfs', pdfFile), Buffer.from(await res.arrayBuffer()));
}

// --- links block ---
const links = [];
if (link) links.push(`          <a href="${htmlEscape(link)}" target="_blank" rel="noopener">Link</a>`);
if (pdfFile) links.push(`          <a href="pdfs/${pdfFile}" target="_blank" rel="noopener">PDF</a>`);
const linksInner = links.length ? `\n${links.join('\n')}\n        ` : '';

const entry =
  `      <div class="pub-entry">\n` +
  `        <div class="pub-authors">${authorsHtml}</div>\n` +
  `        <div class="pub-title">${htmlEscape(titleClean)}</div>\n` +
  `        <div class="pub-journal">${journalHtml}</div>\n` +
  `        <div class="pub-links">${linksInner}</div>\n` +
  `      </div>\n\n`;

// --- insert under the right section ---
const section = isPreprint ? 'Preprints' : year;
let pubs = read(p('publications.html'));
const headNeedle = `<h2 class="pub-year">${section}</h2>\n\n`;
if (pubs.includes(headNeedle)) {
  pubs = pubs.replace(headNeedle, headNeedle + entry);
} else {
  const block = `      <!-- ${section} -->\n      <h2 class="pub-year">${section}</h2>\n\n` + entry;
  const firstYear = pubs.match(/\n {6}<!-- \d{4} -->\n/);
  if (firstYear) {
    const idx = firstYear.index + 1;
    pubs = pubs.slice(0, idx) + block + pubs.slice(idx);
  } else {
    fail('Could not find where to add the section in publications.html.');
  }
}
write(p('publications.html'), pubs);

// --- searchIndex entry ---
let main = read(p('js', 'main.js'));
const needle = `    // Publications\n`;
if (!main.includes(needle)) fail('Could not find the Publications search section in js/main.js.');
const searchTitle = multiAuthor ? `${firstSurname} et al. (${year})` : `${firstSurname} (${year})`;
const searchText = `${titleClean} ${journal}.`;
const idx =
  `    { page: 'Publications', url: 'publications.html', title: '${jsEscape(searchTitle)}', text: '${jsEscape(searchText)}' },\n`;
main = main.replace(needle, needle + idx);
write(p('js', 'main.js'), main);

setSummary(`Add publication: ${searchTitle}`);
