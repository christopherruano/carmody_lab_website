# Website Handoff — Notes for Chris

This is the checklist for handing off **nme.fas.harvard.edu** to Rachel (and the
lab) so it survives after you're gone. `MAINTENANCE.md` is the guide Rachel uses;
this file is the stuff *you* need to do or decide during the handoff.

---

## 1. Site facts (the ground truth)

- **Type:** Static site — plain HTML/CSS/JS. No build step, no framework, no server
  to maintain. This is deliberately low-maintenance and is the reason a
  non-technical PI can keep it running.
- **Repository:** `https://github.com/christopherruano/carmody_lab_website`
  (currently under your **personal** GitHub account — see risk #1 below).
- **Hosting:** GitHub Pages, served from the `main` branch, repository root.
- **Live URL:** `https://nme.fas.harvard.edu` — set by the `CNAME` file
  (`nme.fas.harvard.edu`) plus a DNS record managed by Harvard FAS/HEB.
- **Deploy model:** push to `main` → GitHub Pages rebuilds automatically (~1 min).
  No manual publish step.

## 2. The one architectural gotcha to explain

`js/main.js` is the shared brain of the site. It injects the **nav bar** and
**footer** into every page at load time, and it also holds:
- the **search index** (a hand-maintained list — new people/pubs/news must be added
  here to be searchable),
- the **slideshow captions** (`slideData`),
- the research-tab and "load more news" behavior.

Anyone editing the site — or any AI assistant doing it — needs to know that
nav/footer/search are centralized here, not per-page. The recipes in
`MAINTENANCE.md` already account for this.

## 3. Access to transfer or grant — DECIDE THESE

These are the decisions that actually determine whether the handoff is durable.
Recommendations in **bold**.

1. **Repository access — CHOSEN APPROACH: add Rachel as an Admin.** The repo stays
   on Chris's personal account; Rachel gets full control without touching hosting or
   DNS. Settings → **Collaborators and teams → Add people** → Rachel → **Admin** role.
   Add one backup lab member as Admin too, so access never depends on a single
   person. (A full ownership transfer was considered and declined; it would have
   required a coordinated DNS change with FAS. Revisit only if Chris's account is
   ever closed.)
2. **Custom domain / DNS.** `nme.fas.harvard.edu` is a Harvard FAS subdomain whose
   DNS points at GitHub Pages. With the admin-only approach this needs **no change**.
   Still, record who the FAS/HEB IT contact is in case the domain ever needs
   attention (noted in Section 9 of `MAINTENANCE.md`).
3. **Claude Code + Claude account.** Rachel needs Claude Code installed and a Claude
   (Anthropic) account/subscription that isn't tied to your login. Set this up on
   her machine (or a lab machine) and confirm she can launch it in the repo folder.
4. **The local folder.** Get a clean, current clone onto the machine Rachel will
   use, and confirm `git push` works from it with her credentials (not cached yours).

## 4. Handoff checklist

- [ ] Add Rachel (+ one backup) as **Admin** collaborators on the repo. *(Decision #1)*
- [ ] Confirm GitHub Pages is enabled and green (Settings → Pages; custom domain
      reads `nme.fas.harvard.edu` with HTTPS enforced).
- [ ] Clone the repo fresh onto Rachel's / the lab machine.
- [ ] Install Claude Code there; sign in with a lab-owned Claude account; confirm
      `claude` launches in the repo folder.
- [ ] Do one **live test edit together** end-to-end (add a dummy news item, publish,
      see it on the site, then remove it). This is the single most valuable part of
      the handoff.
- [ ] Fill in the two blanks in `MAINTENANCE.md`: your contact info (Section 9) and
      confirm the folder path (Section 2).
- [ ] Hand Rachel `MAINTENANCE.md` (print it or leave it in the repo) and walk
      through Sections 1–4.
- [ ] Record the Harvard FAS/HEB IT contact for DNS issues.

## 5. Optional cleanups worth doing before handoff

Not required, but they make the site tidier and are good "first test edits":

- **Typo:** "Nutritional & Microbial Ecology **Laboratoryoratory**" appears in
  `laboratory.html` (twice) and in the search index in `js/main.js`. Should read
  "Laboratory."
- **Stray files** in the working tree that aren't committed: a loose
  `Screenshot 2026-05-04 at 9.18.00 PM.png` at the repo root and some `.DS_Store`
  files under `images/`. Consider deleting them and/or adding a `.gitignore` for
  `.DS_Store`.
- **Role wording mismatch:** the People page shows Alex Cooper-Hohn and Cameron
  McInroy as "Associate Researcher," while the search index calls them
  "Post-Baccalaureate Researcher." Pick one and make them consistent.

## 6. What Rachel can and can't safely do alone

- **Safe alone:** everything in `MAINTENANCE.md` — news, people, publications, CV,
  photos, caption/text edits. All reversible via git history.
- **Should involve a technical helper:** changing the domain/`CNAME`, restructuring
  the layout or CSS, anything touching GitHub Pages settings or DNS.

---

*Prepared July 2026.*
