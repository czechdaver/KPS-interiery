import { component$ } from '@builder.io/qwik';

export interface PhArrowLeftProps {
  size?: string | number;
  style?: any;
  class?: string;
}

/**
 * PhArrowLeft - Duotone Phosphor Icon
 *
 * Replacement for: <i class="ph-duotone ph-arrow-left" style="font-size: 24px;"></i>
 * Usage: <PhArrowLeft size={24} class="icon-duotone-reverse" />
 *
 * Supports:
 * - size prop (converts to font-size in style)
 * - style prop (merged with size)
 * - class prop for CSS class names
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 */
export const PhArrowLeft = component$<PhArrowLeftProps>(({
  size,
  style,
  class: className,
  ...props
}) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : (size || '1em');

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
      {/* Secondary/background path with lower opacity */}
      <path
        d="M112,56V200L40,128Z"
        fill="var(--ph-duotone-secondary, currentColor)"
        opacity="0.2"
      />
      {/* Primary path with full opacity */}
      <path
        d="M216,120H120V56a8,8,0,0,0-13.66-5.66l-72,72a8,8,0,0,0,0,11.32l72,72A8,8,0,0,0,120,200V136h96a8,8,0,0,0,0-16ZM104,180.69,51.31,128,104,75.31Z"
        fill="var(--ph-duotone-primary, currentColor)"
      />
    </svg>
  );
});