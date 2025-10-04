import { component$ } from "@builder.io/qwik";

export const OrganizationSchema = component$(() => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://kpsinteriery.cz/#organization",
    "name": "KPS Interiéry",
    "legalName": "KPS Interiéry s.r.o.",
    "url": "https://kpsinteriery.cz",
    "logo": {
      "@type": "ImageObject",
      "url": "https://kpsinteriery.cz/logo.png",
      "width": 200,
      "height": 100
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+420774127133",
      "contactType": "customer service",
      "email": "info@kpsinteriery.cz",
      "availableLanguage": "Czech",
      "areaServed": "CZ"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Stará cesta 32",
      "addressLocality": "Zlín-Štípa",
      "addressRegion": "Zlínský kraj",
      "postalCode": "763 14",
      "addressCountry": "CZ"
    },
    "founder": {
      "@type": "Person",
      "name": "Petr Svoboda"
    },
    "foundingDate": "2015",
    "description": "Specializujeme se na zakázkovou výrobu nábytku na míru v České republice s důrazem na kvalitu, preciznost a spokojenost zákazníků.",
    "slogan": "Kvalita, preciznost, spokojenost",
    "knowsAbout": [
      "Furniture Manufacturing",
      "Custom Kitchen Design",
      "Interior Design",
      "Woodworking",
      "3D Visualization"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Czech Republic"
    },
    "serviceArea": [
      {
        "@type": "AdministrativeArea",
        "name": "Zlínský kraj"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Jihomoravský kraj"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Moravskoslezský kraj"
      }
    ],
    "industry": "Custom Furniture Manufacturing",
    "naics": "337110",
    "isicV4": "3100",
    "vatID": "CZ12345678",
    "taxID": "12345678",
    "duns": "123456789",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "8"
    },
    "award": [
      "Nejlepší nábytkář Zlínského kraje 2023",
      "Certifikát kvality ISO 9001"
    ],
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Česká asociace nábytkářů",
        "url": "https://www.can.cz"
      },
      {
        "@type": "Organization",
        "name": "Hospodářská komora České republiky"
      }
    ],
    "owns": [
      {
        "@type": "Product",
        "name": "CNC obráběcí stroje",
        "description": "Moderní CNC stroje pro přesnou výrobu nábytku"
      },
      {
        "@type": "Product",
        "name": "Výrobní hala",
        "description": "Moderně vybavená výrobní hala v Zlíně"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certification",
        "name": "ISO 9001:2015 Certificate",
        "description": "Certifikace systému managementu kvality"
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Bezplatná konzultace",
        "description": "Bezplatná konzultace a návrh řešení",
        "price": "0",
        "priceCurrency": "CZK"
      },
      {
        "@type": "Offer",
        "name": "3D vizualizace",
        "description": "Profesionální 3D vizualizace návrhu",
        "price": "0",
        "priceCurrency": "CZK"
      }
    ],
    "seeks": {
      "@type": "Demand",
      "name": "Kvalitní zákazníci",
      "description": "Hledáme zákazníky, kteří oceňují kvalitu a řemeslnou práci"
    },
    "diversityStaffingReport": {
      "@type": "Article",
      "name": "Diverzita na pracovišti",
      "description": "Podporujeme diverzitu a rovné příležitosti"
    },
    "ethicsPolicy": {
      "@type": "CreativeWork",
      "name": "Etický kodex",
      "description": "Náš přístup k etickému podnikání"
    },
    "correctionsPolicy": {
      "@type": "CreativeWork",
      "name": "Politika reklamací",
      "description": "Jak řešíme stížnosti a reklamace"
    },
    "publishingPrinciples": {
      "@type": "CreativeWork",
      "name": "Zásady komunikace",
      "description": "Naše zásady pro komunikaci se zákazníky"
    },
    "actionableFeedbackPolicy": {
      "@type": "CreativeWork",
      "name": "Politika zpětné vazby",
      "description": "Jak využíváme zpětnou vazbu zákazníků"
    },
    "unnamedSourcesPolicy": {
      "@type": "CreativeWork",
      "name": "Ochrana soukromí",
      "description": "Jak chráníme soukromí našich zákazníků"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={JSON.stringify(organizationData, null, 2)}
    />
  );
});