# Carmody Lab Website — Maintenance Guide

*A plain-English guide for keeping **nme.fas.harvard.edu** up to date.*

You do **not** need to know how to code to use this guide. The idea is simple:
you open a tool called **Claude Code** (or Codex), tell it in normal English what
you want changed, it makes the change, and then it publishes the change to the
live website. This document tells you exactly what to say and what to expect.

If you ever feel stuck, everything here is reversible. Nothing you do can
permanently break the site — see **"If something goes wrong"** at the end.

---

## 1. The big picture (read this once)

- The website is a set of files stored on **GitHub** (a website that stores files
  and keeps a history of every change).
- The public site lives at **https://nme.fas.harvard.edu**.
- When a change is saved ("committed") and uploaded ("pushed") to GitHub, the
  live site updates **automatically within about 1 minute**. There is no separate
  "publish" button and no web server to log into.
- **Claude Code** is an assistant that runs on your computer. It can read the
  website files, make the edits you ask for in plain English, and push them to
  GitHub for you. You talk to it in a chat window, like texting a very capable
  assistant who happens to be sitting at your keyboard.

You will mostly do four things: **add news**, **update people**, **add
publications**, and **swap photos or the CV**. Each is covered below with the
exact words to type.

---

## 2. One-time setup

You only do this section **once**. After it's done, day-to-day edits take a few
minutes.

### What you need
1. **A computer** (Mac or Windows).
2. **A GitHub account** with access to the website's repository (repository = the
   folder of files on GitHub). You've been added as an **Admin** on it, so you have
   full control. The repository is:
   `https://github.com/christopherruano/carmody_lab_website`
3. **Claude Code installed.** Chris (or the department's IT/computing support) can
   install this for you. It requires a Claude (Anthropic) account. Once installed,
   you open it from the Terminal app by typing `claude` and pressing Enter.

> **Tip:** Ask whoever helps you set up to do a "dry run" of one news update with
> you the first time, so you see the full loop once. After that you'll be
> comfortable.

### The one folder you'll open
The website files live in a folder on your computer (Chris will set its location —
likely `Downloads/vscode/carmody_lab_website` or a folder he shows you). You never
need to open the individual files yourself. You just need to start Claude Code
**inside that folder**. The person who sets you up will create a shortcut so this
is one click, or will show you the command:

```
cd path/to/carmody_lab_website
claude
```

Once Claude Code is running, you'll see a prompt where you can type. That's where
everything below happens.

---

## 3. How every edit works (the routine)

Every single change follows the same three steps:

1. **Tell Claude Code what you want**, in plain English (see the recipes in
   Section 4). Be specific — names, dates, and exact wording.
2. **Let it make the change and show you.** Claude Code will edit the files and
   tell you what it did. It's fine to ask it to *"show me what the news page looks
   like now"* or *"open the site so I can preview it"* before publishing.
3. **Ask it to publish.** Say:
   > *"Looks good — please commit and push this so it goes live."*
   Within about a minute, the change appears on nme.fas.harvard.edu. (You may need
   to refresh the page, or do a "hard refresh": Cmd+Shift+R on Mac, Ctrl+F5 on
   Windows.)

That's the whole loop. You can make several changes before publishing — just do
them all, preview, then publish once at the end.

---

## 4. Copy-paste recipes for common tasks

For each task below, copy the **bold prompt**, paste it into Claude Code, and
fill in the specifics. Claude Code knows the site's structure, so you don't have
to.

### 4a. Add a news item
The News page (and the "Recent News" box on the homepage) are the things you'll
update most often.

> **"Add a news item to the website. Date: [e.g. July 15, 2026]. Text: '[write the
> announcement exactly as you want it to appear]'. Put it at the top of the correct
> year on the News page, and also add it to the Recent News section on the
> homepage. Then show me before publishing."**

Notes:
- News is grouped by year, newest at the top. If it's a new year (e.g. the first
  2027 item), just say so and Claude Code will create the year heading.
- The homepage only shows the ~4 most recent items — ask it to keep that list to
  the 4 newest so the box doesn't overflow.

### 4b. Add or update a person
> **"On the People page, add a new current lab member. Name: [full name]. Role:
> [e.g. Graduate Student / Postdoctoral Fellow]. Email: [address, or 'none']. Bio:
> '[paste bio, or say none]'. Their photo is the file I just put in the
> images/people folder called [filename]. Add them to the site search too. Show me
> before publishing."**

To **move someone to "Former Laboratory Members"** (e.g. someone who graduated):
> **"Move [name] from Current to Former Laboratory Members on the People page. Their
> destination is: '[e.g. Postdoctoral Fellow, Smith Lab, Yale University]'. Update
> the search entry too."**

**About photos:** put the person's photo file into the `images/people` folder
first (see Section 5), then reference its filename in your request. Good photos are
square-ish and at least 600×600 pixels. If you're not sure how to add the file,
just tell Claude Code *"I have a photo at [wherever it is on my computer] — please
add it for [name]."*

### 4c. Add a publication
> **"Add a publication to the Publications page under the year [year] (or under
> Preprints). Authors: [list, exactly as they should appear — put lab members in
> bold]. Title: '[title]'. Journal: '[journal, volume, pages, year]'. Link:
> [DOI or URL]. I've put the PDF in the pdfs folder as [filename] (or: there's no
> PDF). Add it to the site search too. Show me before publishing."**

Notes:
- Lab members' names are shown in **bold** in the author list — tell Claude Code
  who the lab members are if it's not obvious.
- To include the PDF, drop the file into the `pdfs` folder first (Section 5).

### 4d. Update Rachel's CV
> **"Replace the CV on the site with the new file I've put in the docs folder called
> Carmody_CV.pdf."**

Simplest method: save your new CV as **`Carmody_CV.pdf`** and place it in the
`docs` folder, replacing the old one (Section 5). Keeping the same filename means
nothing else needs to change. Then ask Claude Code to publish.

### 4e. Change the homepage slideshow captions or images
The rotating images on the homepage each have a caption (a research finding + a
citation). These are defined in one place.

> **"On the homepage slideshow, change the caption for slide [number] to finding:
> '[text]' and citation: '[text]'."**

To swap a slide image, add the new image to the `images` folder (named like
`slide11.jpg` with a matching `slide11-mobile.jpg`) and ask Claude Code to wire it
in. This one is more involved — it's fine to ask Claude Code to walk you through
it.

### 4f. Fix a typo or reword something
> **"On the [page name] page, change the text '[the current wording]' to '[the new
> wording]'."**

You can always just describe where it is: *"the second paragraph on the Research
page,"* etc. Claude Code can find it.

---

## 5. Adding photos, PDFs, and other files

Some tasks need a file (a photo, a PDF) added to the project first. Two ways:

- **Easiest:** tell Claude Code where the file is and let it move it. E.g. *"There's
  a photo on my Desktop called headshot.jpg — please add it to the people images as
  the photo for Jane Doe."*
- **Manual:** open the project folder in Finder (Mac) or File Explorer (Windows) and
  drag the file into the right subfolder:
  - People headshots → `images/people/`
  - Publication PDFs → `pdfs/`
  - The CV → `docs/` (name it `Carmody_CV.pdf`)
  - Homepage slideshow images → `images/`

After adding a file manually, tell Claude Code it's there and what to do with it.

---

## 6. Where everything lives (quick reference)

You don't need this to make edits — Claude Code knows it — but it's handy context.

| What | Where |
|------|-------|
| Homepage | `index.html` |
| Research page | `research.html` |
| People page | `people.html` |
| Publications page | `publications.html` |
| Laboratory / "Our Space" page | `laboratory.html` |
| News page | `news.html` |
| Contact page | `contact.html` |
| Menu bar, footer, search box, slideshow logic | `js/main.js` |
| Colors, fonts, spacing (visual style) | `css/styles.css` |
| Person photos | `images/people/` |
| Publication PDFs | `pdfs/` |
| Rachel's CV | `docs/Carmody_CV.pdf` |
| The custom web address setting | `CNAME` (contains `nme.fas.harvard.edu` — **do not change**) |

**Two things to know about `js/main.js`:**
- The **navigation menu and the footer are defined once here** and appear on every
  page automatically. To change a menu link or the footer address/phone, that's the
  file — just ask Claude Code.
- The **search box has its own list** of people, publications, and news. When you
  add a person, publication, or major news item, the search list should be updated
  too. The recipes above already tell Claude Code to do this — just don't forget to
  mention it.

---

## 7. Good habits

- **Preview before publishing.** Ask *"show me"* or *"open the site so I can look"*
  before you say publish. It costs nothing and catches mistakes.
- **Make one topic of change at a time.** Add all the news, look, publish. Then do
  people separately. This keeps the history readable.
- **Keep dates and spellings exact.** Claude Code copies what you give it.
- **Check the live page after publishing.** Wait a minute, refresh, confirm it
  looks right on both computer and phone.
- **Say what you mean plainly.** You don't need technical words. *"The photo for
  John looks squished, can you fix how it's cropped"* is a perfectly good request.

---

## 8. If something goes wrong

Nothing here is permanent — GitHub keeps a full history, so any change can be undone.

- **A change looks wrong on the live site:** tell Claude Code
  > *"Undo the last change and publish the fix,"*
  or *"the news date is wrong, change it to [X] and republish."*
- **You want to completely revert to how the site was before today:**
  > *"Please revert the site to the last commit from before today's changes and
  > push it."*
  Claude Code can do this safely.
- **The site didn't update after ~5 minutes:** first do a hard refresh
  (Cmd+Shift+R / Ctrl+F5). If still stale, ask Claude Code
  > *"Did my last change actually get pushed to GitHub? Please check and push it if
  > not."*
- **Claude Code seems confused or you're unsure:** stop, and ask it
  > *"Explain in simple terms what you're about to change, and don't publish
  > anything yet."*
- **You're truly stuck:** email Chris (see the handoff notes) or the department's
  computing support. Because every change is saved in GitHub's history, they can
  always restore a good version.

---

## 9. Who to contact

- **Website was built by:** Christopher Ruaño.
- **For technical help / account access:** Christopher Ruaño — chris@linklane.ai.
- **GitHub access:** you (Rachel) have been added as an **Admin** on the project
  repository, so you have full control. The repository lives at
  `github.com/christopherruano/carmody_lab_website`.
- **Hosting:** GitHub Pages (free), custom domain `nme.fas.harvard.edu` managed
  through Harvard FAS. If the *domain* ever stops working (as opposed to the
  content), that's a Harvard FAS/HEB IT matter, not a GitHub one.

---

*Last updated: July 2026.*
