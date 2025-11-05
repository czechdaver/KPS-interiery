/**
 * Replace "fronty" with "dvířka" with correct grammatical forms
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GALLERIES_DIR = join(__dirname, '../public/images/galleries');

// List of galleries that still need updating (already processed: kuchyn-hneda-l, kuchyn-bila-ostruvek, kuchyn-bila-podkrovi)
const galleriesToUpdate = [
  'kuchyn-uzka-bila-l',
  'kuchyn-bilo-hneda-u-alternativa',
  'kuchyn-retro-bila',
  'kuchyn-cerna',
  'kuchyn-seda',
  'kuchyn-bila-u-tvar',
  'kuchyn-bilo-hneda-beton'
];

// Replacement patterns with correct grammar
const replacements = [
  // Nominative plural (features, main text)
  { old: 'Bílé matné fronty', new: 'Bílá matná dvířka' },
  { old: 'bílé matné fronty', new: 'bílá matná dvířka' },
  { old: 'Hnědé matné fronty', new: 'Hnědá matná dvířka' },
  { old: 'hnědé matné fronty', new: 'hnědá matná dvířka' },
  { old: 'Matné černé fronty', new: 'Matná černá dvířka' },
  { old: 'matné černé fronty', new: 'matná černá dvířka' },
  { old: 'Matné šedé fronty', new: 'Matná šedá dvířka' },
  { old: 'matné šedé fronty', new: 'matná šedá dvířka' },
  { old: 'Bílé fronty', new: 'Bílá dvířka' },
  { old: 'bílé fronty', new: 'bílá dvířka' },
  { old: 'Moderní bezúchytové fronty', new: 'Moderní bezúchytová dvířka' },
  { old: 'Elegantní bílé fronty', new: 'Elegantní bílá dvířka' },

  // Genitive plural (e.g., "detail fronty" → "detail dvířek", "kombinace front" → "kombinace dvířek")
  { old: 'detail fronty', new: 'detail dvířek' },
  { old: 'bílých a hnědých front', new: 'bílých a hnědých dvířek' },
  { old: 'Kombinace bílých a hnědých front', new: 'Kombinace bílých a hnědých dvířek' },
  { old: 'kombinace bílých a hnědých front', new: 'kombinace bílých a hnědých dvířek' },
  { old: 'do černých front', new: 'do černých dvířek' },
  { old: 'které jsou dokonale integrovány', new: 'která jsou dokonale integrována' }
];

function processGallery(gallerySlug) {
  const jsonPath = join(GALLERIES_DIR, gallerySlug, 'gallery.json');

  try {
    let content = readFileSync(jsonPath, 'utf-8');
    let modified = false;

    for (const { old, new: newText } of replacements) {
      if (content.includes(old)) {
        content = content.replace(new RegExp(old, 'g'), newText);
        modified = true;
        console.log(`  - Replaced "${old}" → "${newText}"`);
      }
    }

    if (modified) {
      writeFileSync(jsonPath, content, 'utf-8');
      console.log(`✅ Updated ${gallerySlug}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed for ${gallerySlug}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error processing ${gallerySlug}:`, error.message);
    return false;
  }
}

console.log('🔄 Replacing "fronty" with "dvířka" in remaining galleries...\n');

let updated = 0;
for (const gallery of galleriesToUpdate) {
  if (processGallery(gallery)) {
    updated++;
  }
}

console.log(`\n✨ Complete! Updated ${updated}/${galleriesToUpdate.length} galleries`);
