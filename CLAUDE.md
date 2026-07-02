# Cole's Capital Group — colescapitalgroup.com

The corporate website for Cole's Capital Group (privately held real estate holdings & development,
Albany NY / Capital Region). Owned and managed by **John Cole**, who is NOT a developer. If you are
Claude working in this repo: your user is likely John. Talk in plain English, no jargon, explain
what you did in one or two sentences, and run commands yourself rather than asking him to.

Built with Eleventy (static site generator). Content lives as small Markdown/JSON files; editing a
file and pushing = the site updates itself. The rental business site (Pines & Ponies) lives in its
own separate repo: `pinesandponies`.

## Golden rules (do not skip)
1. **Run `npm test` before every push** (build + SEO/security/a11y audit). If it fails, fix the
   cause — never delete or weaken an audit rule to get green.
2. **Pushing to `main` deploys automatically** (GitHub Actions). After pushing, confirm the run
   succeeded and spot-check the live page.
3. **Never commit secrets.** The only "key-like" values allowed are the public Web3Forms key and
   analytics token in `src/_data/site.json` (public by design).
4. **This domain carries John's Microsoft 365 email.** Never touch DNS, MX, SPF, or anything
   email-related casually — read `SETUP_PRODUCTION.md` first, always.
5. **Keep changes minimal**; the design is owner-approved. Content edits are routine; design
   changes should be confirmed with John first.

## Common jobs
| John says | What to do |
|---|---|
| "Add a press article" | New file in `src/press/` (title, source, url, order). |
| "We started a new project" | `src/pipeline/` (title, town, status, note, order). |
| "The project is finished" | Delete from `src/pipeline/`, add to `src/projects/` (title, year, category, note). |
| "Update our numbers" | `src/stats/` (value, label, order). |
| "Change phone/email/socials/hero photo" | `src/_data/site.json`. |
| "Put this photo on the site" | Save under `src/assets/uploads/`, reference `assets/uploads/<file>`. Build auto-optimizes. |
| "Publish / make it live" | **publish** skill: npm test → commit → push → verify. |

## Commands
```
npm ci        # install (first time)
npm test      # build + audit (must pass before pushing)
npm run dev   # local preview at localhost:8080
```

## Map
- `src/{projects,pipeline,press,portfolio,stats}/*.md` — the editable content collections.
- `src/_data/site.json` — contact, socials, hero image, launch toggles, form/analytics keys.
- `src/_includes/base.njk` + `src/index.njk` — templates. `src/assets/styles.css` — design.
- `src/admin/` — visual CMS (Sveltia). **If this repo is renamed/transferred, update
  `backend.repo` in `src/admin/config.yml`.**
- `src/headers.njk` — security headers/CSP. `scripts/audit.js` — quality gate.
