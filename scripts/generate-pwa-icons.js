#!/usr/bin/env node

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const require = createRequire(import.meta.url);

// Try to import sharp from the app directory
let sharp;
try {
  sharp = require('../app/node_modules/sharp');
} catch (e) {
  console.error('❌ Sharp not found. Please run this script from the project root or install sharp globally.');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  inputSvg: join(__dirname, '../app/public/branding/fav.svg'),
  outputDir: join(__dirname, '../app/public/icons'),
  iconSizes: [48, 72, 96, 128, 144, 152, 192, 384, 512],
  maskableSizes: [192, 512],
  shortcutSizes: [96],
  // KPS Interiéry brand colors
  backgroundColor: '#F5ECE6', // Light cream background
  primaryColor: '#322624',    // Dark brown from CSS
  secondaryColor: '#C88B4E'   // Caramel color from CSS
};

console.log('🎨 KPS Interiéry PWA Icon Generator');
console.log('=====================================');

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

async function generateStandardIcons() {
  console.log('\n📱 Generating standard PWA icons...');

  for (const size of config.iconSizes) {
    const outputPath = join(config.outputDir, `icon-${size}x${size}.png`);

    try {
      await sharp(config.inputSvg)
        .resize(size, size)
        .png({
          quality: 90,
          compressionLevel: 8
        })
        .toFile(outputPath);

      console.log(`  ✅ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`  ❌ Failed to generate icon-${size}x${size}.png:`, error.message);
    }
  }
}

async function generateMaskableIcons() {
  console.log('\n🎭 Generating maskable icons...');

  for (const size of config.maskableSizes) {
    const outputPath = join(config.outputDir, `icon-${size}x${size}-maskable.png`);

    try {
      // Create a maskable icon with safe area padding (20% on each side)
      const safeAreaSize = Math.round(size * 0.6); // Icon takes 60% of total area
      const padding = Math.round((size - safeAreaSize) / 2);

      // Create background canvas
      const background = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: config.backgroundColor
        }
      }).png();

      // Resize SVG to safe area
      const iconBuffer = await sharp(config.inputSvg)
        .resize(safeAreaSize, safeAreaSize)
        .png()
        .toBuffer();

      // Composite icon onto background
      await background
        .composite([{
          input: iconBuffer,
          left: padding,
          top: padding
        }])
        .png({
          quality: 90,
          compressionLevel: 8
        })
        .toFile(outputPath);

      console.log(`  ✅ Generated: icon-${size}x${size}-maskable.png`);
    } catch (error) {
      console.error(`  ❌ Failed to generate maskable icon-${size}x${size}.png:`, error.message);
    }
  }
}

async function generateShortcutIcons() {
  console.log('\n🔗 Generating shortcut icons...');

  const shortcuts = [
    { name: 'gallery', icon: '🖼️', label: 'Galerie' },
    { name: 'contact', icon: '📞', label: 'Kontakt' },
    { name: 'about', icon: 'ℹ️', label: 'O nás' }
  ];

  for (const shortcut of shortcuts) {
    for (const size of config.shortcutSizes) {
      const outputPath = join(config.outputDir, `shortcut-${shortcut.name}.png`);

      try {
        // Create a simple colored background with emoji/text
        const svg = `
          <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${config.primaryColor}" rx="12"/>
            <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="${size * 0.4}"
                  text-anchor="middle" dominant-baseline="central" fill="white">
              ${shortcut.icon}
            </text>
          </svg>
        `;

        await sharp(Buffer.from(svg))
          .png({
            quality: 90,
            compressionLevel: 8
          })
          .toFile(outputPath);

        console.log(`  ✅ Generated: shortcut-${shortcut.name}.png`);
      } catch (error) {
        console.error(`  ❌ Failed to generate shortcut-${shortcut.name}.png:`, error.message);
      }
    }
  }
}

async function generateAdditionalAssets() {
  console.log('\n🔧 Generating additional PWA assets...');

  // Generate Apple Touch Icon
  try {
    const appleTouchIconPath = join(config.outputDir, 'apple-touch-icon.png');
    await sharp(config.inputSvg)
      .resize(180, 180)
      .png({
        quality: 90,
        compressionLevel: 8
      })
      .toFile(appleTouchIconPath);
    console.log('  ✅ Generated: apple-touch-icon.png');
  } catch (error) {
    console.error('  ❌ Failed to generate apple-touch-icon.png:', error.message);
  }

  // Generate favicon.ico (multiple sizes in one file)
  try {
    const faviconPath = join(__dirname, '../app/public/favicon.ico');
    await sharp(config.inputSvg)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));
    console.log('  ✅ Generated: favicon.png (ICO generation requires additional tools)');
  } catch (error) {
    console.error('  ❌ Failed to generate favicon:', error.message);
  }
}

async function main() {
  try {
    // Ensure output directory exists
    await ensureDirectoryExists(config.outputDir);

    // Check if input SVG exists
    try {
      await fs.access(config.inputSvg);
    } catch {
      console.error(`❌ Input SVG not found: ${config.inputSvg}`);
      process.exit(1);
    }

    // Generate all icon types
    await generateStandardIcons();
    await generateMaskableIcons();
    await generateShortcutIcons();
    await generateAdditionalAssets();

    console.log('\n✨ PWA icon generation complete!');
    console.log('\n📋 Generated files:');

    const files = await fs.readdir(config.outputDir);
    files.sort().forEach(file => {
      console.log(`   - ${file}`);
    });

  } catch (error) {
    console.error('❌ Error generating PWA icons:', error);
    process.exit(1);
  }
}

// Run the script
main();