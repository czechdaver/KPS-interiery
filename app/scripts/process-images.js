#!/usr/bin/env node
/**
 * Image processing script for KPS Interiéry
 * Automatically generates optimized images in multiple formats and sizes
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const galleriesDir = path.join(publicDir, 'images', 'galleries');

// Image processing configuration
const FORMATS = [
  { format: 'avif', quality: 85 },
  { format: 'webp', quality: 85 },
  { format: 'jpeg', quality: 85 }
];

const SIZES = [
  { width: 400, suffix: '-400w' },
  { width: 800, suffix: '-800w' },
  { width: 1200, suffix: '-1200w' },
  { width: 1600, suffix: '-1600w' }
];

// Original image extensions to process
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.raw'];

/**
 * Check if file is a source image
 */
function isSourceImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return SOURCE_EXTENSIONS.includes(ext);
}

/**
 * Check if file is already processed
 */
function isProcessedImage(filename) {
  const hasFormatSuffix = FORMATS.some(f => filename.includes(`-${f.format}`));
  const hasSizeSuffix = SIZES.some(s => filename.includes(s.suffix));
  return hasFormatSuffix || hasSizeSuffix;
}

/**
 * Process a single image file
 */
async function processImage(inputPath, outputDir, filename) {
  console.log(`Processing: ${filename}`);
  
  const baseName = path.parse(filename).name;
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`  Original: ${metadata.width}x${metadata.height} (${metadata.format})`);
    
    // Generate all format and size combinations
    for (const { format, quality } of FORMATS) {
      for (const { width, suffix } of SIZES) {
        // Skip if original is smaller than target width
        if (metadata.width < width) continue;
        
        const outputFilename = `${baseName}${suffix}.${format}`;
        const outputPath = path.join(outputDir, outputFilename);
        
        try {
          await image
            .clone()
            .resize(width, null, {
              withoutEnlargement: true,
              fit: 'inside'
            })
            .toFormat(format, { quality })
            .toFile(outputPath);
          
          console.log(`    Generated: ${outputFilename}`);
        } catch (error) {
          console.warn(`    Failed to generate ${outputFilename}:`, error.message);
        }
      }
    }
    
    // Also keep a standard optimized version
    const standardPath = path.join(outputDir, `${baseName}-optimized.jpg`);
    await image
      .clone()
      .jpeg({ quality: 90 })
      .toFile(standardPath);
    
    console.log(`    Generated: ${baseName}-optimized.jpg`);
    
  } catch (error) {
    console.error(`Failed to process ${filename}:`, error.message);
  }
}

/**
 * Process all images in a gallery directory
 */
async function processGalleryImages(galleryPath) {
  const galleryName = path.basename(galleryPath);
  console.log(`\\n📁 Processing gallery: ${galleryName}`);
  
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
  console.log('🖼️  KPS Interiéry Image Processor');
  console.log('=====================================');
  
  try {
    // Check if galleries directory exists
    await fs.access(galleriesDir);
    
    // Get all gallery directories
    const galleries = await fs.readdir(galleriesDir);
    
    console.log(`Found ${galleries.length} galleries to process`);
    
    for (const gallery of galleries) {
      const galleryPath = path.join(galleriesDir, gallery);
      const stat = await fs.stat(galleryPath);
      
      if (stat.isDirectory()) {
        await processGalleryImages(galleryPath);
      }
    }
    
    console.log('\\n✅ Image processing completed!');
    console.log('\\n💡 Tips:');
    console.log('  - Place high-quality source images in gallery folders');
    console.log('  - Run this script after adding new images');
    console.log('  - The Vite plugin will serve optimized versions automatically');
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Galleries directory not found:', galleriesDir);
      console.log('\\nPlease create the directory structure:');
      console.log('  public/images/galleries/gallery-name/');
    } else {
      console.error('❌ Processing failed:', error.message);
    }
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);