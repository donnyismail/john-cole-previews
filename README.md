# Cole's Capital Group

Corporate website for Cole's Capital Group — privately held real estate holdings & development in
New York's Capital Region. Live at **colescapitalgroup.com**.

- **Owner:** John Cole (Cole's Capital Group)
- **Everyday edits:** the visual dashboard at `/admin` (see `JOHN_GUIDE.md`)
- **Bigger changes:** ask Claude — this repo carries its own instructions (`CLAUDE.md` +
  `.claude/skills/`) so the AI knows exactly how to update projects, press, and publish
- **Stack:** Eleventy static build, content as Markdown/JSON, Sveltia CMS, GitHub Actions deploy,
  quality gate on every push (`npm test` = build + SEO/security/accessibility audit)

```
npm ci        # install
npm test      # build + full quality gate
npm run dev   # local preview
```

Push to `main` = automatic build, test, and deploy. See `SETUP_PRODUCTION.md` for hosting/launch.

The rental business site (Pines & Ponies) lives in its own repo: `pinesandponies`.
