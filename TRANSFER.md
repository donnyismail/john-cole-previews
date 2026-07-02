# Handing both repos to John (ownership transfer checklist)

There are TWO repos, one per business, both get transferred to John's GitHub account:
- `colescapitalgroup` (this repo) — corporate site
- `pinesandponies` — rental site

## Order of operations (repeat per repo)
1. **John creates a GitHub account** (his business email). Send Donny the username.
2. **Transfer** (Settings → General → Danger Zone → Transfer ownership) to John's account.
   John accepts the transfer email.
3. **John adds Donny back as a collaborator** (Settings → Collaborators → `donnyismail`, Write).
4. **Re-enable Pages on the transferred repo**: Settings → Pages → Source: GitHub Actions, then
   Actions → Build & Deploy → Run workflow.
5. **Update the CMS backend** in `src/admin/config.yml`: `repo: <john-username>/<repo-name>`.
   Commit + push.
6. **CMS login for John**: John's GitHub → Settings → Developer settings → Fine-grained tokens →
   token scoped to BOTH repos, Contents: Read and write. John pastes it into each /admin →
   "Sign In Using Access Token". (Max expiry 1 year — calendar a renewal.)
7. **Cloudflare Pages** (at launch): connect each Pages project to its repo under John's GitHub
   via the Cloudflare GitHub App, from John's Cloudflare account (see SETUP_PRODUCTION.md).
8. **Claude for John**: John connects his GitHub to claude.ai/code. Each repo's CLAUDE.md +
   .claude/skills make Claude instantly competent (update-content, publish, go-live; the pines
   repo also has add-property).

## What breaks if steps are skipped
- Skip 4 → pushes stop deploying (Pages source resets on transfer).
- Skip 5 → /admin can't load or save content (points at the old repo path).
- Skip 6 → John can't log into /admin at all.

## After transfer, ownership picture
- Code + content: John's GitHub (two repos). Domains + DNS + hosting: John's Cloudflare.
- Email: John's Microsoft 365 (billed via GoDaddy, unchanged). Booking (later): John's OwnerRez.
- Donny: collaborator only. John can remove anyone, anytime. That's the point.
