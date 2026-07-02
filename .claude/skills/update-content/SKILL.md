---
name: update-content
description: Use for everyday edits — press articles, projects, pipeline, stats, portfolio, contact info, socials, hero photo, or Site Settings toggles. Maps each request to the right file.
---

# Update site content

Every routine edit is a small change to one content file. Make the minimal edit, then verify +
publish (use the **publish** skill).

## Content collections
| Change | Folder | Fields |
|---|---|---|
| Press article | `src/press/` | title, source, url, order |
| Upcoming project | `src/pipeline/` | title, town, status (e.g. "Delivering 2027"), soft (true = outline badge), note, order |
| Completed project (track record) | `src/projects/` | title, year, category (Residential/Commercial/Hospitality/Development), note |
| Project finished? | delete from pipeline/, add to projects/ | |
| Headline numbers | `src/stats/` | value (e.g. "$22M+"), label, order |
| Portfolio cards | `src/portfolio/` | label, title, blurb, image, order |

## Settings (`src/_data/site.json`)
- Contact: `email`, `phone` + `phoneHref` (`+1` then digits)
- Socials: `social.instagram` / `facebook` / `linkedin` (full URLs; empty hides the link)
- Hero photo: `heroImage` — e.g. `assets/uploads/hero.jpg` (auto-optimized); empty = default
- Launch toggles: `previewMode` (corner ribbon), `web3formsKey`, `analyticsToken`

## Rules
- Never edit `dist/` (generated).
- Photos go in `src/assets/uploads/` — big phone photos are fine (auto-optimized).
- Keep the voice professional and plain, investor-appropriate, no fluff.
- Finish with `npm test` + publish, then tell John what changed in one sentence.
