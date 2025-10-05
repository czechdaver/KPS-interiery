import { component$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { LocalBusinessSchema } from "./components/LocalBusinessSchema";
import { OrganizationSchema } from "./components/OrganizationSchema";
import { FurnitureServiceSchema } from "./components/FurnitureServiceSchema";

import "./global.css";

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

        {/* Optimize font loading with preload and font-display: swap */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical fonts to prevent FOUT (Flash of Unstyled Text) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Cabin:wght@400;600&display=swap"
        />

        {/* Preload LCP (Largest Contentful Paint) image for faster hero section */}
        <link
          rel="preload"
          as="image"
          href="/images/galleries/kuchyn-bila-u-tvar/skrine-0201-web-2400w.avif"
          type="image/avif"
        />

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

        {/* hCaptcha Script - loaded with async and defer for better performance */}
        <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
        <script dangerouslySetInnerHTML={`
          window.onHCaptchaSuccess = function(token) {
            var input = document.querySelector('input[name="h-captcha-response"]');
            if (!input) {
              input = document.createElement('input');
              input.type = 'hidden';
              input.name = 'h-captcha-response';
              var form = document.querySelector('form');
              if (form) form.appendChild(input);
            }
            input.value = token;

            // Dispatch custom event for Qwik component
            window.dispatchEvent(new CustomEvent('hcaptcha-success', { detail: token }));
          };

          window.onHCaptchaExpired = function() {
            var input = document.querySelector('input[name="h-captcha-response"]');
            if (input) input.value = '';

            // Dispatch custom event for Qwik component
            window.dispatchEvent(new CustomEvent('hcaptcha-expired'));
          };
        `} />
      </head>
      <body lang="cs">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
