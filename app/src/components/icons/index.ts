import { type PropsOf } from '@builder.io/qwik';

// Export the base PhosphorIcon component (for fallback)
export * from './PhosphorIcon';

// Export all individual Phosphor icon components for tree-shaking
export * from './phosphor';

export interface PhosphorIconProps extends PropsOf<'svg'> {
  size?: string | number;
  color?: string;
  class?: string;
}

/**
 * Optimized Phosphor Icon system for Qwik
 *
 * Components available:
 * - PhHeart, PhInstagramLogo, PhArrowLeft, PhImages, PhCalendar, PhMapPin, PhEye
 * - PhCookingPot, PhDoorOpen, PhBathtub, PhDesk, PhMagicWand, PhCookie
 * - PhCheckCircle, PhGear, PhFloppyDisk, PhFacebookLogo, PhPhone
 * - PhEnvelopeSimple, PhMedal, PhCrosshair, PhClock
 *
 * Features:
 * - Tree-shakable: Only bundles icons that are imported/used
 * - SSR-compatible: No client-side runtime overhead
 * - Zero dependencies: Uses raw SVG data from @phosphor-icons/core
 * - Duotone support: Maintains proper opacity paths for duotone variants
 * - Type-safe: Full TypeScript support with proper prop types
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 *
 * Migration from font-based system:
 * OLD: <i class="ph-duotone ph-heart" style="font-size: 24px;"></i>
 * NEW: <PhHeart size={24} class="icon-duotone-reverse" />
 *
 * Benefits over old system:
 * 1. Tree-shaking: Only bundle icons you use
 * 2. No sprite loading overhead
 * 3. Better TypeScript support
 * 4. SSR compatible out of the box
 * 5. No external font dependencies
 * 6. Identical visual appearance
 */

// Re-export for convenience (though direct imports are preferred for tree-shaking)
export { PhosphorIcon as Icon } from './PhosphorIcon';