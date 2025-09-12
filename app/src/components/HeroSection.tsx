import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { HeroSwiper } from "./HeroSwiper";

export const HeroSection = component$(() => {
  useStylesScoped$(`
        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(50, 38, 36, 0.5) 0%,
            rgba(35, 25, 23, 0.45) 50%,
            rgba(200, 139, 78, 0.25) 100%
          );
          z-index: 2;
        }
        
        .hero-content {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 10;
          width: 100%;
          pointer-events: none;
        }
        
        .hero-content > * {
          pointer-events: auto;
        }
        
        .hero-text {
          max-width: 700px;
          color: var(--white);
          text-align: left;
          position: relative;
          z-index: 10;
        }
        
        .hero-title {
          margin-bottom: 2rem;
        }
        
        .hero-values {
          display: block;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--white) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          display: block;
          font-size: clamp(1.02rem, 2.125vw, 1.7rem);
          font-weight: 500;
          line-height: 1.3;
          color: var(--white);
          position: relative;
          font-style: italic;
          opacity: 0.95;
          margin-top: 1rem;
        }
        
        .hero-subtitle::before {
          content: '"';
          font-size: 2em;
          color: var(--secondary);
          position: absolute;
          left: -0.4em;
          top: -0.15em;
          font-family: "Georgia", serif;
          font-weight: 400;
          line-height: 1;
          opacity: 0.7;
        }
        
        .hero-subtitle::after {
          content: '"';
          font-size: 2em;
          color: var(--secondary);
          position: absolute;
          right: -0.25em;
          bottom: -0.3em;
          font-family: "Georgia", serif;
          font-weight: 400;
          line-height: 1;
          opacity: 0.7;
        }
        
        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 3rem;
          opacity: 0.95;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
          .hero-section {
            height: 80vh;
            min-height: 500px;
          }
          
          .hero-text {
            text-align: center;
          }
          
          .hero-values {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .hero-subtitle::before {
            font-size: 1.8em;
            left: -0.25em;
            top: -0.1em;
          }
          
          .hero-subtitle::after {
            font-size: 1.8em;
            right: -0.15em;
            bottom: -0.25em;
          }
          
          .hero-description {
            font-size: 1.1rem;
          }
          
          .hero-buttons {
            justify-content: center;
            flex-direction: column;
            align-items: center;
          }
          
          .btn {
            width: 100%;
            max-width: 280px;
          }
        }
      `);
  const heroImages = [
    {
      src: "/images/galleries/kuchyn-bila-u-tvar/skrine-0201-web-2400w.avif",
      alt: "Bílá kuchyně v tvaru U s maximálním využitím prostoru",
      width: 2400,
      height: 1600
    },
    {
      src: "/images/galleries/kuchyn-bila-ostruvek/kuchyne_0017-web-2400w.avif",
      alt: "Modern bílá kuchyně s ostrůvkem a elegantním designem",
      width: 2400,
      height: 1600
    },
    {
      src: "/images/galleries/kuchyn-cerna/kuchyne_0071-web-2400w.avif",
      alt: "Elegantní černá kuchyně s vestavěnými spotřebiči",
      width: 2400,
      height: 1600
    },
    {
      src: "/images/galleries/kuchyn-retro-bila/kuchyne_0074-web-2400w.avif",
      alt: "Retro bílá kuchyně s moderními prvky a designem",
      width: 2400,
      height: 1600
    }
  ];

  return (
    <section class="hero-section">
      <HeroSwiper images={heroImages} />
      
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="hero-values">KVALITA. PRECIZNOST. SPOKOJENOST.</span>
              <span class="hero-subtitle">Vytváříme nábytek na míru, který předčí vaše očekávání</span>
            </h1>
            
            <p class="hero-description">
              Od návrhu po montáž – realizujeme vaše sny o dokonalém interiéru.
              Specializujeme se na zakázkovou výrobu nábytku pro domácnosti i firmy.
            </p>
            
            <div class="hero-buttons">
              <a href="#contact" class="btn btn-primary">
                Nezávazná poptávka
              </a>
              <a href="#portfolio" class="btn btn-secondary">
                Naše realizace
              </a>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
});