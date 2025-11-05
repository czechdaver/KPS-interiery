import { component$, useStylesScoped$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
import { Navigation } from '~/components/Navigation';
import { Footer } from '~/components/Footer';
import { PhHouse, PhImages, PhEnvelopeSimple } from '~/components/icons';

export default component$(() => {
  useStylesScoped$(`
    .page-404 {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--white) 0%, var(--light-gray) 100%);
      display: flex;
      flex-direction: column;
    }

    .error-hero {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 50%, var(--secondary) 100%);
      color: var(--white);
      padding: 8rem 0 6rem;
      margin-top: 70px;
      position: relative;
      overflow: hidden;
    }

    .error-hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 80%;
      height: 200%;
      background: radial-gradient(circle, rgba(212, 163, 115, 0.2) 0%, transparent 70%);
      pointer-events: none;
    }

    .error-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .error-code {
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: clamp(6rem, 15vw, 12rem);
      line-height: 1;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--white) 0%, var(--secondary-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .error-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      margin-bottom: 1rem;
      color: var(--white);
    }

    .error-message {
      font-family: 'Cabin', sans-serif;
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.8;
      max-width: 600px;
      margin: 0 auto 2rem;
      opacity: 0.95;
    }

    .help-section {
      padding: 4rem 0;
      flex: 1;
    }

    .help-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: clamp(1.5rem, 3vw, 2rem);
      text-align: center;
      margin-bottom: 3rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .quick-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .link-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: var(--radius-lg);
      padding: 2.5rem 2rem;
      text-align: center;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .link-card:hover {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 1);
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .link-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%);
      border-radius: 50%;
      color: var(--white);
      transition: var(--transition);
    }

    .link-card:hover .link-icon {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 8px 24px rgba(200, 139, 78, 0.4);
    }

    .link-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 1.3rem;
      color: var(--primary);
      margin: 0;
    }

    .link-description {
      font-family: 'Cabin', sans-serif;
      font-size: 1rem;
      color: var(--gray);
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 768px) {
      .error-hero {
        padding: 6rem 0 4rem;
        margin-top: 60px;
      }

      .error-code {
        font-size: clamp(4rem, 20vw, 8rem);
      }

      .quick-links {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .help-section {
        padding: 3rem 0;
      }

      .link-card {
        padding: 2rem 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .error-hero {
        padding: 4rem 0 3rem;
      }

      .help-section {
        padding: 2rem 0;
      }
    }
  `);

  return (
    <div class="page-404">
      <Navigation />

      <section class="error-hero">
        <div class="container">
          <div class="error-content">
            <div class="error-code">404</div>
            <h1 class="error-title">Stránka nenalezena</h1>
            <p class="error-message">
              Omlouváme se, ale stránku, kterou hledáte, se nepodařilo najít.
              Možná byla přesunuta nebo smazána. Níže najdete užitečné odkazy,
              které vám pomohou najít, co hledáte.
            </p>
          </div>
        </div>
      </section>

      <section class="help-section">
        <div class="container">
          <h2 class="help-title">Kam byste chtěli jít?</h2>

          <div class="quick-links">
            <Link href="/" class="link-card">
              <div class="link-icon">
                <PhHouse size={32} />
              </div>
              <h3 class="link-title">Hlavní stránka</h3>
              <p class="link-description">
                Návrat na úvodní stránku s přehledem našich služeb
              </p>
            </Link>

            <Link href="/galerie/" class="link-card">
              <div class="link-icon">
                <PhImages size={32} />
              </div>
              <h3 class="link-title">Galerie realizací</h3>
              <p class="link-description">
                Prohlédněte si naše hotové projekty nábytku na míru
              </p>
            </Link>

            <Link href="/#kontakt" class="link-card">
              <div class="link-icon">
                <PhEnvelopeSimple size={32} />
              </div>
              <h3 class="link-title">Kontakt</h3>
              <p class="link-description">
                Máte dotaz? Rádi vám pomůžeme s vaším projektem
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export const head: DocumentHead = {
  title: '404 - Stránka nenalezena | KPS Interiéry',
  meta: [
    {
      name: 'description',
      content: 'Požadovaná stránka nebyla nalezena. Navštivte naši hlavní stránku nebo prohlédněte galerii realizací nábytku na míru.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    },
    {
      property: 'og:title',
      content: '404 - Stránka nenalezena | KPS Interiéry'
    },
    {
      property: 'og:description',
      content: 'Požadovaná stránka nebyla nalezena.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
};
