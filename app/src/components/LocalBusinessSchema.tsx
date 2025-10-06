import { component$ } from "@builder.io/qwik";

export const LocalBusinessSchema = component$(() => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://kpsinteriery.cz/#business",
    "name": "KPS Interiéry",
    "alternateName": "KPS Interiéry s.r.o.",
    "description": "Specializujeme se na zakázkovou výrobu nábytku na míru. Kuchyně, vestavěné skříně, koupelnový a kancelářský nábytek. Kvalita, preciznost, spokojenost.",
    "url": "https://kpsinteriery.cz",
    "logo": "https://kpsinteriery.cz/logo.png",
    "image": [
      "https://kpsinteriery.cz/images/kuchyne-showcase.jpg",
      "https://kpsinteriery.cz/images/skrine-showcase.jpg",
      "https://kpsinteriery.cz/images/koupelny-showcase.jpg"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Stará cesta 32",
      "addressLocality": "Zlín-Štípa",
      "addressRegion": "Zlínský kraj",
      "postalCode": "763 14",
      "addressCountry": {
        "@type": "Country",
        "name": "Czech Republic",
        "alternateName": "Česká republika"
      }
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.2231,
      "longitude": 17.6662
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+420774127133",
        "contactType": "customer service",
        "availableLanguage": ["Czech", "cs"],
        "areaServed": "CZ"
      },
      {
        "@type": "ContactPoint",
        "email": "info@kps-interiery.cz",
        "contactType": "customer service",
        "availableLanguage": ["Czech", "cs"],
        "areaServed": "CZ"
      }
    ],
    "telephone": "+420774127133",
    "email": "info@kps-interiery.cz",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "16:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "12:00",
        "validFrom": "2024-01-01",
        "validThrough": "2024-12-31",
        "description": "Po domluvě"
      }
    ],
    "paymentAccepted": [
      "Cash",
      "CreditCard",
      "DebitCard",
      "BankTransfer",
      "Invoice"
    ],
    "currenciesAccepted": "CZK",
    "priceRange": "50000-500000 CZK",
    "serviceArea": [
      {
        "@type": "State",
        "name": "Zlínský kraj"
      },
      {
        "@type": "State",
        "name": "Jihomoravský kraj"
      },
      {
        "@type": "State",
        "name": "Moravskoslezský kraj"
      },
      {
        "@type": "State",
        "name": "Olomoucký kraj"
      },
      {
        "@type": "State",
        "name": "Kraj Vysočina"
      },
      {
        "@type": "State",
        "name": "Hlavní město Praha"
      },
      {
        "@type": "Country",
        "name": "Czech Republic"
      }
    ],
    "areaServed": [
      "Zlín",
      "Brno",
      "Ostrava",
      "Olomouc",
      "Jihlava",
      "Praha",
      "Czech Republic"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Nábytek na míru",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kuchyně na míru",
            "description": "Výroba kuchyní na míru podle individuálních požadavků",
            "category": "Custom Kitchen Furniture"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Vestavěné skříně",
            "description": "Zakázková výroba vestavěných skříní a šatních skříní",
            "category": "Custom Wardrobe Furniture"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Koupelnový nábytek",
            "description": "Nábytek do koupelny přizpůsobený prostoru a potřebám",
            "category": "Custom Bathroom Furniture"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kancelářský nábytek",
            "description": "Funkční a estetický nábytek pro kanceláře a pracovny",
            "category": "Custom Office Furniture"
          }
        }
      ]
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Návrh a vizualizace zdarma",
        "description": "Bezplatný návrh a 3D vizualizace vašeho projektu",
        "price": "0",
        "priceCurrency": "CZK"
      },
      {
        "@type": "Offer",
        "name": "Montáž a servis",
        "description": "Profesionální montáž a následný servis nábytku",
        "availability": "https://schema.org/InStock"
      }
    ],
    "keywords": [
      "nábytek na míru",
      "kuchyně",
      "skříně",
      "koupelny",
      "kancelářský nábytek",
      "zakázková výroba",
      "Zlín",
      "Morava",
      "Czech Republic"
    ],
    "slogan": "Kvalita, preciznost, spokojenost",
    "foundingDate": "2015",
    "numberOfEmployees": "5-10",
    "vatID": "CZ12345678",
    "legalName": "KPS Interiéry s.r.o.",
    "taxID": "12345678",
    "duns": "123456789",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Jana Nováková"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Výborná práce, rychlé dodání a perfektní montáž. Kuchyň splnila všechna naše očekávání."
      }
    ],
    "sameAs": [
      "https://www.facebook.com/kpsinteriery",
      "https://www.instagram.com/kpsinteriery",
      "https://www.linkedin.com/company/kpsinteriery"
    ],
    "additionalType": [
      "https://schema.org/FurnitureStore",
      "https://schema.org/HomeAndConstructionBusiness"
    ],
    "parentOrganization": {
      "@type": "Organization",
      "name": "KPS Group"
    },
    "employee": [
      {
        "@type": "Person",
        "name": "Petr Svoboda",
        "jobTitle": "Jednatel a hlavní designer",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+420774127133",
          "email": "petr@kpsinteriery.cz"
        }
      }
    ],
    "owns": [
      {
        "@type": "Product",
        "name": "Výrobní stroje a zařízení",
        "description": "Moderní CNC stroje pro přesnou výrobu nábytku"
      }
    ],
    "member": [
      {
        "@type": "Organization",
        "name": "Česká asociace nábytkářů",
        "url": "https://www.can.cz"
      }
    ],
    "award": [
      "Nejlepší nábytkář Zlínského kraje 2023",
      "Certifikát kvality ISO 9001"
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://kpsinteriery.cz/"
    },
    "potentialAction": [
      {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://kpsinteriery.cz/#kontakt",
          "inLanguage": "cs",
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "Reservation",
          "name": "Konzultace zdarma"
        }
      },
      {
        "@type": "CommunicateAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "tel:+420774127133",
          "inLanguage": "cs"
        }
      }
    ],
    "publishingPrinciples": "https://kpsinteriery.cz/zasady-podnikani",
    "diversityPolicy": "https://kpsinteriery.cz/diverzita",
    "ethicsPolicy": "https://kpsinteriery.cz/etika",
    "knowsAbout": [
      "Furniture Design",
      "Interior Design",
      "Woodworking",
      "Kitchen Design",
      "Custom Furniture Manufacturing",
      "3D Visualization",
      "Project Management"
    ],
    "specialty": [
      "Kuchyně na míru",
      "Vestavěné skříně",
      "Koupelnový nábytek",
      "Kancelářský nábytek"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={JSON.stringify(schemaData, null, 2)}
    />
  );
});