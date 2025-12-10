import { component$ } from '@builder.io/qwik';

export interface PhDoorOpenProps {
  size?: string | number;
  style?: any;
  class?: string;
}

/**
 * PhDoorOpen - Duotone Phosphor Icon
 *
 * Replacement for: <i class="ph-duotone ph-door-open" style="font-size: 24px;"></i>
 * Usage: <PhDoorOpen size={24} class="icon-duotone-reverse" />
 *
 * Supports:
 * - size prop (converts to font-size in style)
 * - style prop (merged with size)
 * - class prop for CSS class names
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 */
export const PhDoorOpen = component$<PhDoorOpenProps>(({
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
        d="M200,40V224H168V32h24A8,8,0,0,1,200,40Z"
        fill="var(--ph-duotone-secondary, currentColor)"
        opacity="0.2"
      />
      {/* Primary path with full opacity */}
      <path
        d="M232,216H208V40a16,16,0,0,0-16-16H64A16,16,0,0,0,48,40V216H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Zm-40,0H176V40h16ZM64,40h96V216H64Zm80,92a12,12,0,1,1-12-12A12,12,0,0,1,144,132Z"
        fill="var(--ph-duotone-primary, currentColor)"
      />
    </svg>
  );
});