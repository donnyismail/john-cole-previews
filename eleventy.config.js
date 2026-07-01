import { IdAttributePlugin } from '@11ty/eleventy';
import Image from '@11ty/eleventy-img';
import path from 'node:path';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(IdAttributePlugin);

  // Static assets per site (css, js, logos, favicons, admin)
  eleventyConfig.addPassthroughCopy('src/pines/assets');
  eleventyConfig.addPassthroughCopy('src/coles/assets');
  eleventyConfig.addPassthroughCopy('src/pines/admin');
  eleventyConfig.addPassthroughCopy('src/coles/admin');
  eleventyConfig.addPassthroughCopy('src/pines/site.webmanifest');
  eleventyConfig.addPassthroughCopy('src/coles/site.webmanifest');
  eleventyConfig.addPassthroughCopy('src/pines/robots.txt');
  eleventyConfig.addPassthroughCopy('src/coles/robots.txt');

  eleventyConfig.addWatchTarget('src/**/*.css');

  // The CMS admin pages are static (passthrough only) — don't run them through templating/layouts.
  eleventyConfig.ignores.add('src/pines/admin/index.html');
  eleventyConfig.ignores.add('src/coles/admin/index.html');

  // imgUrl: returns an optimized WebP URL for local images (CMS uploads),
  // passes remote/placeholder URLs through untouched. Output lands inside the
  // site's own dir so each site deploys standalone (dist/<site>/img/...).
  eleventyConfig.addNunjucksAsyncFilter('imgUrl', (src, siteKey, callback) => {
    (async () => {
      if (!src || /^https?:\/\//.test(src)) return src || '';
      const rel = src.replace(/^\//, '');
      const metadata = await Image(path.join('src', siteKey, rel), {
        widths: [1200],
        formats: ['webp'],
        outputDir: `./dist/${siteKey}/img/`,
        urlPath: 'img/',
      });
      return metadata.webp[0].url;
    })()
      .then((url) => callback(null, url))
      .catch((err) => callback(err));
  });

  // Collections (tags assigned via directory data files)
  eleventyConfig.addCollection('properties', (c) =>
    c.getFilteredByTag('property').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection('projects', (c) =>
    c.getFilteredByTag('project').sort((a, b) => (b.data.year || 0) - (a.data.year || 0)),
  );
  eleventyConfig.addCollection('pipeline', (c) =>
    c.getFilteredByTag('pipeline').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection('press', (c) =>
    c.getFilteredByTag('press').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection('portfolio', (c) =>
    c.getFilteredByTag('portfolio').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection('stats', (c) =>
    c.getFilteredByTag('stat').sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );

  // money filter
  eleventyConfig.addFilter('money', (n) => '$' + Number(n).toLocaleString('en-US'));
  eleventyConfig.addFilter('yy', (y) => "'" + String(y).slice(-2));

  return {
    dir: { input: 'src', output: 'dist', includes: '_includes', data: '_data' },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html'],
  };
}
