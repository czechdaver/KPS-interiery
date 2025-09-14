import { component$ } from '@builder.io/qwik';
import {
  PhHeart,
  PhInstagramLogo,
  PhArrowLeft,
  PhImages,
  PhCalendar,
  PhMapPin,
  PhEye,
  PhCookingPot,
  PhCheckCircle,
  PhGear
} from './icons/phosphor';

/**
 * Demo component to test visual parity between font-based and component-based icons
 */
export const PhosphorIconsDemo = component$(() => {
  return (
    <div class="p-8 space-y-8">
      {/* Heart icon comparison */}
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Heart Icon Comparison</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-600 mb-2">Font-based (current)</span>
              <i class="ph-duotone ph-heart icon-duotone-reverse" style="font-size: 24px;"></i>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-600 mb-2">Component-based (new)</span>
              <PhHeart size={24} class="icon-duotone-reverse" />
            </div>
          </div>

          {/* Test different sizes */}
          <div class="space-y-2">
            <h4 class="text-sm font-medium">Size tests:</h4>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-xs">16px:</span>
                <i class="ph-duotone ph-heart" style="font-size: 16px;"></i>
                <PhHeart size={16} />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs">24px:</span>
                <i class="ph-duotone ph-heart" style="font-size: 24px;"></i>
                <PhHeart size={24} />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs">32px:</span>
                <i class="ph-duotone ph-heart" style="font-size: 32px;"></i>
                <PhHeart size={32} />
              </div>
            </div>
          </div>

          {/* Test CSS custom properties */}
          <div class="space-y-2">
            <h4 class="text-sm font-medium">Color tests:</h4>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-xs">Normal:</span>
                <i class="ph-duotone ph-heart icon-duotone" style="font-size: 24px;"></i>
                <PhHeart size={24} class="icon-duotone" />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs">Reverse:</span>
                <i class="ph-duotone ph-heart icon-duotone-reverse" style="font-size: 24px;"></i>
                <PhHeart size={24} class="icon-duotone-reverse" />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs">Accent:</span>
                <i class="ph-duotone ph-heart icon-duotone-accent" style="font-size: 24px;"></i>
                <PhHeart size={24} class="icon-duotone-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multiple icons comparison */}
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Multiple Icons Test</h2>
        <div class="grid grid-cols-2 gap-4">
          {[
            { name: 'Instagram Logo', fontIcon: 'ph-instagram-logo', Component: PhInstagramLogo },
            { name: 'Arrow Left', fontIcon: 'ph-arrow-left', Component: PhArrowLeft },
            { name: 'Images', fontIcon: 'ph-images', Component: PhImages },
            { name: 'Calendar', fontIcon: 'ph-calendar', Component: PhCalendar },
            { name: 'Map Pin', fontIcon: 'ph-map-pin', Component: PhMapPin },
            { name: 'Eye', fontIcon: 'ph-eye', Component: PhEye },
            { name: 'Cooking Pot', fontIcon: 'ph-cooking-pot', Component: PhCookingPot },
            { name: 'Gear', fontIcon: 'ph-gear', Component: PhGear }
          ].map(({ name, fontIcon, Component }) => (
            <div key={name} class="space-y-2">
              <h4 class="text-sm font-medium">{name}</h4>
              <div class="flex items-center gap-4">
                <div class="flex flex-col items-center">
                  <span class="text-xs text-gray-600 mb-1">Font</span>
                  <i class={`ph-duotone ${fontIcon}`} style="font-size: 24px;"></i>
                </div>
                <div class="flex flex-col items-center">
                  <span class="text-xs text-gray-600 mb-1">Component</span>
                  <Component size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Props testing */}
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Props Testing</h2>
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium mb-2">Custom style prop:</h4>
            <PhCheckCircle size={32} style={{ color: 'green' }} />
          </div>
          <div>
            <h4 class="text-sm font-medium mb-2">String size prop:</h4>
            <PhGear size="2rem" />
          </div>
          <div>
            <h4 class="text-sm font-medium mb-2">Class prop with CSS custom properties:</h4>
            <div style="--ph-duotone-primary: #3B82F6; --ph-duotone-secondary: #93C5FD;">
              <PhHeart size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});