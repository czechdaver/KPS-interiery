import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Navigation } from "../components/Navigation";
import { HeroSection } from "../components/HeroSection";
import { ValuesSection } from "../components/ValuesSection";
import { ServicesSection } from "../components/ServicesSection";
import { PortfolioSection } from "../components/PortfolioSection";
import { PartnersSection } from "../components/PartnersSection";
import { InstagramSection } from "../components/InstagramSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { GalleriesPage } from "../components/GalleriesPage";
import { CookieBar } from "../components/CookieBar";

export default component$(() => {
  const currentPage = useSignal('home');

  useVisibleTask$(() => {
    const updateCurrentPage = () => {
      const hash = window.location.hash;
      if (hash === '#galerie') {
        currentPage.value = 'galleries';
      } else {
        currentPage.value = 'home';
      }
    };

    updateCurrentPage();
    window.addEventListener('hashchange', updateCurrentPage);
    
    return () => {
      window.removeEventListener('hashchange', updateCurrentPage);
    };
  });

  return (
    <>
      {currentPage.value === 'galleries' ? (
        <GalleriesPage />
      ) : (
        <div id="home">
          <Navigation />
          <HeroSection />
          <ValuesSection />
          <ServicesSection />
          <PortfolioSection />
          <PartnersSection />
          <InstagramSection />
          <ContactSection />
          <Footer />
        </div>
      )}
      <CookieBar />
    </>
  );
});

export const head: DocumentHead = {
  title: "KPS Interiéry - Kvalitní nábytek na míru | Kuchyně, Skříně, Koupelny",
  meta: [
    {
      name: "description",
      content: "Specializujeme se na zakázkovou výrobu nábytku na míru. Kuchyně, vestavěné skříně, koupelnový a kancelářský nábytek. Kvalita, preciznost, spokojenost.",
    },
    {
      name: "keywords",
      content: "nábytek na míru, kuchyně, skříně, koupelny, kancelářský nábytek, KPS Interiéry, Morava, Zlín, zakázková výroba",
    },
    {
      name: "author",
      content: "KPS Interiéry",
    },
    {
      property: "og:title",
      content: "KPS Interiéry - Kvalitní nábytek na míru",
    },
    {
      property: "og:description",
      content: "Vytváříme nábytek na míru, který předčí vaše očekávání. Kvalita, preciznost a spokojenost zákazníků jsou naše hlavní hodnoty.",
    },
    {
      property: "og:type",
      content: "website",
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
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  ],
};