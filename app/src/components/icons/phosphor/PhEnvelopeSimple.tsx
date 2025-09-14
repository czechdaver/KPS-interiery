import { component$ } from '@builder.io/qwik';

export interface PhEnvelopeSimpleProps {
  size?: string | number;
  style?: any;
  class?: string;
}

/**
 * PhEnvelopeSimple - Duotone Phosphor Icon
 *
 * Replacement for: <i class="ph-duotone ph-envelope-simple" style="font-size: 24px;"></i>
 * Usage: <PhEnvelopeSimple size={24} class="icon-duotone-reverse" />
 *
 * Supports:
 * - size prop (converts to font-size in style)
 * - style prop (merged with size)
 * - class prop for CSS class names
 * - CSS custom properties: --ph-duotone-primary, --ph-duotone-secondary
 */
export const PhEnvelopeSimple = component$<PhEnvelopeSimpleProps>(({
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
        d="M224,56l-96,88L32,56Z"
        fill="var(--ph-duotone-secondary, currentColor)"
        opacity="0.2"
      />
      {/* Primary path with full opacity */}
      <path
        d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"
        fill="var(--ph-duotone-primary, currentColor)"
      />
    </svg>
  );
});