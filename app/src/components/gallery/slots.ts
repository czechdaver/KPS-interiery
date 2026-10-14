/**
 * Sloty pro asymetrický layout "featured" karet (sdílí server i klient – po filtrování se přepočítají).
 * Páry: [široká vlevo + úzká vpravo], [úzká vlevo + široká vpravo], …; lichá poslední karta = přes celou šířku.
 */
export type FeaturedSlot = 'wl' | 'nr' | 'nl' | 'wr' | 'full';

export function featuredSlot(k: number, n: number): FeaturedSlot {
  const first = k % 2 === 0;
  if (first && k === n - 1) return 'full';
  const mirrored = Math.floor(k / 2) % 2 === 1;
  if (first) return mirrored ? 'nl' : 'wl';
  return mirrored ? 'wr' : 'nr';
}
