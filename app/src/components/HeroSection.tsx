import { component$, useStylesScoped$ } from "@builder.io/qwik";

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
            rgba(44, 62, 80, 0.8) 0%,
            rgba(44, 62, 80, 0.6) 50%,
            rgba(230, 126, 34, 0.3) 100%
          );
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
        }
        
        .hero-text {
          max-width: 700px;
          color: var(--white);
          text-align: left;
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
          background: linear-gradient(135deg, var(--white) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          display: block;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          color: var(--white);
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
            font-size: 1.5rem;
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
  return (
    <section class="hero-section">
      <div class="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1742192757416-27d69a5d5029?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxraXRjaGVuJTIwY2FiaW5ldHMlMjBtb2Rlcm4lMjBpbnRlcmlvciUyMGx1eHVyeSUyMGFwcGxpYW5jZXN8ZW58MHwwfHx8MTc1NTMzNTQyOXww&ixlib=rb-4.1.0&q=85"
          alt="Modern luxury kitchen interior with custom cabinets - Shishu Yadava on Unsplash"
          class="hero-image"
          width="1920"
          height="1080"
        />
        <div class="hero-overlay"></div>
      </div>
      
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