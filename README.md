# Carmody Lab Website

This is the source for **https://nme.fas.harvard.edu**, the website of the
Nutritional & Microbial Ecology Laboratory (Harvard, Department of Human
Evolutionary Biology).

This is a static website (HTML, CSS, and JS, with no build step). GitHub Pages hosts
it from the `main` branch. A push to `main` publishes the website automatically in
about 1 minute.

*The documentation follows ASD-STE100 Simplified Technical English.*

## Where to start

- **To update the website (guide for a non-technical person):** [`Maintenance-Guide.pdf`](Maintenance-Guide.pdf)
- **To edit with an AI assistant (Claude Code):** [`CLAUDE.md`](CLAUDE.md). Claude
  Code reads it automatically. It gives the structure and the files that you must
  keep in sync.
- **For the handoff and access notes:** [`Handoff-Notes.pdf`](Handoff-Notes.pdf)

A tool makes the 2 PDF guides from the source in [`guide-src/`](guide-src/)
(`maintenance.html`, `handoff.html`, and `guide.css`). Refer to `CLAUDE.md` for the
steps to make the PDFs again after an edit.

## The structure

- `*.html` — one file for each page (home, about, research, people, publications,
  laboratory, news, contact).
- `js/main.js` — the shared nav, footer, search, and home-page slideshow.
- `css/styles.css` — all the styles.
- `images/`, `pdfs/`, `docs/` — the images, the publication PDFs, and the CV.
