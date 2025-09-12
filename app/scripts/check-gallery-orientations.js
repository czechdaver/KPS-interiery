#!/usr/bin/env node
/**
 * Gallery orientation checker and fixer for KPS Interiéry
 * Checks actual image dimensions vs gallery JSON metadata and fixes mismatches
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const galleriesDir = path.join(__dirname, '..', 'public', 'images', 'galleries');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Get all gallery directories
 */
async function getGalleryDirs() {
  try {
    const entries = await fs.readdir(galleriesDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
  } catch (error) {
    console.error('❌ Error reading galleries directory:', error.message);
    return [];
  }
}

/**
 * Get actual image dimensions from original resource files
 */
async function getActualImageDimensions(galleryDir) {
  const imageDimensions = {};
  
  try {
    const files = await fs.readdir(galleryDir);
    const originalFiles = files.filter(f => f.includes('-original-resource.jpg'));
    
    for (const file of originalFiles) {
      try {
        const fullPath = path.join(galleryDir, file);
        const metadata = await sharp(fullPath).metadata();
        
        // Extract base name (e.g., "kuchyne_0066-original-resource.jpg" -> "kuchyne_0066")
        const baseName = file.replace('-original-resource.jpg', '');
        const webFileName = `${baseName}-web.jpg`;
        
        imageDimensions[webFileName] = {
          width: metadata.width,
          height: metadata.height,
          isPortrait: metadata.height > metadata.width,
          originalFile: file
        };
      } catch (error) {
        console.error(`  ❌ Error processing ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`  ❌ Error reading directory ${galleryDir}:`, error.message);
  }
  
  return imageDimensions;
}

/**
 * Load and parse gallery JSON
 */
async function loadGalleryJSON(galleryDir) {
  try {
    const jsonPath = path.join(galleryDir, 'gallery.json');
    const content = await fs.readFile(jsonPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`  ❌ Error loading gallery.json:`, error.message);
    return null;
  }
}

/**
 * Save updated gallery JSON
 */
async function saveGalleryJSON(galleryDir, galleryData) {
  try {
    const jsonPath = path.join(galleryDir, 'gallery.json');
    await fs.writeFile(jsonPath, JSON.stringify(galleryData, null, 2));
    return true;
  } catch (error) {
    console.error(`  ❌ Error saving gallery.json:`, error.message);
    return false;
  }
}

/**
 * Check and fix orientation issues in a single gallery
 */
async function checkGalleryOrientation(galleryName) {
  const galleryDir = path.join(galleriesDir, galleryName);
  
  console.log(`\n${colors.cyan}📁 Checking gallery: ${colors.bright}${galleryName}${colors.reset}`);
  
  // Get actual dimensions from original files
  const actualDimensions = await getActualImageDimensions(galleryDir);
  
  if (Object.keys(actualDimensions).length === 0) {
    console.log('  ⚠️  No original resource files found');
    return { checked: 0, fixed: 0, errors: 1 };
  }
  
  // Load gallery JSON
  const galleryData = await loadGalleryJSON(galleryDir);
  
  if (!galleryData || !galleryData.images) {
    console.log('  ❌ Invalid or missing gallery.json');
    return { checked: 0, fixed: 0, errors: 1 };
  }
  
  let checked = 0;
  let fixed = 0;
  let hasChanges = false;
  
  // Check each image in the JSON
  for (const image of galleryData.images) {
    checked++;
    const actual = actualDimensions[image.src];
    
    if (!actual) {
      console.log(`  ❌ ${image.src}: Original file not found`);
      continue;
    }
    
    const jsonWidth = image.width;
    const jsonHeight = image.height;
    const actualWidth = actual.width;
    const actualHeight = actual.height;
    
    // Check if dimensions match
    if (jsonWidth !== actualWidth || jsonHeight !== actualHeight) {
      console.log(`  🔧 ${colors.yellow}FIXING${colors.reset} ${image.src}:`);
      console.log(`     JSON:   ${jsonWidth}x${jsonHeight} ${jsonHeight > jsonWidth ? '(portrait)' : '(landscape)'}`);
      console.log(`     Actual: ${actualWidth}x${actualHeight} ${actualHeight > actualWidth ? '(portrait)' : '(landscape)'}`);
      
      // Update dimensions
      image.width = actualWidth;
      image.height = actualHeight;
      hasChanges = true;
      fixed++;
    } else {
      console.log(`  ✅ ${image.src}: Dimensions correct (${actualWidth}x${actualHeight})`);
    }
  }
  
  // Save changes if any
  if (hasChanges) {
    const success = await saveGalleryJSON(galleryDir, galleryData);
    if (success) {
      console.log(`  ${colors.green}✨ Updated gallery.json with ${fixed} fixes${colors.reset}`);
    } else {
      console.log(`  ❌ Failed to save gallery.json`);
      return { checked, fixed: 0, errors: 1 };
    }
  } else {
    console.log(`  ${colors.green}✅ All dimensions are correct${colors.reset}`);
  }
  
  return { checked, fixed, errors: 0 };
}

/**
 * Check missing AVIF variants
 */
async function checkMissingVariants(galleryName) {
  const galleryDir = path.join(galleriesDir, galleryName);
  const files = await fs.readdir(galleryDir);
  
  const originalFiles = files.filter(f => f.includes('-original-resource.jpg'));
  const missingVariants = [];
  
  for (const originalFile of originalFiles) {
    const baseName = originalFile.replace('-original-resource.jpg', '');
    
    // Check for each expected variant
    const expectedVariants = [
      `${baseName}-web-400w.avif`,
      `${baseName}-web-800w.avif`,
      `${baseName}-web-1200w.avif`,
      `${baseName}-web-1600w.avif`,
      `${baseName}-web-2400w.avif`,
      `${baseName}-web.jpg`
    ];
    
    for (const variant of expectedVariants) {
      if (!files.includes(variant)) {
        missingVariants.push({ original: originalFile, missing: variant });
      }
    }
  }
  
  if (missingVariants.length > 0) {
    console.log(`  ${colors.yellow}⚠️  Missing ${missingVariants.length} variants${colors.reset}`);
    missingVariants.forEach(({ original, missing }) => {
      console.log(`     ${original} -> ${missing}`);
    });
  }
  
  return missingVariants;
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.bright}🔍 Gallery Orientation Checker${colors.reset}`);
  console.log('=====================================\n');
  
  const galleries = await getGalleryDirs();
  
  if (galleries.length === 0) {
    console.error('❌ No galleries found');
    process.exit(1);
  }
  
  console.log(`Found ${galleries.length} galleries: ${galleries.join(', ')}\n`);
  
  let totalChecked = 0;
  let totalFixed = 0;
  let totalErrors = 0;
  let totalMissingVariants = 0;
  
  // Check each gallery
  for (const gallery of galleries) {
    const result = await checkGalleryOrientation(gallery);
    totalChecked += result.checked;
    totalFixed += result.fixed;
    totalErrors += result.errors;
    
    // Check for missing variants
    const missingVariants = await checkMissingVariants(gallery);
    totalMissingVariants += missingVariants.length;
  }
  
  // Summary
  console.log(`\n${colors.bright}📊 Summary${colors.reset}`);
  console.log('===========');
  console.log(`Images checked: ${totalChecked}`);
  console.log(`Dimensions fixed: ${colors.green}${totalFixed}${colors.reset}`);
  console.log(`Errors: ${totalErrors > 0 ? colors.red : colors.green}${totalErrors}${colors.reset}`);
  console.log(`Missing variants: ${totalMissingVariants > 0 ? colors.yellow : colors.green}${totalMissingVariants}${colors.reset}`);
  
  if (totalMissingVariants > 0) {
    console.log(`\n${colors.yellow}💡 To generate missing variants, run:${colors.reset}`);
    console.log(`   npm run images:process`);
  }
  
  if (totalFixed > 0) {
    console.log(`\n${colors.green}✨ Fixed ${totalFixed} orientation issues!${colors.reset}`);
  } else if (totalErrors === 0) {
    console.log(`\n${colors.green}✅ All galleries have correct orientation metadata!${colors.reset}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}