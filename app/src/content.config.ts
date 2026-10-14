import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/** Realizace (projekty). Každá složka = jedna galerie: index.json + fotky vedle něj. */
const projects = defineCollection({
  loader: glob({ pattern: '*/index.json', base: './src/content/projects', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['Kuchyně', 'Skříně', 'Ložnice', 'Koupelny', 'Ostatní']),
      location: z.string().default(''),
      date: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
      featured: z.boolean().default(false),
      order: z.number().default(100),
      description: z.string(),
      cover: image(),
      features: z.array(z.string()).default([]),
      materials: z.array(z.string()).default([]),
      seoText: z.string().default(''),
      images: z.array(z.object({ src: image(), alt: z.string(), caption: z.string().default('') })).min(1),
    }),
});

/** Služby – markdown s frontmatterem. */
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    icon: z.string(), // iconify name, např. "ph:cooking-pot-light"
    order: z.number().default(100),
    category: z.string().optional(), // napojení na kategorii realizací
    projects: z.array(reference('projects')).default([]),
  }),
});

/** Partneři / dodavatelé. */
const partners = defineCollection({
  // Root je objekt { "partners": [...] } (kvůli Sveltia CMS) → převedeme na mapu id → položka.
  loader: file('./src/content/partners/partners.json', {
    parser: (text) => Object.fromEntries((JSON.parse(text).partners as { id: string }[]).map((p) => [p.id, p])),
  }),
  schema: ({ image }) => z.object({ name: z.string(), logo: image(), url: z.url().optional(), group: z.enum(['kování', 'materiály', 'dřezy a baterie', 'ostatní']).default('ostatní') }),
});

/** Globální nastavení webu (kontakty, hero, texty) – jeden JSON soubor. */
const settings = defineCollection({
  // Root je plain objekt (kvůli Sveltia CMS) → jediná položka s id "site".
  loader: file('./src/content/settings/site.json', { parser: (text) => ({ site: JSON.parse(text) }) }),
  schema: z.object({
    company: z.string(),
    ico: z.string(),
    phone: z.string(),
    email: z.email(),
    street: z.string(),
    city: z.string(),
    zip: z.string(),
    region: z.string(),
    mapsUrl: z.url(),
    openingHours: z.array(z.object({ days: z.string(), hours: z.string() })),
    serviceArea: z.array(z.string()),
    social: z.object({ instagram: z.url(), facebook: z.url() }),
    web3formsKey: z.string(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
    heroProjects: z.array(reference('projects')),
  }),
});

export const collections = { projects, services, partners, settings };
