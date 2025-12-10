import { component$ } from '@builder.io/qwik';

export interface PhAddressBookTabsProps {
  size?: string | number;
  style?: any;
  class?: string;
}

/**
 * PhAddressBookTabs - Duotone Phosphor Icon
 *
 * Replacement for: <i class="ph-duotone ph-address-book-tabs" style="font-size: 24px;"></i>
 * Usage: <PhAddressBookTabs size={24} class="icon-duotone-reverse" />
 *
 * Supports:
 * - size prop (converts to font-size in style)
 * - style prop (merged with size)
 * - class prop for CSS class names
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 */
export const PhAddressBookTabs = component$<PhAddressBookTabsProps>(({
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
        d="M48,40a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8H184V40Zm64,104a24,24,0,1,1,24-24A24,24,0,0,1,112,144Z"
        fill="var(--ph-duotone-secondary, currentColor)"
        opacity="0.2"
      />
      {/* Primary path with full opacity */}
      <path
        d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm-16,72h16v48H192Zm16-16H192V48h16ZM48,48H176V208H48ZM208,208H192V168h16v40Zm-56.25-42a39.76,39.76,0,0,0-17.19-23.34,32,32,0,1,0-45.12,0A39.84,39.84,0,0,0,72.25,166a8,8,0,0,0,15.5,4c2.64-10.25,13.06-18,24.25-18s21.62,7.73,24.25,18a8,8,0,1,0,15.5-4ZM96,120a16,16,0,1,1,16,16A16,16,0,0,1,96,120Z"
        fill="var(--ph-duotone-primary, currentColor)"
      />
    </svg>
  );
});