# Carmody Lab Website

Source for **https://nme.fas.harvard.edu** — the Nutritional & Microbial Ecology
Laboratory (Harvard, Department of Human Evolutionary Biology).

Static site (plain HTML/CSS/JS, no build step) hosted on **GitHub Pages** from the
`main` branch. Pushing to `main` publishes to the live site automatically in about a
minute.

## Where to start

- **Keeping the site up to date (non-technical guide):** [`MAINTENANCE.md`](MAINTENANCE.md)
- **Editing with an AI assistant (Claude Code):** [`CLAUDE.md`](CLAUDE.md) — loaded
  automatically; explains the structure and the pieces that must stay in sync.
- **Ownership / handoff notes:** [`HANDOFF.md`](HANDOFF.md)

## Structure at a glance

- `*.html` — one file per page (home, about, research, people, publications,
  laboratory, news, contact)
- `js/main.js` — shared nav, footer, search, and homepage slideshow
- `css/styles.css` — all styling
- `images/`, `pdfs/`, `docs/` — assets, publication PDFs, and the CV
