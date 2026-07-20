# CLAUDE.md — Guide for AI assistants

Claude Code reads this file automatically. Read it before you edit. This file keeps
edits correct and consistent, also when a non-technical person makes them. The guides
for people are `Maintenance-Guide.pdf` and `Handoff-Notes.pdf`. Keep those guides
correct when you change how the website works. Refer to "Regenerate the guides".

*The text in this file follows ASD-STE100 Simplified Technical English: short
sentences, active voice, and consistent words.*

## About the website
This is the public website for the Carmody Lab (Nutritional & Microbial Ecology
Laboratory, Harvard HEB). The address is **https://nme.fas.harvard.edu**.

- **Static website.** It uses HTML, one CSS file, and one JS file. It has no build
  step, no framework, no package manager, and no dependencies. The website serves
  exactly what is in the repository.
- **Hosting:** GitHub Pages. It serves the `main` branch from the root folder.
- **Deploy:** a push to `main` publishes the website automatically (about 1 min).
  There is no other deploy step. Do not make a `gh-pages` branch or a build folder.
- **Do not edit or delete `CNAME`** (`nme.fas.harvard.edu`). This file sets the custom
  domain. If you remove it, the website loses its address.

## File map
| Path | Function |
|------|---------|
| `index.html` | Home page: hero slideshow, highlights, Recent News |
| `research.html` | 3 research themes (tab / accordion) |
| `people.html` | Current and Former lab members |
| `publications.html` | Publications by year, plus Preprints |
| `laboratory.html` | "Our Space" / facilities |
| `news.html` | Full news list, in groups by year |
| `contact.html` | Contact cards and address |
| `about.html` | Mission statement (in the nav as "About") |
| `js/main.js` | Nav, footer, search index, slideshow, research tabs, news "load more", bio truncation |
| `css/styles.css` | All styles (design tokens are CSS variables at the top) |
| `images/`, `images/people/`, `images/research/`, `images/lab/`, `images/about/`, `images/hero/` | Images |
| `pdfs/` | PDFs of publications |
| `docs/Carmody_CV.pdf` | The CV |

## Files that you must keep in sync
The website has no database. Thus some content is in more than one place. When you
change one place, change the other place in the **same** edit.

1. **Nav and footer.** `js/main.js` makes these one time (`renderNav`,
   `renderFooter`). It puts them into each page through `<div id="site-nav">` and
   `<div id="site-footer">`. To change a menu item, an address, or a phone number,
   edit `js/main.js`. Do not edit the pages. The pages have no nav or footer in them.

2. **Site search.** `js/main.js` has an array with the name `searchIndex`. A person
   maintains this array by hand. The pages do not make it. When you add, change, or
   remove a **member**, a **publication**, or an important **news** item, change the
   `searchIndex` entry also. Keep each entry correct against the page.

3. **Recent News on the home page.** `index.html` (`.recent-news-list`) shows the top
   of `news.html`. When you add a news item to `news.html`, add it to the home-page
   list also. Then keep the home-page list to the **4 newest** items.

4. **Slideshow.** The images are in `index.html` (`.hero-slide` `<picture>` blocks,
   with `slideN.jpg` and `slideN-mobile.jpg`). The captions are in `js/main.js`
   (`slideData`). Caption N goes with slide N. Keep the 2 lists the same length and
   in the same order.

## Rules for the content
- Use HTML entities in the markup, not typographic characters: `&amp;` `&rsquo;`
  `&ldquo;` `&rdquo;` `&ndash;` `&mdash;` `&rarr;`. **Do not put curly quotes in an
  HTML attribute or a JS string.** A curly quote around a `class="..."` breaks it.
  (This was a real defect. It is now corrected.)
- Publications: put lab members' names in `<strong>`. A `*` marks an equal
  contribution (refer to the note at the top of `publications.html`). External links
  use `target="_blank" rel="noopener"`.
- People: each card is a `.person-card` with `.person-photo`, an `<h3>` name, and a
  `.person-role`. Add `.person-role-former` or `.person-destination` if you need it.
  Current members are in the first section. Former members are in the second section,
  each with a `.person-destination`.
- News: use `<h2 class="news-year-header">YEAR</h2>`, with the newest item first.
  Each item is a `.news-item` with a `.news-date` and a `.news-text`.
- Put photos of members in `images/people/` (square, 600px or more). Put PDFs of
  publications in `pdfs/`. Replace the CV at `docs/Carmody_CV.pdf`. Keep the file name.

## Accessibility: keep these features
Keep the skip link, the ARIA roles on the nav, search, and tabs, the `.sr-only`
"opens in new tab" labels from `markExternalLinks`, the keyboard control on the
research tabs, and the digital-accessibility link in the footer. Do not remove these
features when you edit.

## How to work
- Make one focused change. Look at the result before you publish. To look at the
  result, open the HTML file in a browser.
- To publish: `git add -A && git commit -m "..." && git push`. The website updates in
  about 1 minute.
- To undo: use `git revert`, or reset to an earlier commit and push. The git history
  has each change. Thus you can recover each version.
- Keep this file, `Maintenance-Guide.pdf`, and `Handoff-Notes.pdf` correct when the
  structure changes.

## Regenerate the guides
`Maintenance-Guide.pdf` and `Handoff-Notes.pdf` are the guides for people. A tool
makes them. A person does not edit them by hand. The source is in `guide-src/`
(`maintenance.html`, `handoff.html`, and the shared `guide.css`). To change a guide,
edit the HTML or the CSS in `guide-src/`. Then make the PDF again with headless
Chrome:

```
cd guide-src
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="../Maintenance-Guide.pdf" "file://$PWD/maintenance.html"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="../Handoff-Notes.pdf" "file://$PWD/handoff.html"
```

The guides use one light theme only. This is on purpose. A person reads and prints
them on white paper. The guide text also follows Simplified Technical English; keep
that style when you edit the source.
