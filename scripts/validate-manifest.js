#!/usr/bin/env node

import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function validateManifest() {
  console.log('🔍 PWA Manifest Validation');
  console.log('===========================');

  try {
    const manifestPath = join(__dirname, '../app/public/manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);

    // Check required fields
    const required = ['name', 'short_name', 'start_url', 'display', 'icons'];
    const missing = required.filter(field => !manifest[field]);

    if (missing.length > 0) {
      console.error('❌ Missing required fields:', missing.join(', '));
    } else {
      console.log('✅ All required fields present');
    }

    // Check icons
    if (manifest.icons && manifest.icons.length > 0) {
      console.log('✅ Icons configured:', manifest.icons.length, 'icons');
      const sizes = manifest.icons.map(icon => icon.sizes).filter(s => s !== 'any');
      console.log('   Sizes:', sizes.join(', '));

      // Check for essential sizes
      const essentialSizes = ['192x192', '512x512'];
      const hasEssential = essentialSizes.every(size =>
        manifest.icons.some(icon => icon.sizes === size)
      );

      if (hasEssential) {
        console.log('✅ Essential icon sizes present (192x192, 512x512)');
      } else {
        console.log('⚠️ Missing essential icon sizes (192x192, 512x512)');
      }
    } else {
      console.error('❌ No icons configured');
    }

    // Check theme color
    if (manifest.theme_color) {
      console.log('✅ Theme color:', manifest.theme_color);
    } else {
      console.log('⚠️ No theme color set');
    }

    // Check background color
    if (manifest.background_color) {
      console.log('✅ Background color:', manifest.background_color);
    } else {
      console.log('⚠️ No background color set');
    }

    // Check language
    if (manifest.lang) {
      console.log('✅ Language:', manifest.lang);
    } else {
      console.log('⚠️ No language set');
    }

    // Check shortcuts
    if (manifest.shortcuts && manifest.shortcuts.length > 0) {
      console.log('✅ Shortcuts configured:', manifest.shortcuts.length, 'shortcuts');
      manifest.shortcuts.forEach(shortcut => {
        console.log('   -', shortcut.name, '→', shortcut.url);
      });
    } else {
      console.log('ℹ️ No shortcuts configured');
    }

    // Check PWA features
    console.log('\n🚀 PWA Features:');
    if (manifest.display === 'standalone' || manifest.display === 'fullscreen') {
      console.log('✅ App-like display mode:', manifest.display);
    } else {
      console.log('⚠️ Display mode may not provide app-like experience:', manifest.display);
    }

    if (manifest.categories && manifest.categories.length > 0) {
      console.log('✅ Categories defined for app stores:', manifest.categories.join(', '));
    }

    if (manifest.screenshots && manifest.screenshots.length > 0) {
      console.log('✅ Screenshots defined for enhanced listing');
    } else {
      console.log('ℹ️ No screenshots defined (optional but recommended)');
    }

    console.log('\n📊 Manifest Summary:');
    console.log('   Name:', manifest.name);
    console.log('   Short Name:', manifest.short_name);
    console.log('   Description:', manifest.description.substring(0, 50) + '...');
    console.log('   Display Mode:', manifest.display);
    console.log('   Orientation:', manifest.orientation);
    console.log('   Start URL:', manifest.start_url);
    console.log('   Scope:', manifest.scope);

    console.log('\n✨ Validation Complete!');

    // Check for icon files existence
    console.log('\n📁 Checking icon file existence...');
    const iconDir = join(__dirname, '../app/public/icons');
    try {
      const files = await fs.readdir(iconDir);
      console.log('✅ Found', files.length, 'icon files');
    } catch (error) {
      console.log('❌ Icons directory not found or empty');
    }

  } catch (error) {
    console.error('❌ Error validating manifest:', error.message);
    process.exit(1);
  }
}

validateManifest();