// Astro emituje originály všech obrázků z content collections (image()), i když je žádná
// stránka nepoužije. Po buildu smažeme z _astro/ obrázky, na které nic neodkazuje.
import { readdir, readFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;
const TEXT = /\.(html|css|js|json|xml|webmanifest|txt)$/i;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

export default function pruneUnusedAssets() {
  return {
    name: 'kps:prune-unused-assets',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = await walk(root);
        let corpus = '';
        for (const f of files) if (TEXT.test(f)) corpus += await readFile(f, 'utf8');
        let removed = 0, bytes = 0;
        for (const f of files) {
          if (!f.includes(`${join(root, '_astro')}`) || !IMG.test(f)) continue;
          const name = f.slice(f.lastIndexOf('/') + 1);
          if (corpus.includes(name)) continue;
          bytes += (await stat(f)).size;
          await rm(f);
          removed++;
        }
        logger.info(`Odstraněno ${removed} nepoužitých obrázků (${(bytes / 1e6).toFixed(0)} MB).`);
      },
    },
  };
}
