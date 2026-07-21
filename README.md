# Carmody Lab Website

Source for **https://nme.fas.harvard.edu** — the Nutritional & Microbial Ecology
Laboratory (Harvard, Department of Human Evolutionary Biology).

## ✏️ Update the website (no coding)

Click a task below. A short form opens. Fill it in and click **Submit**. Your change
appears on the website by itself in about 1 minute — nothing else to do.

> **Tip:** bookmark this page so the tasks are always one click away. You must be
> signed in to GitHub and be a member of the lab (accept the invitation first).

| I want to… | Open the form |
|------------|---------------|
| Add a news item | [Add a news item →](https://github.com/christopherruano/carmody_lab_website/issues/new?template=add-news.yml) |
| Add a lab member | [Add a lab member →](https://github.com/christopherruano/carmody_lab_website/issues/new?template=add-person.yml) |
| Edit a lab member | [Edit a lab member →](https://github.com/christopherruano/carmody_lab_website/issues/new?template=edit-person.yml) |
| Remove a lab member | [Remove a lab member →](https://github.com/christopherruano/carmody_lab_website/issues/new?template=remove-person.yml) |
| Add a publication | [Add a publication →](https://github.com/christopherruano/carmody_lab_website/issues/new?template=add-publication.yml) |
| Change text on a page | [Change text on a page →](https://github.com/christopherruano/carmody_lab_website/issues/new?template=edit-text.yml) |

**Full instructions with pictures:** [**Maintenance-Guide.pdf**](Maintenance-Guide.pdf).
For anything the forms do not cover, use Claude Code (the guide has ready-to-use
prompts).

---

## For maintainers

This is a static website (HTML, CSS, and JS, with no build step). GitHub Pages hosts
it from the `main` branch. A push to `main` publishes the website automatically in
about 1 minute. *The documentation follows ASD-STE100 Simplified Technical English.*

- **AI assistant guide:** [`CLAUDE.md`](CLAUDE.md) — Claude Code reads it automatically.
  It gives the structure and the files that must stay in sync, and how the forms work.
- **Handoff and access notes:** [`Handoff-Notes.pdf`](Handoff-Notes.pdf)
- The 2 PDF guides are made from the source in [`guide-src/`](guide-src/); `CLAUDE.md`
  has the steps to remake them.

### The structure

- `*.html` — one file for each page (home, about, research, people, publications,
  laboratory, news, contact).
- `js/main.js` — the shared nav, footer, search, and home-page slideshow.
- `css/styles.css` — all the styles.
- `.github/` + `scripts/` — the content-bot forms and the code that runs them.
- `images/`, `pdfs/`, `docs/` — the images, the publication PDFs, and the CV.
