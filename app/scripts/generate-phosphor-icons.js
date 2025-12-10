#!/usr/bin/env node

/**
 * Generate Phosphor Icon Components for Qwik
 *
 * This script reads SVG files from @phosphor-icons/core and generates
 * Qwik components with proper duotone support and CSS custom properties.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Icon mapping: [font-class-name] -> [svg-filename, ComponentName]
const iconMappings = {
  'ph-heart': ['heart-duotone.svg', 'PhHeart'],
  'ph-house': ['house-duotone.svg', 'PhHouse'],
  'ph-instagram-logo': ['instagram-logo-duotone.svg', 'PhInstagramLogo'],
  'ph-arrow-left': ['arrow-left-duotone.svg', 'PhArrowLeft'],
  'ph-images': ['images-duotone.svg', 'PhImages'],
  'ph-calendar': ['calendar-duotone.svg', 'PhCalendar'],
  'ph-map-pin': ['map-pin-duotone.svg', 'PhMapPin'],
  'ph-eye': ['eye-duotone.svg', 'PhEye'],
  'ph-cooking-pot': ['cooking-pot-duotone.svg', 'PhCookingPot'],
  'ph-door-open': ['door-open-duotone.svg', 'PhDoorOpen'],
  'ph-bathtub': ['bathtub-duotone.svg', 'PhBathtub'],
  'ph-desk': ['desk-duotone.svg', 'PhDesk'],
  'ph-magic-wand': ['magic-wand-duotone.svg', 'PhMagicWand'],
  'ph-cookie': ['cookie-duotone.svg', 'PhCookie'],
  'ph-check-circle': ['check-circle-duotone.svg', 'PhCheckCircle'],
  'ph-gear': ['gear-duotone.svg', 'PhGear'],
  'ph-floppy-disk': ['floppy-disk-duotone.svg', 'PhFloppyDisk'],
  'ph-facebook-logo': ['facebook-logo-duotone.svg', 'PhFacebookLogo'],
  'ph-phone': ['phone-duotone.svg', 'PhPhone'],
  'ph-envelope-simple': ['envelope-simple-duotone.svg', 'PhEnvelopeSimple'],
  'ph-medal': ['medal-duotone.svg', 'PhMedal'],
  'ph-crosshair': ['crosshair-duotone.svg', 'PhCrosshair'],
  'ph-clock': ['clock-duotone.svg', 'PhClock'],
  'ph-address-book-tabs': ['address-book-tabs-duotone.svg', 'PhAddressBookTabs']
};

const duotoneAssetsPath = path.join(__dirname, '../node_modules/@phosphor-icons/core/assets/duotone');
const outputDir = path.join(__dirname, '../src/components/icons/phosphor');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Parse SVG content and extract paths with their properties
 */
function parseSvgPaths(svgContent) {
  const paths = [];
  const pathRegex = /<path\s+([^>]+)\/?>(?:<\/path>)?/g;

  let match;
  while ((match = pathRegex.exec(svgContent)) !== null) {
    const attributes = match[1];

    // Extract d attribute (path data)
    const dMatch = attributes.match(/d="([^"]+)"/);
    if (!dMatch) continue;

    // Extract opacity (for duotone secondary layer)
    const opacityMatch = attributes.match(/opacity="([^"]+)"/);

    paths.push({
      d: dMatch[1],
      opacity: opacityMatch ? opacityMatch[1] : null
    });
  }

  return paths;
}

/**
 * Generate Qwik component from SVG paths
 */
function generateComponent(componentName, fontClassName, paths) {
  const hasSecondaryPath = paths.some(p => p.opacity);

  const pathElements = paths.map((pathData, index) => {
    const isSecondary = pathData.opacity === '0.2';

    if (isSecondary) {
      return `      {/* Secondary/background path with lower opacity */}
      <path
        d="${pathData.d}"
        fill="var(--ph-duotone-secondary, currentColor)"
        opacity="0.2"
      />`;
    } else {
      return `      {/* Primary path with full opacity */}
      <path
        d="${pathData.d}"
        fill="var(--ph-duotone-primary, currentColor)"
      />`;
    }
  }).join('\n');

  return `import { component$ } from '@builder.io/qwik';

export interface ${componentName}Props {
  size?: string | number;
  style?: any;
  class?: string;
}

/**
 * ${componentName} - Duotone Phosphor Icon
 *
 * Replacement for: <i class="ph-duotone ${fontClassName}" style="font-size: 24px;"></i>
 * Usage: <${componentName} size={24} class="icon-duotone-reverse" />
 *
 * Supports:
 * - size prop (converts to font-size in style)
 * - style prop (merged with size)
 * - class prop for CSS class names
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 */
export const ${componentName} = component$<${componentName}Props>(({
  size,
  style,
  class: className,
  ...props
}) => {
  const sizeValue = typeof size === 'number' ? \`\${size}px\` : (size || '1em');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 256 256"
      style={style}
      class={className}
      {...props}
    >
${pathElements}
    </svg>
  );
});`;
}

/**
 * Main generation function
 */
function generateAllIcons() {
  console.log('🚀 Generating Phosphor Icon Components...\n');

  const generatedComponents = [];

  for (const [fontClassName, [svgFilename, componentName]] of Object.entries(iconMappings)) {
    const svgPath = path.join(duotoneAssetsPath, svgFilename);

    if (!fs.existsSync(svgPath)) {
      console.error(`❌ SVG file not found: ${svgFilename}`);
      continue;
    }

    try {
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      const paths = parseSvgPaths(svgContent);

      if (paths.length === 0) {
        console.error(`❌ No paths found in ${svgFilename}`);
        continue;
      }

      const componentCode = generateComponent(componentName, fontClassName, paths);
      const outputPath = path.join(outputDir, `${componentName}.tsx`);

      fs.writeFileSync(outputPath, componentCode);
      generatedComponents.push({ componentName, fontClassName, filename: `${componentName}.tsx` });

      console.log(`✅ Generated: ${componentName} (${fontClassName})`);

    } catch (error) {
      console.error(`❌ Error processing ${svgFilename}:`, error.message);
    }
  }

  // Generate index.ts file
  generateIndexFile(generatedComponents);

  console.log(`\n🎉 Generated ${generatedComponents.length} icon components!`);
  console.log('\nNext steps:');
  console.log('1. Import icons: import { PhHeart, PhArrowLeft } from "~/components/icons";');
  console.log('2. Replace <i class="ph-duotone ph-heart" /> with <PhHeart />');
  console.log('3. Test visual parity with the demo component');
}

/**
 * Generate index.ts file for easy imports
 */
function generateIndexFile(components) {
  const imports = components
    .map(({ componentName }) => `export { ${componentName} } from './${componentName}';`)
    .join('\n');

  const indexContent = `// Auto-generated Phosphor Icon Components
// This file exports all Phosphor duotone icon components for easy importing
//
// Usage:
// import { PhHeart, PhArrowLeft, PhCalendar } from '~/components/icons/phosphor';

${imports}

// Component mapping for migration reference
export const PHOSPHOR_ICON_MAPPING = {
${components.map(({ fontClassName, componentName }) => `  '${fontClassName}': '${componentName}',`).join('\n')}
} as const;
`;

  const indexPath = path.join(outputDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`✅ Generated: index.ts with ${components.length} exports`);
}

// Run the generator
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllIcons();
}

export { generateAllIcons };