import { component$ } from '@builder.io/qwik';

export interface PhClockProps {
  size?: string | number;
  style?: any;
  class?: string;
}

/**
 * PhClock - Duotone Phosphor Icon
 *
 * Replacement for: <i class="ph-duotone ph-clock" style="font-size: 24px;"></i>
 * Usage: <PhClock size={24} class="icon-duotone-reverse" />
 *
 * Supports:
 * - size prop (converts to font-size in style)
 * - style prop (merged with size)
 * - class prop for CSS class names
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 */
export const PhClock = component$<PhClockProps>(({
  size,
  style,
  class: className,
  ...props
}) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : (size || '1em');

  const mergedStyle = {
    fontSize: sizeValue,
    ...style
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      style={mergedStyle}
      class={className}
      {...props}
    >
      {/* Secondary/background path with lower opacity */}
      <path
        d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
        fill="var(--ph-duotone-secondary, currentColor)"
        opacity="0.2"
      />
      {/* Primary path with full opacity */}
      <path
        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"
        fill="var(--ph-duotone-primary, currentColor)"
      />
    </svg>
  );
});