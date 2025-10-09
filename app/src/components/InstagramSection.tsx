import { component$, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import { PhInstagramLogo } from "~/components/icons";

const styles = `
  .instagram-section {
    background: linear-gradient(135deg, var(--primary) 0%, var(--dark-gray) 100%);
    color: var(--white);
    border-top: 1px solid rgba(200, 139, 78, 0.2);
    border-bottom: 1px solid rgba(200, 139, 78, 0.2);
  }

  .instagram-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .instagram-header .section-description {
    color: rgba(255, 255, 255, 0.8);
  }

  /* Fouita Widget Container */
  .instagram-feed-wrapper {
    margin-bottom: 3rem;
    width: 100%;
  }

  /* Style Fouita widget to match brand */
  #ft-insta-app {
    background: transparent !important;
    padding: 0;
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  /* Override Fouita's default styles for dark background */
  #ft-insta-app * {
    color: var(--white) !important;
  }

  /* Style individual post cards if Fouita exposes them */
  #ft-insta-app [class*="card"],
  #ft-insta-app [class*="item"],
  #ft-insta-app [class*="post"] {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: var(--radius-md) !important;
    transition: var(--transition);
  }

  #ft-insta-app [class*="card"]:hover,
  #ft-insta-app [class*="item"]:hover,
  #ft-insta-app [class*="post"]:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    border: 1px solid rgba(200, 139, 78, 0.3) !important;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  /* Style images */
  #ft-insta-app img {
    border-radius: var(--radius-md);
  }

  /* Attribution footer styling */
  #ft-insta-brd {
    text-align: center;
    padding: 1.5rem 0 0.5rem;
    margin-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.875rem;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  #ft-insta-brd:hover {
    opacity: 0.8;
  }

  #ft-insta-brd a {
    color: var(--secondary-light);
    text-decoration: none;
    margin: 0 0.5rem;
    transition: var(--transition);
  }

  #ft-insta-brd a:hover {
    color: var(--secondary);
    text-decoration: underline;
  }

  .instagram-cta {
    text-align: center;
  }

  .instagram-cta .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.5rem;
    width: auto;
  }

  @media (max-width: 768px) {
    .instagram-header {
      margin-bottom: 2rem;
    }

    .instagram-feed-wrapper {
      margin-bottom: 2rem;
    }

    #ft-insta-brd {
      font-size: 0.8rem;
      padding: 1rem 0 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .instagram-header {
      margin-bottom: 1.5rem;
    }

    #ft-insta-brd {
      font-size: 0.75rem;
    }

    #ft-insta-brd a {
      display: block;
      margin: 0.25rem 0;
    }
  }
`;

export const InstagramSection = component$(() => {
  useStylesScoped$(styles);

  // Initialize Fouita widget when component mounts (SPA-compatible)
  useVisibleTask$(() => {
    const target = document.getElementById("ft-insta-app");

    if (!target) {
      console.warn("Fouita: Instagram feed container not ready");
      return;
    }

    // Prevent duplicate initialization
    if (target.hasAttribute('data-fouita-initialized')) {
      console.log("Fouita: Already initialized, skipping");
      return;
    }

    // Dynamically import and initialize Fouita widget
    // @ts-expect-error - External CDN module without TypeScript definitions
    import("https://cdn.fouita.com/public/instagram-feed.js?11")
      .then((module) => {
        const App = module.default;

        new App({
          target: target,
          props: {
            settings: {
              layout: "masonry",
              source: "insta",
              selected: "uname",
              header: true,
              autoplay: true,
              zigzag: false,
              cols: 4,
              cardHeight: 300,
              gap: 12,
              direction: "down",
              height: "auto",
              bgColor: "transparent",
              txtColor: "#FFFFFF",
              ukey: "209ecfca-44b8-4203-8dec-8b3d1c772d67",
              headerWidth: null
            }
          }
        });

        // Mark as initialized to prevent duplicates
        target.setAttribute('data-fouita-initialized', 'true');
        console.log("Fouita: Instagram widget initialized successfully");
      })
      .catch((err) => {
        console.error("Fouita: Failed to load Instagram widget:", err);
      });
  });

  return (
    <section class="instagram-section section">
      <div class="container">
        <div class="instagram-header">
          <h2 class="section-title-bright">Sledujte nás na Instagramu</h2>
          <p class="section-description">
            Nejnovější realizace a zákulisí naší práce najdete na našem Instagram profilu
          </p>
        </div>

        <div class="instagram-feed-wrapper">
          {/* Fouita Instagram Feed Widget */}
          <div id="ft-insta-app"></div>
          <div id="ft-insta-brd">
            <a href="https://fouita.com/website-widgets/instagram-feed" target="_blank" rel="noopener noreferrer">
              Embed Instagram Feed
            </a>
            <a href="https://fouita.com" target="_blank" rel="noopener noreferrer">
              with Fouita
            </a>
          </div>
        </div>

        <div class="instagram-cta">
          <a
            href="https://instagram.com/kpsinteriery"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-accent"
          >
            <PhInstagramLogo size={24} />
            Sledovat na Instagramu
          </a>
        </div>
      </div>
    </section>
  );
});