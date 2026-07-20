# CLAUDE.md — Project guide for AI assistants

This file is loaded automatically by Claude Code. Read it before editing. It exists
so that edits stay correct and consistent even when made by someone non-technical.
The human-facing walkthrough is in `MAINTENANCE.md`; keep that guide accurate if you
change how the site works.

## What this is
The public website for the Carmody Lab (Nutritional & Microbial Ecology Laboratory,
Harvard HEB), live at **https://nme.fas.harvard.edu**.

- **Static site.** Plain HTML + one CSS file + one JS file. **No build step, no
  framework, no package manager, no dependencies.** What is in the repo is exactly
  what is served.
- **Hosting:** GitHub Pages, served from the `main` branch, repository root.
- **Deploy:** pushing to `main` publishes automatically (~1 min). There is no other
  deploy step. Never create a `gh-pages` branch or a build output folder.
- **Do not edit or delete `CNAME`** (`nme.fas.harvard.edu`) — it binds the custom
  domain. Removing it takes the site off its address.

## File map
| Path | Purpose |
|------|---------|
| `index.html` | Homepage: hero slideshow + highlights + Recent News |
| `research.html` | Three research themes (tab/accordion) |
| `people.html` | Current & Former lab members |
| `publications.html` | Publications by year + Preprints |
| `laboratory.html` | "Our Space" / facilities |
| `news.html` | Full news list, grouped by year |
| `contact.html` | Contact cards + address |
| `about.html` | Mission statement (linked in the nav as "About") |
| `js/main.js` | Nav, footer, search index, slideshow, research tabs, news "load more", bio truncation |
| `css/styles.css` | All styling (design tokens as CSS variables at the top) |
| `images/`, `images/people/`, `images/research/`, `images/lab/`, `images/about/`, `images/hero/` | Images |
| `pdfs/` | Publication PDFs |
| `docs/Carmody_CV.pdf` | Rachel's CV |

## Critical: things that must stay in sync
The site has no database, so a few pieces of content live in more than one place.
When you change one, update its mirror(s) in the **same** edit:

1. **Navigation & footer** are generated once in `js/main.js` (`renderNav`,
   `renderFooter`) and injected into every page via `<div id="site-nav">` /
   `<div id="site-footer">`. To change a menu item, address, or phone number, edit
   `js/main.js` — **not** the individual pages. Pages have no hard-coded nav/footer.

2. **Site search** is a hand-maintained array, `searchIndex`, in `js/main.js`. It is
   NOT generated from the pages. Whenever you add/edit/remove a **person**,
   **publication**, or notable **news** item, update the matching `searchIndex`
   entry too. Keep each entry's role/title/description consistent with what the page
   actually shows (past drift here has caused mismatches).

3. **Recent News on the homepage** (`index.html`, `.recent-news-list`) mirrors the
   top of `news.html`. When you add a news item to `news.html`, also add it to the
   homepage list and trim that list back to the **4 newest** items.

4. **Slideshow** — images live in `index.html` (`.hero-slide` `<picture>` blocks,
   with `slideN.jpg` + `slideN-mobile.jpg`); their captions live in `js/main.js`
   (`slideData`). The Nth caption pairs with the Nth slide, so keep the two lists the
   same length and in the same order.

## Content conventions
- Use HTML entities, not raw typographic characters, in markup: `&amp;` `&rsquo;`
  `&ldquo;` `&rdquo;` `&ndash;` `&mdash;` `&rarr;`. **Never put curly quotes inside
  HTML attributes or JS strings** — a stray `”` around a `class="..."` silently
  breaks it (this was a real bug that has been fixed).
- Publications: lab members' names are wrapped in `<strong>`; `*` marks equal
  contribution (see the note at the top of `publications.html`). External links use
  `target="_blank" rel="noopener"`.
- People: each card is a `.person-card` with `.person-photo`, `<h3>` name,
  `.person-role` (and `.person-role-former` / `.person-destination` as needed).
  Current members are in the first section; former members in the second with a
  `.person-destination`.
- News: grouped under `<h2 class="news-year-header">YEAR</h2>`, newest first, each
  item a `.news-item` with `.news-date` + `.news-text`.
- Person photos go in `images/people/` (roughly square, ≥600px). Publication PDFs go
  in `pdfs/`. Replace the CV in place at `docs/Carmody_CV.pdf` (keep the filename).

## Accessibility (preserve these)
Skip link, ARIA roles on nav/search/tabs, `.sr-only` "opens in new tab" labels added
by `markExternalLinks`, keyboard support on the research tabs, and the digital-
accessibility policy link in the footer. Don't remove these when editing.

## Workflow
- Make focused changes; preview before publishing (open the HTML file in a browser).
- To publish: `git add -A && git commit -m "..." && git push`. The live site updates
  within ~1 minute.
- To undo: `git revert` or reset to a prior commit and push — every change is in the
  git history, so nothing is unrecoverable.
- Keep this file and `MAINTENANCE.md` accurate when the structure changes.
