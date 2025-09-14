# Phosphor Icons Migration Guide

This document provides a comprehensive guide for migrating from font-based Phosphor icons to component-based SVG icons in the Qwik application.

## Overview

The migration replaces the `@phosphor-icons/web` font-based system with individual SVG components generated from `@phosphor-icons/core`. This provides better performance, tree-shaking, and eliminates the need to load large font files.

## Benefits of Component-Based Icons

### 1. **Tree-Shaking**
- Only icons that are imported get bundled
- Significantly smaller bundle size
- No unused icons in production

### 2. **Performance**
- No font loading delays
- No FOUC (Flash of Unstyled Content)
- Instant rendering with SSR

### 3. **Developer Experience**
- TypeScript support with proper prop types
- Better IDE autocomplete
- Import-based usage prevents typos

### 4. **Maintainability**
- Exact same visual appearance as font icons
- Same CSS custom property support
- No breaking changes to styling system

## Available Components

All 22 required icons have been generated as individual components:

```typescript
// Core icons
export { PhHeart } from './PhHeart';
export { PhInstagramLogo } from './PhInstagramLogo';
export { PhArrowLeft } from './PhArrowLeft';
export { PhImages } from './PhImages';
export { PhCalendar } from './PhCalendar';
export { PhMapPin } from './PhMapPin';
export { PhEye } from './PhEye';

// Service icons
export { PhCookingPot } from './PhCookingPot';
export { PhDoorOpen } from './PhDoorOpen';
export { PhBathtub } from './PhBathtub';
export { PhDesk } from './PhDesk';
export { PhMagicWand } from './PhMagicWand';

// UI icons
export { PhCookie } from './PhCookie';
export { PhCheckCircle } from './PhCheckCircle';
export { PhGear } from './PhGear';
export { PhFloppyDisk } from './PhFloppyDisk';

// Social & Contact icons
export { PhFacebookLogo } from './PhFacebookLogo';
export { PhPhone } from './PhPhone';
export { PhEnvelopeSimple } from './PhEnvelopeSimple';

// Value icons
export { PhMedal } from './PhMedal';
export { PhCrosshair } from './PhCrosshair';
export { PhClock } from './PhClock';
```

## Migration Examples

### Basic Usage

**Before (Font-based):**
```jsx
<i class="ph-duotone ph-heart" style="font-size: 24px;"></i>
```

**After (Component-based):**
```jsx
import { PhHeart } from '~/components/icons';
<PhHeart size={24} />
```

### With CSS Classes

**Before:**
```jsx
<i class="ph-duotone ph-heart icon-duotone-reverse" style="font-size: 24px;"></i>
```

**After:**
```jsx
<PhHeart size={24} class="icon-duotone-reverse" />
```

### With Custom Styles

**Before:**
```jsx
<i class="ph-duotone ph-heart" style="font-size: 32px; color: red;"></i>
```

**After:**
```jsx
<PhHeart size={32} style={{ color: 'red' }} />
```

### Multiple Imports

```jsx
// Import multiple icons at once
import {
  PhHeart,
  PhInstagramLogo,
  PhArrowLeft,
  PhImages
} from '~/components/icons';

// Use in JSX
<PhHeart size={24} />
<PhInstagramLogo size={32} class="icon-duotone" />
<PhArrowLeft size={20} />
<PhImages size={24} />
```

## Component Props

Each icon component supports the following props:

```typescript
interface PhIconProps {
  size?: string | number;     // Converts to font-size CSS property
  style?: any;               // Additional CSS styles
  class?: string;            // CSS classes
}
```

### Size Prop
- **Number**: Converted to pixels (e.g., `24` → `"24px"`)
- **String**: Used as-is (e.g., `"2rem"`, `"1.5em"`)
- **Default**: `"1em"`

### Style Prop
Merged with the size-based font-size. Example:
```jsx
<PhHeart
  size={32}
  style={{ color: 'red', marginRight: '8px' }}
/>
```

### Class Prop
Supports all existing CSS classes:
```jsx
<PhHeart class="icon-duotone-reverse" />
<PhInstagramLogo class="icon-duotone-accent" />
<PhArrowLeft class="hover:text-blue-500" />
```

## CSS Custom Properties

Components maintain full compatibility with existing CSS custom properties:

```css
/* Existing CSS still works */
.icon-duotone {
  --ph-duotone-primary: var(--gold);
  --ph-duotone-secondary: currentColor;
}

.icon-duotone-reverse {
  --ph-duotone-primary: currentColor;
  --ph-duotone-secondary: var(--gold);
}

.icon-duotone-accent {
  --ph-duotone-primary: var(--secondary);
  --ph-duotone-secondary: currentColor;
}
```

## Complete Migration Checklist

### 1. Update Imports

Replace any generic icon imports with specific component imports:

```jsx
// OLD - Don't do this
import { Icon } from '~/components/icons';

// NEW - Do this for tree-shaking
import { PhHeart, PhArrowLeft } from '~/components/icons';
```

### 2. Replace Font Icons

Find and replace all instances:

#### Heart Icon
```diff
- <i class="ph-duotone ph-heart" style="font-size: 24px;"></i>
+ <PhHeart size={24} />
```

#### Instagram Logo
```diff
- <i class="ph-duotone ph-instagram-logo" style="font-size: 32px;"></i>
+ <PhInstagramLogo size={32} />
```

#### Arrow Left
```diff
- <i class="ph-duotone ph-arrow-left" style="font-size: 18px;"></i>
+ <PhArrowLeft size={18} />
```

#### And so on for all icons...

### 3. Update Component Files

#### InstagramSection.tsx
```diff
+ import { PhHeart, PhInstagramLogo } from '~/components/icons';

- <i class="ph-duotone ph-heart icon-duotone-reverse" style="font-size: 24px;"></i>
+ <PhHeart size={24} class="icon-duotone-reverse" />

- <i class="ph-duotone ph-instagram-logo icon-duotone" style="font-size: 32px;"></i>
+ <PhInstagramLogo size={32} class="icon-duotone" />
```

#### ServicesSection.tsx
```diff
+ import { PhCookingPot, PhDoorOpen, PhBathtub, PhDesk, PhMagicWand } from '~/components/icons';

- <i class="ph-duotone ph-cooking-pot icon-duotone-reverse" style="font-size: 48px;"></i>
+ <PhCookingPot size={48} class="icon-duotone-reverse" />
```

#### CookieBar.tsx
```diff
+ import { PhCookie, PhCheckCircle, PhGear, PhFloppyDisk } from '~/components/icons';

- <i class="ph-duotone ph-cookie" style="font-size: 18px;"></i>
+ <PhCookie size={18} />
```

#### GalleriesPage.tsx
```diff
+ import { PhArrowLeft, PhImages, PhCalendar, PhMapPin, PhEye } from '~/components/icons';

- <i class="ph-duotone ph-arrow-left" style="font-size: 18px;"></i>
+ <PhArrowLeft size={18} />
```

#### ContactSection.tsx
```diff
+ import { PhMapPin, PhPhone, PhEnvelopeSimple, PhClock } from '~/components/icons';

- <i class="ph-duotone ph-map-pin" style="font-size: 28px;"></i>
+ <PhMapPin size={28} />
```

#### Footer.tsx
```diff
+ import { PhInstagramLogo, PhFacebookLogo, PhPhone, PhEnvelopeSimple, PhMapPin } from '~/components/icons';

- <i class="ph-duotone ph-instagram-logo"></i>
+ <PhInstagramLogo />
```

#### ValuesSection.tsx
```diff
+ import { PhMedal, PhCrosshair, PhHeart } from '~/components/icons';

- <i class="ph-duotone ph-medal icon-duotone-accent" style="font-size: 64px;"></i>
+ <PhMedal size={64} class="icon-duotone-accent" />
```

#### PortfolioSection.tsx
```diff
+ import { PhImages } from '~/components/icons';

- <i class="ph-duotone ph-images" style="font-size: 24px;"></i>
+ <PhImages size={24} />
```

### 4. Test Migration

Use the `PhosphorIconsDemo` component to verify visual parity:

```jsx
import { PhosphorIconsDemo } from '~/components/PhosphorIconsDemo';

// Add to any route for testing
<PhosphorIconsDemo />
```

### 5. Bundle Analysis

After migration, verify bundle size reduction:

```bash
npm run build
```

Check that font files are no longer included in the build output.

### 6. Remove Font Dependencies (Optional)

After confirming the migration works:

```bash
npm uninstall @phosphor-icons/web
```

Remove font loading from HTML:
```diff
// Remove from public/index.html or global CSS
- <link href="/path/to/phosphor-icons.css" rel="stylesheet">
```

## Performance Impact

### Before (Font-based)
- **Font files**: ~1.7MB SVG sprite + 164KB WOFF2 + additional formats
- **FOUC risk**: Icons invisible until font loads
- **Bundle impact**: All 1,512 icons loaded regardless of usage

### After (Component-based)
- **Bundle size**: Only used icons (~1-2KB per icon)
- **No FOUC**: Icons render immediately with SSR
- **Tree-shaking**: Unused icons completely eliminated

### Example Bundle Impact
For this project using 22 icons:
- **Before**: ~1.9MB (full font)
- **After**: ~44KB (22 components × ~2KB average)
- **Savings**: ~97% reduction in icon-related bundle size

## Troubleshooting

### Icons Not Showing
1. Verify correct import path: `~/components/icons`
2. Check component name matches: `PhHeart` not `Ph-Heart`
3. Ensure size prop is provided if icon appears too small

### Styling Issues
1. Verify CSS custom properties are defined
2. Check that CSS classes are applied correctly
3. Use browser dev tools to inspect SVG structure

### TypeScript Errors
1. Ensure proper prop types are used
2. Check that components are imported correctly
3. Verify no typos in component names

### Build Errors
1. Check for unused imports (tree-shaking)
2. Verify all referenced components exist
3. Run type checking: `npm run typecheck`

## Future Maintenance

### Adding New Icons
1. Add icon mapping to `scripts/generate-phosphor-icons.js`
2. Run: `node scripts/generate-phosphor-icons.js`
3. Update exports in `src/components/icons/phosphor/index.ts`
4. Import and use the new component

### Updating Icons
1. Update `@phosphor-icons/core` package
2. Regenerate components: `node scripts/generate-phosphor-icons.js`
3. Test for any visual changes

### Customization
Each generated component can be manually edited if needed, but prefer updating the generation script for consistency.

## Conclusion

This migration provides significant performance benefits while maintaining visual parity and CSS compatibility. The component-based approach offers better developer experience, smaller bundles, and faster loading times.

The migration should be done incrementally, testing each component as it's migrated to ensure no regressions.