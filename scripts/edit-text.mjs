#!/usr/bin/env node
/**
 * edit-text.mjs — change a piece of visible text on one page.
 * Reads the issue-form body from ISSUE_BODY (Page, Current text, New text).
 *
 * The pages store typographic characters as HTML entities, so an exact match
 * can miss. This tries an exact match first, then a "loose" match that treats
 * quotes, apostrophes, dashes, ampersands, and runs of whitespace flexibly.
 * Every change is reviewed in a pull request, so a missed match is safe.
 */

import { p, read, write, fail, setSummary, parseIssueForm, htmlEscape } from './content-lib.mjs';

const PAGES = {
  home: 'index.html',
  about: 'about.html',
  research: 'research.html',
  people: 'people.html',
  publications: 'publications.html',
  laboratory: 'laboratory.html',
  'our space': 'laboratory.html',
  news: 'news.html',
  contact: 'contact.html',
};

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const fields = parseIssueForm(body);
const pageName = (fields['Page'] || '').trim().toLowerCase();
const current = (fields['Current text'] || '').trim();
const next = (fields['New text'] || '').trim();

const file = PAGES[pageName];
if (!file) fail(`Unknown page "${fields['Page']}". Choose one of: ${Object.keys(PAGES).join(', ')}.`);
if (!current) fail('The Current text field is empty.');
if (!next) fail('The New text field is empty.');

let html = read(p(file));
const replacement = htmlEscape(next);

function replaceOnce(source, needle, value) {
  const i = source.indexOf(needle);
  if (i === -1) return null;
  return source.slice(0, i) + value + source.slice(i + needle.length);
}

// 1. exact literal match
let out = replaceOnce(html, current, replacement);

// 2. exact match against an HTML-escaped version of the current text
if (out === null) out = replaceOnce(html, htmlEscape(current), replacement);

// 3. loose match: allow entity/typographic variants and flexible whitespace
if (out === null) {
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let pattern = '';
  for (const ch of current) {
    if (/\s/.test(ch)) pattern += '\\s+';
    else if (ch === "'") pattern += "(?:'|\\u2019|\\u2018|&rsquo;|&lsquo;|&#8217;|&#8216;)";
    else if (ch === '"') pattern += '(?:"|\\u201C|\\u201D|&ldquo;|&rdquo;|&#8220;|&#8221;)';
    else if (ch === '-') pattern += '(?:-|\\u2013|\\u2014|&ndash;|&mdash;)';
    else if (ch === '&') pattern += '(?:&amp;|&)';
    else pattern += escapeRe(ch);
  }
  const re = new RegExp(pattern);
  const m = html.match(re);
  if (m) out = html.slice(0, m.index) + replacement + html.slice(m.index + m[0].length);
}

if (out === null) {
  fail(`Could not find that text on the ${pageName} page. Check it matches the site exactly, or ask Claude Code.`);
}

write(p(file), out);
setSummary(`Edit text on the ${pageName} page`);
