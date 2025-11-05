import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 * Enhanced with comprehensive SEO and social media optimization for KPS Interiéry.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  // Default values for SEO
  const defaultTitle = "KPS Interiéry - Kvalitní nábytek na míru | Kuchyně, Skříně, Koupelny";
  const defaultDescription = "Specializujeme se na zakázkovou výrobu nábytku na míru. Kuchyně, vestavěné skříně, koupelnový a kancelářský nábytek. Kvalita, preciznost, spokojenost.";
  const siteUrl = "https://kps-interiery.cz";
  const ogImageUrl = `${siteUrl}/branding/kps-logo-social.jpg`;

  // Extract existing meta values or use defaults
  const currentTitle = head.title || defaultTitle;
  const currentDescription = head.meta?.find(m => m.name === 'description')?.content || defaultDescription;
  const ogTitle = head.meta?.find(m => m.property === 'og:title')?.content || currentTitle;
  const ogDescription = head.meta?.find(m => m.property === 'og:description')?.content || currentDescription;

  return (
    <>
      <title>{currentTitle}</title>

      {/* Basic SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content="KPS Interiéry" />
      <meta name="copyright" content="© 2024 KPS Interiéry" />
      <meta name="language" content="cs" />
      <meta httpEquiv="content-language" content="cs-CZ" />

      {/* Canonical and alternate language tags */}
      <link rel="canonical" href={loc.url.href} />
      <link rel="alternate" hreflang="cs" href={loc.url.href} />
      <link rel="alternate" hreflang="x-default" href={siteUrl} />

      {/* Additional favicon references for better browser support */}
      <link rel="shortcut icon" href={`${import.meta.env.BASE_URL}branding/fav.svg`} />

      {/* Apple Touch Icons for iPhone and iPad */}
      <link rel="apple-touch-icon" sizes="180x180" href="/branding/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/branding/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/branding/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/branding/apple-touch-icon-76x76.png" />

      {/* Standard PNG Favicons for broader browser support */}
      <link rel="icon" type="image/png" sizes="32x32" href="/branding/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/branding/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/branding/favicon-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/branding/favicon-512x512.png" />

      {/* Theme color for iOS Safari and Chrome */}
      <meta name="theme-color" content="#C88B4E" />
      <meta name="msapplication-TileColor" content="#C88B4E" />

      {/* Open Graph Tags */}
      <meta property="og:site_name" content="KPS Interiéry" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={loc.url.href} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:alt" content="KPS Interiéry - Kvalitní nábytek na míru" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:locale" content="cs_CZ" />
      <meta property="og:locale:alternate" content="sk_SK" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kps_interiery" />
      <meta name="twitter:creator" content="@kps_interiery" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content="KPS Interiéry - Kvalitní nábytek na míru" />

      {/* Geo-location meta tags for Czech Republic / Zlínský kraj */}
      <meta name="geo.region" content="CZ-72" />
      <meta name="geo.placename" content="Zlínský kraj" />
      <meta name="geo.position" content="49.2264;17.6661" />
      <meta name="ICBM" content="49.2264, 17.6661" />
      <meta name="DC.title" content={currentTitle} />
      <meta name="DC.subject" content="nábytek na míru, kuchyně, skříně, koupelny" />
      <meta name="DC.description" content={currentDescription} />
      <meta name="DC.language" content="cs" />
      <meta name="DC.coverage" content="Zlínský kraj, Česká republika" />

      {/* Additional Czech market optimization */}
      <meta name="location" content="Zlínský kraj, Česká republika" />
      <meta name="distribution" content="local" />
      <meta name="target" content="czech republic" />
      <meta name="audience" content="czech consumers" />

      {/* Schema.org structured data is now handled by dedicated components */}

      {/* Render dynamic meta tags from pages */}
      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
