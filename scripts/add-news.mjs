#!/usr/bin/env node
/**
 * add-news.mjs — add a news item.
 * Edits news.html, the Recent News list in index.html (kept to 4), and the
 * searchIndex in js/main.js. Reads the issue-form body from ISSUE_BODY.
 */

import { p, read, write, fail, setSummary, parseIssueForm, htmlEscape, jsEscape } from './content-lib.mjs';

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

// 1. news.html
let news = read(p('news.html'));
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
    `      <!-- ${year} -->\n      <h2 class="news-year-header">${year}</h2>\n\n` + newsItem;
  const firstYear = news.match(/\n {6}<!-- \d{4} -->\n/);
  if (firstYear) {
    const idx = firstYear.index + 1;
    news = news.slice(0, idx) + yearBlock + news.slice(idx);
  } else {
    const c = `<section class="section">\n    <div class="container">\n\n`;
    if (!news.includes(c)) fail('Could not find where to add the year in news.html.');
    news = news.replace(c, c + yearBlock);
  }
}
write(p('news.html'), news);

// 2. index.html (Recent News, keep newest 4)
let index = read(p('index.html'));
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
write(p('index.html'), index);

// 3. js/main.js (searchIndex)
let main = read(p('js', 'main.js'));
const searchNeedle = `    // News (selected highlights)\n`;
if (!main.includes(searchNeedle)) fail('Could not find the News search section in js/main.js.');
const entry =
  `    { page: 'News', url: 'news.html', title: '${jsEscape(date)}', text: '${jsEscape(text)}' },\n`;
main = main.replace(searchNeedle, searchNeedle + entry);
write(p('js', 'main.js'), main);

setSummary(`Add news item: ${date}`);
