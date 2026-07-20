#!/usr/bin/env node
/**
 * add-news.mjs — insert a news item into the site the correct way.
 *
 * Reads a GitHub issue-form body from the ISSUE_BODY environment variable,
 * then edits three places so the site stays in sync:
 *   1. news.html          — a .news-item at the top of the correct year
 *   2. index.html         — a .recent-news-item at the top, trimmed to 4
 *   3. js/main.js         — a matching entry in the searchIndex
 *
 * The site has no build step, so this only rewrites the existing files.
 * Set CONTENT_ROOT to run against a copy of the repo (used for testing).
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.env.CONTENT_ROOT || process.cwd();
const NEWS = path.join(ROOT, 'news.html');
const INDEX = path.join(ROOT, 'index.html');
const MAIN = path.join(ROOT, 'js', 'main.js');

function fail(message) {
  console.error(`add-news: ${message}`);
  process.exit(1);
}

/** Parse a GitHub issue-form body into { 'Field label': 'value' }. */
function parseIssueForm(body) {
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
function htmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escape text for use inside a single-quoted JavaScript string on one line. */
function jsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n+/g, ' ').trim();
}

const body = process.env.ISSUE_BODY || '';
if (!body.trim()) fail('ISSUE_BODY is empty.');

const fields = parseIssueForm(body);
const date = (fields['Date'] || '').trim();
const text = (fields['News text'] || '').trim();

if (!date) fail('The Date field is empty.');
if (!text) fail('The News text field is empty.');

const yearMatch = date.match(/\b(20\d{2})\b/);
if (!yearMatch) fail(`Could not find a year in the date "${date}".`);
const year = yearMatch[1];

const dateHtml = htmlEscape(date);
const textHtml = htmlEscape(text);

// ---- 1. news.html -------------------------------------------------------
let news = fs.readFileSync(NEWS, 'utf8');

const newsItem =
  `      <div class="news-item">\n` +
  `        <div class="news-date">${dateHtml}</div>\n` +
  `        <div class="news-text">${textHtml}</div>\n` +
  `      </div>\n\n`;

const yearNeedle = `<h2 class="news-year-header">${year}</h2>\n\n`;
if (news.includes(yearNeedle)) {
  news = news.replace(yearNeedle, yearNeedle + newsItem);
} else {
  const yearBlock =
    `      <!-- ${year} -->\n` +
    `      <h2 class="news-year-header">${year}</h2>\n\n` +
    newsItem;
  const firstYear = news.match(/\n {6}<!-- \d{4} -->\n/);
  if (firstYear) {
    const idx = firstYear.index + 1; // keep the leading newline in place
    news = news.slice(0, idx) + yearBlock + news.slice(idx);
  } else {
    const containerNeedle = `<section class="section">\n    <div class="container">\n\n`;
    if (!news.includes(containerNeedle)) fail('Could not find where to add the year in news.html.');
    news = news.replace(containerNeedle, containerNeedle + yearBlock);
  }
}
fs.writeFileSync(NEWS, news);

// ---- 2. index.html (Recent News, keep newest 4) -------------------------
let index = fs.readFileSync(INDEX, 'utf8');

const listNeedle = `      <div class="recent-news-list">\n`;
if (!index.includes(listNeedle)) fail('Could not find the Recent News list in index.html.');

const recentItem =
  `        <div class="recent-news-item">\n` +
  `          <div class="recent-news-date">${dateHtml}</div>\n` +
  `          <div class="recent-news-text">${textHtml}</div>\n` +
  `        </div>\n`;

index = index.replace(listNeedle, listNeedle + recentItem);

const recentRe =
  / {8}<div class="recent-news-item">\n {10}<div class="recent-news-date">[\s\S]*?<\/div>\n {10}<div class="recent-news-text">[\s\S]*?<\/div>\n {8}<\/div>\n/g;
let kept = 0;
index = index.replace(recentRe, (m) => (++kept <= 4 ? m : ''));
fs.writeFileSync(INDEX, index);

// ---- 3. js/main.js (searchIndex) ----------------------------------------
let main = fs.readFileSync(MAIN, 'utf8');

const searchNeedle = `    // News (selected highlights)\n`;
if (!main.includes(searchNeedle)) fail('Could not find the News search section in js/main.js.');

const entry =
  `    { page: 'News', url: 'news.html', title: '${jsEscape(date)}', text: '${jsEscape(text)}' },\n`;
main = main.replace(searchNeedle, searchNeedle + entry);
fs.writeFileSync(MAIN, main);

// ---- report -------------------------------------------------------------
console.log(`Added news item dated "${date}" (year ${year}).`);
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `date=${date}\n`);
}
