import { component$ } from "@builder.io/qwik";

export const FurnitureServiceSchema = component$(() => {
  const servicesData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://kpsinteriery.cz/#service-kitchen",
      "name": "Kuchyně na míru",
      "description": "Zakázková výroba kuchyní přizpůsobených vašim potřebám a prostoru. Moderní i klasické styly, kvalitní materiály a profesionální montáž.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "KPS Interiéry",
        "@id": "https://kpsinteriery.cz/#business"
      },
      "areaServed": "Czech Republic",
      "serviceType": "Custom Kitchen Furniture",
      "category": "Furniture Manufacturing",
      "audience": {
        "@type": "Audience",
        "audienceType": "Homeowners, Architects, Interior Designers"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Kuchyňské služby",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Moderní kuchyň",
              "description": "Kuchyně v současném designu s čistými liniemi"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Klasická kuchyň",
              "description": "Tradiční kuchyně s důrazem na kvalitní řemeslnou práci"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Kuchyňský ostrůvek",
              "description": "Funkční kuchyňské ostrůvky na míru"
            }
          }
        ]
      },
      "offers": {
        "@type": "Offer",
        "priceRange": "80000-300000 CZK",
        "priceCurrency": "CZK",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01",
        "validThrough": "2024-12-31",
        "includesObject": [
          "3D návrh",
          "Vizualizace",
          "Montáž",
          "Servis"
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://kpsinteriery.cz/#service-wardrobe",
      "name": "Vestavěné skříně",
      "description": "Výroba vestavěných skříní a šatních skříní optimálně využívajících prostor. Různé materiály, barvy a vnitřní vybavení.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "KPS Interiéry",
        "@id": "https://kpsinteriery.cz/#business"
      },
      "areaServed": "Czech Republic",
      "serviceType": "Custom Wardrobe Furniture",
      "category": "Furniture Manufacturing",
      "audience": {
        "@type": "Audience",
        "audienceType": "Homeowners, Property Developers"
      },
      "offers": {
        "@type": "Offer",
        "priceRange": "20000-150000 CZK",
        "priceCurrency": "CZK",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://kpsinteriery.cz/#service-bathroom",
      "name": "Koupelnový nábytek",
      "description": "Nábytek do koupelny odolný vlhkosti, funkční a estetický. Skříňky pod umyvadlo, vysoké skříně a další prvky.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "KPS Interiéry",
        "@id": "https://kpsinteriery.cz/#business"
      },
      "areaServed": "Czech Republic",
      "serviceType": "Custom Bathroom Furniture",
      "category": "Furniture Manufacturing",
      "audience": {
        "@type": "Audience",
        "audienceType": "Homeowners, Hotels, Architects"
      },
      "offers": {
        "@type": "Offer",
        "priceRange": "30000-100000 CZK",
        "priceCurrency": "CZK",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://kpsinteriery.cz/#service-office",
      "name": "Kancelářský nábytek",
      "description": "Funkční a reprezentativní nábytek pro kanceláře, pracovny a obchodní prostory. Stoly, skříně, recepce a další.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "KPS Interiéry",
        "@id": "https://kpsinteriery.cz/#business"
      },
      "areaServed": "Czech Republic",
      "serviceType": "Custom Office Furniture",
      "category": "Furniture Manufacturing",
      "audience": {
        "@type": "Audience",
        "audienceType": "Businesses, Offices, Coworking Spaces"
      },
      "offers": {
        "@type": "Offer",
        "priceRange": "40000-200000 CZK",
        "priceCurrency": "CZK",
        "availability": "https://schema.org/InStock"
      }
    }
  ];

  return (
    <>
      {servicesData.map((service, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={JSON.stringify(service, null, 2)}
        />
      ))}
    </>
  );
});