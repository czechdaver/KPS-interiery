import { component$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { LocalBusinessSchema } from "./components/LocalBusinessSchema";
import { OrganizationSchema } from "./components/OrganizationSchema";
import { FurnitureServiceSchema } from "./components/FurnitureServiceSchema";

import "./global.css";

// Self-hosted fonts via Fontsource - optimized subsets (latin + latin-ext for Czech)
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-ext-600.css";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/montserrat/latin-ext-800.css";
import "@fontsource/cabin/latin-400.css";
import "@fontsource/cabin/latin-ext-400.css";
import "@fontsource/cabin/latin-600.css";
import "@fontsource/cabin/latin-ext-600.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Resource hints for performance optimization */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://web3forms.com" />
        <link rel="dns-prefetch" href="https://js.hcaptcha.com" />

        {/* Preload Swiper for hero section - critical for LCP */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
          media="print"
        />
        <script dangerouslySetInnerHTML={`
          (function() {
            var swiperLink = document.querySelector('link[href*="swiper-bundle"]');
            if (swiperLink) swiperLink.media = 'all';
          })();
        `} />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/branding/fav.svg" />

        <RouterHead />
        <LocalBusinessSchema />
        <OrganizationSchema />
        <FurnitureServiceSchema />

        {/* Check cookie consent before hydration to prevent flash */}
        <script dangerouslySetInnerHTML={`
          (function() {
            try {
              var consent = localStorage.getItem('cookie-consent');
              if (consent) {
                document.documentElement.setAttribute('data-cookie-consent', 'true');
              }
            } catch (e) {
              // localStorage not available
            }
          })();
        `} />

        {/* Web3Forms Client Script - lazy loaded when contact section is visible */}
        <script dangerouslySetInnerHTML={`
          (function() {
            var loaded = false;

            function loadWeb3Forms() {
              if (loaded) return;
              loaded = true;

              var script = document.createElement('script');
              script.src = 'https://web3forms.com/client/script.js';
              script.async = true;
              script.defer = true;
              document.head.appendChild(script);
            }

            // Load when contact section is near viewport
            function initObserver() {
              var contactSection = document.getElementById('kontakt');
              if (!contactSection) {
                // Retry after a delay if section not found
                setTimeout(initObserver, 1000);
                return;
              }

              var observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                  loadWeb3Forms();
                  observer.disconnect();
                }
              }, { rootMargin: '400px' });

              observer.observe(contactSection);
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initObserver);
            } else {
              initObserver();
            }
          })();
        `} />

        {/* Google Analytics - deferred for better performance */}
        <script dangerouslySetInnerHTML={`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          // Defer GA loading until page is interactive (3s after load)
          function loadGA() {
            var script = document.createElement('script');
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-0FH0FWZW41';
            script.async = true;
            document.head.appendChild(script);

            script.onload = function() {
              gtag('js', new Date());
              gtag('config', 'G-0FH0FWZW41');
            };
          }

          if (document.readyState === 'complete') {
            setTimeout(loadGA, 3000);
          } else {
            window.addEventListener('load', function() {
              setTimeout(loadGA, 3000);
            });
          }
        `} />
      </head>
      <body lang="cs">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
