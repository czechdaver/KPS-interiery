#!/usr/bin/env node
/**
 * OG Image Validation Script
 *
 * Validates that all galleries have:
 * 1. Valid gallery.json files
 * 2. Cover images defined
 * 3. AVIF 1600w files exist for cover images
 * 4. JPEG fallback files exist
 *
 * Run before build to ensure all social sharing images are properly configured.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Gallery slugs from gallery.ts
const GALLERY_SLUGS = [
  'kuchyn-bila-ostruvek',
  'kuchyn-cerna',
  'kuchyn-bila-u-tvar',
  'kuchyn-bila-podkrovi',
  'kuchyn-seda',
  'kuchyn-bilo-hneda-beton',
  'kuchyn-bilo-hneda-l-varianta1',
  'kuchyn-bilo-hneda-u-alternativa',
  'kuchyn-hneda-l',
  'kuchyn-mala-panel',
  'kuchyn-retro-bila',
  'kuchyn-svetla-rohova',
  'kuchyn-uzka-bila-l',
  'loznice-bilo-hneda',
  'loznice-hneda',
  'loznice-hneda-zkosene',
  'chodba-bila',
  'chodba-sedo-hneda',
  'koupelna-1',
  'koupelna-2',
  'koupelna-cerna',
  'obyvak',
  'ostatni-dvere',
  'ostatni-live-edge-masiv',
  'ostatni-schody',
  'skrin-a-dvere',
  'skrin-dvere-botnik',
  'skrin-posuv-vstup'
] as const;

interface ValidationResult {
  galleryId: string;
  status: 'success' | 'warning' | 'error';
  issues: string[];
  coverImage?: string;
  avifExists?: boolean;
  jpegExists?: boolean;
}

interface GalleryJson {
  id: string;
  title: string;
  coverImage: string;
  images: Array<{
    src: string;
    width: number;
    height: number;
  }>;
}

/**
 * Validate a single gallery's OG image configuration
 */
function validateGallery(galleryId: string): ValidationResult {
  const result: ValidationResult = {
    galleryId,
    status: 'success',
    issues: []
  };

  const galleryPath = path.join(__dirname, '..', 'public', 'images', 'galleries', galleryId);
  const jsonPath = path.join(galleryPath, 'gallery.json');

  // Check if gallery directory exists
  if (!fs.existsSync(galleryPath)) {
    result.status = 'error';
    result.issues.push('Gallery directory does not exist');
    return result;
  }

  // Check if gallery.json exists
  if (!fs.existsSync(jsonPath)) {
    result.status = 'error';
    result.issues.push('gallery.json does not exist');
    return result;
  }

  // Parse gallery.json
  let galleryData: GalleryJson;
  try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    galleryData = JSON.parse(jsonContent);
  } catch (error) {
    result.status = 'error';
    result.issues.push(`Failed to parse gallery.json: ${error}`);
    return result;
  }

  // Validate cover image field
  if (!galleryData.coverImage) {
    result.status = 'error';
    result.issues.push('coverImage field is missing in gallery.json');
    return result;
  }

  result.coverImage = galleryData.coverImage;

  // Extract base filename
  const fileName = galleryData.coverImage.split('/').pop() || galleryData.coverImage;
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace('-web', '');

  // Check for 1600w AVIF (used for OG image)
  const avifPath = path.join(galleryPath, `${baseName}-web-1600w.avif`);
  result.avifExists = fs.existsSync(avifPath);

  if (!result.avifExists) {
    result.status = 'warning';
    result.issues.push(`Missing 1600w AVIF: ${baseName}-web-1600w.avif`);
  }

  // Check for JPEG fallback
  const jpegPath = path.join(galleryPath, `${baseName}-web.jpg`);
  result.jpegExists = fs.existsSync(jpegPath);

  if (!result.jpegExists) {
    result.status = result.status === 'error' ? 'error' : 'warning';
    result.issues.push(`Missing JPEG fallback: ${baseName}-web.jpg`);
  }

  // Additional check: verify image dimensions from gallery.json
  const coverImageData = galleryData.images.find(img => img.src === galleryData.coverImage);
  if (!coverImageData) {
    result.status = 'warning';
    result.issues.push('Cover image not found in images array');
  } else if (!coverImageData.width || !coverImageData.height) {
    result.status = 'warning';
    result.issues.push('Cover image missing width/height metadata');
  }

  return result;
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Validating OG images for all galleries...\n');
  console.log(`Total galleries to check: ${GALLERY_SLUGS.length}\n`);

  const results: ValidationResult[] = [];
  let successCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  // Validate each gallery
  for (const galleryId of GALLERY_SLUGS) {
    const result = validateGallery(galleryId);
    results.push(result);

    if (result.status === 'success') {
      successCount++;
    } else if (result.status === 'warning') {
      warningCount++;
    } else if (result.status === 'error') {
      errorCount++;
    }
  }

  // Print summary
  console.log('📊 Validation Summary:');
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ⚠️  Warning: ${warningCount}`);
  console.log(`  ❌ Error: ${errorCount}\n`);

  // Print detailed results for issues
  const issueResults = results.filter(r => r.status !== 'success');

  if (issueResults.length > 0) {
    console.log('📋 Issues Found:\n');

    for (const result of issueResults) {
      const icon = result.status === 'error' ? '❌' : '⚠️ ';
      console.log(`${icon} ${result.galleryId}`);

      if (result.coverImage) {
        console.log(`  Cover: ${result.coverImage}`);
      }

      if (result.avifExists !== undefined) {
        console.log(`  AVIF (1600w): ${result.avifExists ? '✓' : '✗'}`);
      }

      if (result.jpegExists !== undefined) {
        console.log(`  JPEG fallback: ${result.jpegExists ? '✓' : '✗'}`);
      }

      for (const issue of result.issues) {
        console.log(`  - ${issue}`);
      }

      console.log('');
    }
  } else {
    console.log('✨ All galleries validated successfully!\n');
  }

  // Print galleries with complete OG image setup
  const completeGalleries = results.filter(
    r => r.status === 'success' && r.avifExists && r.jpegExists
  );

  if (completeGalleries.length > 0) {
    console.log(`✅ Galleries with complete OG image setup (${completeGalleries.length}):`);
    for (const result of completeGalleries) {
      console.log(`  • ${result.galleryId}`);
    }
    console.log('');
  }

  // Exit with appropriate code
  if (errorCount > 0) {
    console.error('❌ Validation failed with errors. Please fix the issues above.');
    process.exit(1);
  } else if (warningCount > 0) {
    console.warn('⚠️  Validation completed with warnings. Review the issues above.');
    process.exit(0); // Don't fail build for warnings
  } else {
    console.log('✅ All validations passed!');
    process.exit(0);
  }
}

// Run validation
main();
