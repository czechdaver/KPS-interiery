import { component$ } from '@builder.io/qwik';

export interface PhCookingPotProps {
  size?: string | number;
  style?: any;
  class?: string;
}

/**
 * PhCookingPot - Duotone Phosphor Icon
 *
 * Replacement for: <i class="ph-duotone ph-cooking-pot" style="font-size: 24px;"></i>
 * Usage: <PhCookingPot size={24} class="icon-duotone-reverse" />
 *
 * Supports:
 * - size prop (converts to width/height attributes)
 * - style prop (additional styles)
 * - class prop for CSS class names
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 */
export const PhCookingPot = component$<PhCookingPotProps>(({
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
        d="M216,80V184a24,24,0,0,1-24,24H64a24,24,0,0,1-24-24V80Z"
        fill="var(--ph-duotone-secondary, currentColor)"
        opacity="0.2"
      />
      {/* Primary path with full opacity */}
      <path
        d="M88,48V16a8,8,0,0,1,16,0V48a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,128,56Zm32,0a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,160,56Zm92.8,46.4L224,124v60a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V124L3.2,102.4a8,8,0,0,1,9.6-12.8L32,104V80a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8v24l19.2-14.4a8,8,0,0,1,9.6,12.8ZM208,88H48v96a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16Z"
        fill="var(--ph-duotone-primary, currentColor)"
      />
    </svg>
  );
});