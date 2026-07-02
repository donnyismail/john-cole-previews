// Static SEO + security + a11y audit. Dependency-free.
// Scans built HTML pages and asserts production requirements.
// Exit non-zero on any failure so it gates `npm test` and the build loop.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Built pages that must be fully production-grade (scanned in dist/).
const PAGES = ['dist/index.html'];

// Required site-level files (in dist/).
const SITE_FILES = {
  dist: ['dist/robots.txt', 'dist/sitemap.xml', 'dist/_headers'],
};

const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);

function has(re, html) { return re.test(html); }

function auditPage(rel) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) { fail(rel, 'file missing'); return; }
  const html = readFileSync(path, 'utf8');

  // --- SEO ---
  if (!has(/<html[^>]+lang=/i, html)) fail(rel, 'missing <html lang>');
  if (!has(/<meta[^>]+name=["']viewport["']/i, html)) fail(rel, 'missing viewport meta');
  if (!has(/<title>[^<]{10,70}<\/title>/i, html)) fail(rel, 'missing/short title (need 10-70 chars)');
  const descTag = html.match(/<meta[^>]+name=["']description["'][^>]*>/i);
  const descVal = descTag && descTag[0].match(/content=(["'])([\s\S]*?)\1/i);
  if (!descVal) fail(rel, 'missing meta description');
  else if (descVal[2].length < 50 || descVal[2].length > 170)
    fail(rel, `meta description length ${descVal[2].length} (need 50-170)`);
  if (!has(/<link[^>]+rel=["']canonical["']/i, html)) fail(rel, 'missing canonical link');

  // Open Graph + Twitter
  for (const p of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
    if (!has(new RegExp(`property=["']${p}["']`, 'i'), html)) fail(rel, `missing OG tag ${p}`);
  }
  if (!has(/name=["']twitter:card["']/i, html)) fail(rel, 'missing twitter:card');

  // Structured data
  if (!has(/<script[^>]+type=["']application\/ld\+json["']/i, html)) fail(rel, 'missing JSON-LD');

  // Favicon / manifest
  if (!has(/<link[^>]+rel=["'](icon|shortcut icon)["']/i, html)) fail(rel, 'missing favicon');
  if (!has(/<link[^>]+rel=["']manifest["']/i, html)) fail(rel, 'missing web manifest link');

  // --- a11y / semantics ---
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1 !== 1) fail(rel, `must have exactly one <h1> (found ${h1})`);
  if (!has(/<a[^>]+class=["'][^"']*skip[^"']*["']/i, html) && !has(/skip-link/i, html))
    fail(rel, 'missing skip-to-content link');
  // every <img> needs alt (allow empty alt for decorative)
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  for (const img of imgs) if (!/\balt=/.test(img)) fail(rel, `<img> without alt: ${img.slice(0, 60)}`);

  // --- security ---
  // external links must carry rel="noopener"
  const ext = html.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) || [];
  for (const a of ext) if (!/rel=["'][^"']*noopener/i.test(a)) fail(rel, `target=_blank without rel=noopener: ${a.slice(0, 60)}`);
  // no obvious secrets
  if (has(/\b(sk-[a-z0-9]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-)/i, html))
    fail(rel, 'possible secret/token in HTML');
  // no http:// subresource (mixed content)
  if (has(/(src|href)=["']http:\/\//i, html)) fail(rel, 'insecure http:// resource (mixed content)');
}

function auditSiteFiles() {
  for (const [site, files] of Object.entries(SITE_FILES)) {
    for (const f of files) {
      if (!existsSync(join(ROOT, f))) fail(site, `missing ${f}`);
    }
    // _headers must define the core security headers
    const hp = join(ROOT, site, '_headers');
    if (existsSync(hp)) {
      const h = readFileSync(hp, 'utf8');
      for (const hdr of ['Content-Security-Policy', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security']) {
        if (!h.includes(hdr)) fail(site, `_headers missing ${hdr}`);
      }
    }
  }
}

for (const p of PAGES) auditPage(p);
auditSiteFiles();

if (failures.length) {
  console.error(`\n  AUDIT FAILED (${failures.length}):`);
  for (const f of failures) console.error('   ✖ ' + f);
  console.error('');
  process.exit(1);
}
console.log(`\n  ✓ AUDIT PASSED — ${PAGES.length} pages, all SEO/security/a11y checks green.\n`);
