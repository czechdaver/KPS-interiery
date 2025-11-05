import { component$ } from '@builder.io/qwik';

export interface PhHouseProps {
  size?: string | number;
  style?: any;
  class?: string;
}

/**
 * PhHouse - Duotone Phosphor Icon
 *
 * House/Home icon for navigation
 * Usage: <PhHouse size={24} class="icon-duotone" />
 *
 * Supports:
 * - size prop (converts to width/height attributes)
 * - style prop (additional styles)
 * - class prop for CSS class names
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 */
export const PhHouse = component$<PhHouseProps>(({
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
        d="M216,115.54V208a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.54a8,8,0,0,1,2.62-5.92l80-75.54a8,8,0,0,1,10.77,0l80,75.54A8,8,0,0,1,216,115.54Z"
        fill="var(--ph-duotone-secondary, currentColor)"
        opacity="0.2"
      />
      {/* Primary path with full opacity */}
      <path
        d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v88a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V120l80-80,80,80Z"
        fill="var(--ph-duotone-primary, currentColor)"
      />
    </svg>
  );
});
