/**
 * Generate PNG favicons from SVG source
 * Creates Apple touch icons and standard favicons in various sizes
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SVG_SOURCE = join(__dirname, '../public/branding/fav.svg');
const OUTPUT_DIR = join(__dirname, '../public/branding');

// Icon sizes to generate
const SIZES = [
  { name: 'apple-touch-icon.png', size: 180, description: 'Apple Touch Icon (Primary)' },
  { name: 'apple-touch-icon-152x152.png', size: 152, description: 'Apple Touch Icon (iPad Retina)' },
  { name: 'apple-touch-icon-120x120.png', size: 120, description: 'Apple Touch Icon (iPhone Retina)' },
  { name: 'apple-touch-icon-76x76.png', size: 76, description: 'Apple Touch Icon (iPad)' },
  { name: 'favicon-16x16.png', size: 16, description: 'Standard Favicon 16x16' },
  { name: 'favicon-32x32.png', size: 32, description: 'Standard Favicon 32x32' },
  { name: 'favicon-192x192.png', size: 192, description: 'Android Chrome Icon' },
  { name: 'favicon-512x512.png', size: 512, description: 'PWA Icon / Android Chrome Large' },
];

async function generateFavicons() {
  console.log('🎨 Generating favicons from SVG...\n');

  // Read SVG file
  const svgBuffer = readFileSync(SVG_SOURCE);

  // Generate each size
  for (const { name, size, description } of SIZES) {
    const outputPath = join(OUTPUT_DIR, name);

    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name} (${size}x${size}px) - ${description}`);
    } catch (error) {
      console.error(`❌ Error generating ${name}:`, error.message);
    }
  }

  console.log('\n✨ All favicons generated successfully!');
}

generateFavicons().catch(console.error);
