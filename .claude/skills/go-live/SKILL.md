---
name: go-live
description: Use for launch tasks — putting the site on colescapitalgroup.com, DNS/domain moves, turning off preview mode, enabling forms/analytics. Includes the email-safety rules.
---

# Go live / launch checklist

Full runbook: `SETUP_PRODUCTION.md`. This is the ordered checklist.

## One-time launch
1. **Hosting**: Cloudflare Pages project in JOHN's Cloudflare account, from this repo.
   Build command `npm run build`, output directory `dist`. `_headers` (security/CSP) applies automatically.
2. **Domain (CAREFUL — email lives here)**: colescapitalgroup.com runs Microsoft 365 email.
   Replicate ALL email records (MX, SPF TXT, tenant TXT, autodiscover, Teams SRV/CNAMEs) in the
   new DNS BEFORE changing nameservers, then verify mail sends AND receives before anything else.
   The complete record set is documented in SETUP_PRODUCTION.md. Never wing DNS on this domain.
3. **Forms**: Web3Forms access key for jcole@colescapitalgroup.com → `web3formsKey` in
   `src/_data/site.json`.
4. **Analytics**: Cloudflare Web Analytics beacon token → `analyticsToken`.
5. **Ribbon off**: `previewMode: false`.
6. **CMS login**: /admin uses GitHub — fine-grained personal access token scoped to this repo
   (Contents: read/write) → Sveltia "Sign In Using Access Token". If the repo is renamed or
   transferred, update `backend.repo` in `src/admin/config.yml`.
7. Publish, verify the live domain including `/admin`, and confirm email still works.
