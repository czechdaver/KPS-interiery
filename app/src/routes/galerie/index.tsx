import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { GalleriesPage } from '../../components/GalleriesPage';

export default component$(() => {
  return <GalleriesPage />;
});

export const head: DocumentHead = {
  title: "Galerie realizací - KPS Interiéry | Nábytek na míru",
  meta: [
    {
      name: "description",
      content: "Prohlédněte si kompletní galerii našich nejlepších projektů. Kuchyně, ložnice, koupelny, skříně a další nábytek na míru od KPS Interiéry. Více než 50 realizací ve Zlínském kraji.",
    },
    {
      name: "keywords",
      content: "galerie, realizace, nábytek na míru, kuchyně na míru, vestavěné skříně, koupelnový nábytek, KPS Interiéry, Zlínský kraj, portfolio, reference",
    },
    {
      name: "author",
      content: "KPS Interiéry",
    },
    {
      property: "og:title",
      content: "Galerie realizací - KPS Interiéry",
    },
    {
      property: "og:description",
      content: "Prohlédněte si kompletní galerie našich nejlepších projektů nábytku na míru. Více než 50 realizací kuchyní, ložnic, koupelen a skříní.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://kps-interiery.cz/galerie",
    },
    {
      property: "og:locale",
      content: "cs_CZ",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "geo.region",
      content: "CZ-72",
    },
  ],
  links: [
    {
      rel: "canonical",
      href: "https://kps-interiery.cz/galerie",
    }
  ]
};