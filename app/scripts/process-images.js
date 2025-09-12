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

// Image processing configuration - AVIF only with optimal resolution detection
const AVIF_QUALITY = 75; // Slightly lower quality for AVIF since it's more efficient

// Generate optimal sizes based on original image dimensions
function getOptimalSizes(originalWidth) {
  const baseSizes = [400, 800, 1200, 1600, 2400];
  return baseSizes.filter(size => size <= originalWidth).map(width => ({
    width,
    suffix: `-${width}w`
  }));
}

// Original image extensions to process
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.raw'];

/**
 * Check if file is a source image (must end with -original-resource.jpg)
 */
function isSourceImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  const hasValidExt = SOURCE_EXTENSIONS.includes(ext);
  const isOriginalResource = filename.includes('-original-resource');
  return hasValidExt && isOriginalResource;
}

/**
 * Check if file is already processed
 */
function isProcessedImage(filename) {
  const hasAvifSuffix = filename.includes('.avif');
  const hasSizeSuffix = filename.includes('w.avif'); // e.g., -400w.avif
  return hasAvifSuffix || hasSizeSuffix;
}

/**
 * Process a single image file - AVIF only with optimal resolution detection
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
    const optimalSizes = getOptimalSizes(metadata.width);
    
    if (optimalSizes.length === 0) {
      console.log(`    Skipping: Original image too small (${metadata.width}px)`);
      return;
    }
    
    // Generate AVIF versions for all optimal sizes
    for (const { width, suffix } of optimalSizes) {
      const outputFilename = `${baseName}-web${suffix}.avif`;
      const outputPath = path.join(outputDir, outputFilename);
      
      try {
        await image
          .clone()
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
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
    await image
      .clone()
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside'
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