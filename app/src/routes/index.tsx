import { component$, useSignal, useVisibleTask$, useStylesScoped$ } from '@builder.io/qwik';
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

const styles = `
  .home-content {
    margin-top: -80px;
  }

  @media (max-width: 768px) {
    .home-content {
      margin-top: -70px;
    }
  }
`;

export default component$(() => {
  useStylesScoped$(styles);
  const currentPage = useSignal('home');

  useVisibleTask$(() => {
    const updateCurrentPage = () => {
      const hash = window.location.hash;

      // Handle backward compatibility - redirect old hash URLs to new SEO URLs
      if (hash === '#galerie') {
        // Redirect to new gallery URL structure
        window.history.replaceState(null, '', '/galerie');
        currentPage.value = 'galleries';
        return;
      }

      // Handle other hash-based navigation for backward compatibility
      if (hash && hash.startsWith('#galerie-')) {
        // This would be for future specific gallery hash redirects
        // For now, redirect to main gallery page
        window.history.replaceState(null, '', '/galerie');
        currentPage.value = 'galleries';
        return;
      }

      // Check if we're on a gallery route via URL path
      if (window.location.pathname.startsWith('/galerie')) {
        currentPage.value = 'galleries';
      } else {
        currentPage.value = 'home';
      }
    };

    updateCurrentPage();
    window.addEventListener('hashchange', updateCurrentPage);
    window.addEventListener('popstate', updateCurrentPage);

    return () => {
      window.removeEventListener('hashchange', updateCurrentPage);
      window.removeEventListener('popstate', updateCurrentPage);
    };
  });

  return (
    <>
      {currentPage.value === 'galleries' ? (
        <GalleriesPage />
      ) : (
        <div id="uvod">
          <Navigation />
          <HeroSection />
          <div class="section-after-nav home-content">
            <ValuesSection />
            <ServicesSection />
            <PortfolioSection />
            <PartnersSection />
            <InstagramSection />
            <ContactSection />
            <Footer />
          </div>
        </div>
      )}
      <CookieBar />
    </>
  );
});

export const head: DocumentHead = {
  title: "KPS Interiéry - Kvalitní nábytek na míru | Kuchyně, Skříně, Koupelny | Zlínský kraj",
  meta: [
    {
      name: "description",
      content: "Specializujeme se na zakázkovou výrobu nábytku na míru ve Zlínském kraji. Kuchyně, vestavěné skříně, koupelnový a kancelářský nábytek. 20+ let zkušeností. Kvalita, preciznost, spokojenost zákazníků.",
    },
    {
      name: "keywords",
      content: "nábytek na míru, kuchyně na míru, vestavěné skříně, koupelnový nábytek, kancelářský nábytek, KPS Interiéry, Zlínský kraj, Morava, zakázková výroba nábytku, truhlářství, interiérový design, moderní kuchyně, atypické řešení, kvalitní nábytek",
    },
    {
      name: "author",
      content: "KPS Interiéry",
    },
    {
      property: "og:title",
      content: "KPS Interiéry - Kvalitní nábytek na míru | Zlínský kraj",
    },
    {
      property: "og:description",
      content: "Vytváříme nábytek na míru, který předčí vaše očekávání. Více než 20 let zkušeností ve Zlínském kraji. Kvalita, preciznost a spokojenost zákazníků jsou naše hlavní hodnoty.",
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
    {
      name: "format-detection",
      content: "telephone=yes",
    },
  ],
};