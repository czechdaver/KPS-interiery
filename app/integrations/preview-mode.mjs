// Režim náhledu (PREVIEW=1): build určený k odhostování mimo ostrou doménu.
// - noindex v každém HTML + X-Robots-Tag hlavička (_headers pro Cloudflare Pages / Netlify)
// - robots.txt zakazuje vše, sitemap se maže
// - maže CNAME (aby kopie nekolidovala s kps-interiery.cz) a /admin (CMS zapisuje do main)
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const META = '<meta name="robots" content="noindex,nofollow,noarchive">';

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function previewMode() {
  return {
    name: 'kps:preview-mode',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        for (const f of await htmlFiles(root)) {
          let html = await readFile(f, 'utf8');
          html = html.replace(/<meta name="robots"[^>]*>/g, '');
          await writeFile(f, html.replace('<head>', `<head>${META}`));
        }
        await writeFile(join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
        await writeFile(join(root, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n');
        for (const f of await readdir(root)) if (f.startsWith('sitemap')) await rm(join(root, f));
        await rm(join(root, 'CNAME'), { force: true });
        await rm(join(root, 'admin'), { recursive: true, force: true });
        logger.info('Náhledový build: noindex, bez CNAME, sitemap a /admin.');
      },
    },
  };
}
