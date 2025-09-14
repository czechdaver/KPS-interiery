import { component$, type PropsOf } from '@builder.io/qwik';

// Import all Phosphor icons with tree-shaking support
export * from './phosphor';

export interface PhosphorIconProps extends PropsOf<'svg'> {
  size?: string | number;
  color?: string;
  class?: string;
}

/**
 * Optimized Phosphor Icon component for Qwik
 *
 * Features:
 * - Tree-shakable: Only bundles icons that are imported/used
 * - SSR-compatible: No client-side runtime overhead
 * - Zero dependencies: Uses raw SVG data from @phosphor-icons/core
 * - Duotone support: Maintains proper opacity paths for duotone variants
 * - Type-safe: Full TypeScript support with proper prop types
 *
 * Usage:
 * ```tsx
 * import { PhArrowLeft, PhCalendarDuotone } from '~/components/icons/PhosphorIcon';
 *
 * // Use specific imports for tree-shaking
 * <PhArrowLeft size={24} color="currentColor" />
 * <PhCalendarDuotone size="2rem" class="text-blue-500" />
 * ```
 *
 * Migration from old system:
 * Instead of: <Icon name="arrow-left" />
 * Use: <PhArrowLeft />
 *
 * Benefits over old system:
 * 1. Tree-shaking: Only bundle icons you use
 * 2. No sprite loading overhead
 * 3. Better TypeScript support
 * 4. SSR compatible out of the box
 * 5. No React dependency
 */
export const PhosphorIcon = component$<PhosphorIconProps>(({
  size,
  color,
  class: className,
  ...props
}) => {
  console.warn('PhosphorIcon: Generic component deprecated. Use specific imports like PhArrowLeft for better tree-shaking.');

  const sizeValue = typeof size === 'number' ? `${size}px` : (size || '1em');

  // This is a fallback component - in practice, developers should import specific icons
  // for optimal tree-shaking and performance
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 256 256"
      fill={color || 'currentColor'}
      class={className}
      {...props}
    >
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="64">
        ?
      </text>
    </svg>
  );
});

// Re-export for convenience (though direct imports are preferred)
export { PhosphorIcon as Icon };