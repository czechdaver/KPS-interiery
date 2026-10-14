import { getEntry, getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function getSettings() {
  const s = await getEntry('settings', 'site');
  if (!s) throw new Error('Chybí src/content/settings/site.json');
  return s.data;
}

export const CATEGORIES = [
  { name: 'Kuchyně', slug: 'kuchyne' },
  { name: 'Skříně', slug: 'skrine' },
  { name: 'Ložnice', slug: 'loznice' },
  { name: 'Koupelny', slug: 'koupelny' },
  { name: 'Ostatní', slug: 'ostatni' },
] as const;

export const categorySlug = (name: string) => CATEGORIES.find((c) => c.name === name)?.slug ?? 'ostatni';

/** Projekty seřazené: order ↑, pak datum ↓. */
export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order || b.data.date.localeCompare(a.data.date));
}

const MONTHS = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
export const formatMonth = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

export const NAV = [
  { href: '/realizace/', label: 'Realizace' },
  { href: '/sluzby/', label: 'Služby' },
  { href: '/o-nas/', label: 'O nás' },
  { href: '/kontakt/', label: 'Kontakt' },
] as const;

export const telHref = (phone: string) => `tel:${phone.replace(/\s+/g, '')}`;
