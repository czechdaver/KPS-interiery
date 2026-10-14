/**
 * Layout composer – deterministicky skládá fotky do editorialních řádků podle orientace.
 *
 * Typy řádků:
 *  - full     1× na šířku přes celou šířku okna (full-bleed)
 *  - inset    1× na šířku odsazená v gridu + popisek vedle (střídá stranu)
 *  - pair     2× na šířku vedle sebe
 *  - diptych  2× na výšku vedle sebe
 *  - trio     3× na výšku vedle sebe
 *  - duo      na šířku + na výšku (stejná výška, šířky dle poměru stran)
 *  - stack    1 velká na výšku + 2 na šířku nad sebou (zrcadlí se)
 *  - solo     osamocená na výšku (zúžená, s popiskem vedle)
 *
 * Pravidla jsou čistě funkcí pořadí orientací → stejný vstup = stejný layout (stabilní buildy).
 */
import type { Orientation } from './data';

export type RowKind = 'full' | 'inset' | 'pair' | 'diptych' | 'trio' | 'duo' | 'stack' | 'solo';

export interface Row<T> {
  kind: RowKind;
  items: T[];
  /** Zrcadlové provedení (strana popisku / velké fotky) */
  flip: boolean;
}

/** Rytmus pro sekvence fotek na šířku. */
const LANDSCAPE_RHYTHM: ('full' | 'pair' | 'inset')[] = ['full', 'pair', 'inset', 'pair'];

export function composeRows<T extends { orientation: Orientation }>(items: T[]): Row<T>[] {
  // čtverec se v řádcích chová jako "na šířku" (justified řádky zvládnou libovolný poměr)
  const o = (i: number): 'L' | 'P' | undefined => {
    const it = items[i];
    if (!it) return undefined;
    return it.orientation === 'portrait' ? 'P' : 'L';
  };
  const rows: Row<T>[] = [];
  let i = 0;
  let rhythm = 0;
  let mirror = false;
  const push = (kind: RowKind, count: number, order?: number[]) => {
    const slice = items.slice(i, i + count);
    rows.push({ kind, items: order ? order.map((k) => slice[k]) : slice, flip: mirror });
    if (kind !== 'full' && kind !== 'pair' && kind !== 'diptych' && kind !== 'trio') mirror = !mirror;
    i += count;
  };

  // stejný typ řádku dvakrát po sobě působí monotónně → pravidla se střídají
  const last = () => rows.at(-1)?.kind;

  while (i < items.length) {
    const a = o(i), b = o(i + 1), c = o(i + 2), d = o(i + 3);
    const remaining = items.length - i;

    if (a === 'P') {
      if (b === 'P') {
        // přesně tři portréty za sebou → trio, jinak dvojice
        if (c === 'P' && d !== 'P') push('trio', 3);
        else push('diptych', 2);
      } else if (b === 'L' && c === 'L' && last() !== 'stack') {
        push('stack', 3);
      } else if (b === 'L') {
        push('duo', 2);
      } else {
        push('solo', 1);
      }
      continue;
    }

    // a === 'L'
    if (b === 'L' && c === 'P' && d !== 'P' && last() !== 'stack') {
      // L L P → portrét jako velká fotka, krajiny vedle nad sebou (portrét vždy první v items)
      push('stack', 3, [2, 0, 1]);
      continue;
    }
    if (b === 'P' && c !== 'P' && last() !== 'duo') {
      push('duo', 2);
      continue;
    }
    if (b === 'L') {
      const kind = LANDSCAPE_RHYTHM[rhythm++ % LANDSCAPE_RHYTHM.length];
      // poslední tři krajiny: pair by nechal osamocenou → raději full + pair
      if (kind === 'pair' && remaining === 3 && rows.at(-1)?.kind !== 'full') push('full', 1);
      else if (kind === 'pair') push('pair', 2);
      else push(kind, 1);
      continue;
    }
    // osamocená krajina (za ní P P nebo konec)
    const kind = rows.at(-1)?.kind === 'full' ? 'inset' : 'full';
    push(kind, 1);
  }
  return rows;
}
