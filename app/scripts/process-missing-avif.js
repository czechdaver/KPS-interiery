#!/usr/bin/env node
/**
 * Process specific galleries that are missing AVIF files
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const galleriesDir = path.join(publicDir, 'images', 'galleries');

// Galleries that need AVIF processing (from analysis)
const galleriesToProcess = [
  'kuchyn-bilo-hneda-l-varianta1',
  'kuchyn-bilo-hneda-u-alternativa',
  'kuchyn-cerna',
  'kuchyn-hneda-l',
  'kuchyn-mala-panel',
  'kuchyn-retro-bila',
  'kuchyn-seda',
  'kuchyn-svetla-rohova',
  'kuchyn-uzka-bila-l',
  'loznice-bilo-hneda',
  'loznice-hneda',
  'loznice-hneda-zkosene',
  'obyvak',
  'ostatni-dvere',
  'ostatni-live-edge-masiv',
  'ostatni-schody',
  'skrin-a-dvere',
  'skrin-dvere-botnik',
  'skrin-posuv-vstup'
];

// Image processing configuration
const AVIF_QUALITY = 75;

// Generate optimal sizes based on original image dimensions
function getOptimalSizes(originalWidth, originalHeight) {
  const baseSizes = [400, 800, 1200, 1600, 2400];
  const aspectRatio = originalWidth / originalHeight;

  return baseSizes.filter(size => size <= originalWidth).map(width => ({
    width,
    height: Math.round(width / aspectRatio),
    suffix: `-${width}w`
  }));
}

// Source image extensions to process
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.raw'];

/**
 * Check if file is a source image
 */
function isSourceImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  const hasValidExt = SOURCE_EXTENSIONS.includes(ext);
  const isOriginalResource = filename.includes('-original-resource');
  return hasValidExt && isOriginalResource;
}

/**
 * Process a single image file
 */
async function processImage(inputPath, outputDir, filename) {
  console.log(`Processing: ${filename}`);

  // Remove -original-resource suffix and create web basename
  const baseName = path.parse(filename).name.replace('-original-resource', '');

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`  Original: ${metadata.width}x${metadata.height} (${metadata.format})`);

    // Get optimal sizes based on original image dimensions
    const optimalSizes = getOptimalSizes(metadata.width, metadata.height);

    if (optimalSizes.length === 0) {
      console.log(`    Skipping: Original image too small (${metadata.width}px)`);
      return;
    }

    // Generate AVIF versions for all optimal sizes
    for (const { width, height, suffix } of optimalSizes) {
      const outputFilename = `${baseName}-web${suffix}.avif`;
      const outputPath = path.join(outputDir, outputFilename);

      try {
        await image
          .clone()
          .resize(width, height, {
            withoutEnlargement: true,
            fit: 'cover'
          })
          .avif({ quality: AVIF_QUALITY })
          .toFile(outputPath);

        console.log(`    Generated: ${outputFilename}`);
      } catch (error) {
        console.warn(`    Failed to generate ${outputFilename}:`, error.message);
      }
    }

    // Also keep a JPEG fallback for compatibility (single size)
    const webPath = path.join(outputDir, `${baseName}-web.jpg`);
    const jpegHeight = Math.round(1200 / (metadata.width / metadata.height));
    await image
      .clone()
      .resize(1200, jpegHeight, {
        withoutEnlargement: true,
        fit: 'cover'
      })
      .jpeg({ quality: 90 })
      .toFile(webPath);

    console.log(`    Generated: ${baseName}-web.jpg (fallback)`);

  } catch (error) {
    console.error(`Failed to process ${filename}:`, error.message);
  }
}

/**
 * Process all images in a gallery directory
 */
async function processGalleryImages(galleryPath) {
  const galleryName = path.basename(galleryPath);
  console.log(`\n📁 Processing gallery: ${galleryName}`);

  try {
    const files = await fs.readdir(galleryPath);
    const sourceImages = files.filter(isSourceImage);

    if (sourceImages.length === 0) {
      console.log('  No source images found');
      return;
    }

    console.log(`  Found ${sourceImages.length} source images`);

    for (const file of sourceImages) {
      const inputPath = path.join(galleryPath, file);
      await processImage(inputPath, galleryPath, file);
    }

  } catch (error) {
    console.error(`Error processing gallery ${galleryName}:`, error.message);
  }
}

/**
 * Main processing function
 */
async function main() {
  console.log('🖼️  KPS Interiéry AVIF Processor (Missing Galleries)');
  console.log('==================================================');

  try {
    // Check if galleries directory exists
    await fs.access(galleriesDir);

    console.log(`Processing ${galleriesToProcess.length} galleries that need AVIF files`);

    for (const gallery of galleriesToProcess) {
      const galleryPath = path.join(galleriesDir, gallery);

      try {
        const stat = await fs.stat(galleryPath);

        if (stat.isDirectory()) {
          await processGalleryImages(galleryPath);
        }
      } catch (error) {
        console.warn(`Gallery directory not found: ${gallery}`);
      }
    }

    console.log('\n✅ AVIF processing completed for missing galleries!');

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Galleries directory not found:', galleriesDir);
    } else {
      console.error('❌ Processing failed:', error.message);
    }
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);