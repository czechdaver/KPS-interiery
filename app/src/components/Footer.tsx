import { component$, useStylesScoped$ } from "@builder.io/qwik";

export const Footer = component$(() => {
  useStylesScoped$(`
        .footer {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: var(--white);
          padding: 4rem 0 2rem;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }
        
        .footer-brand {
          max-width: 400px;
        }
        
        .footer-logo {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          line-height: 1;
        }
        
        .footer-logo img {
          height: 80px;
          width: auto;
        }
        
        .footer-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .footer-social {
          display: flex;
          gap: 1rem;
        }
        
        .social-link {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.20);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          transition: var(--transition);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.39);
        }
        
        .social-link:hover {
          background: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        
        .footer-column h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--accent);
        }
        
        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-column li {
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .footer-column a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transition: var(--transition);
          font-size: 0.95rem;
        }
        
        .footer-column a:hover {
          color: var(--accent);
        }
        
        .footer-column svg {
          opacity: 0.7;
          flex-shrink: 0;
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.26);
        }
        
        .footer-copyright p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.95rem;
        }
        
        .footer-legal {
          display: flex;
          gap: 2rem;
        }
        
        .footer-legal a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        
        .footer-legal a:hover {
          color: var(--accent);
        }
        
        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          
          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .footer {
            padding: 3rem 0 1.5rem;
          }
          
          .footer-links {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .footer-legal {
            gap: 1rem;
          }
        }
      `);
  return (
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <img src="/branding/kps-logo-slogan-inverse.svg" alt="KPS Interiéry" width="200" height="80" />
            </div>
            <p class="footer-description">
              Vytváříme nábytek na míru, který předčí vaše očekávání. 
              Kvalita, preciznost a spokojenost jsou naše hlavní hodnoty.
            </p>
            <div class="footer-social">
              <a href="https://instagram.com/kpsinteriery" target="_blank" rel="noopener noreferrer" class="social-link">
                <i class="ph-duotone ph-instagram-logo icon-duotone icon-hover-lift" style="font-size: 24px;"></i>
              </a>
              <a href="https://facebook.com/kpsinteriery" target="_blank" rel="noopener noreferrer" class="social-link">
                <i class="ph-duotone ph-facebook-logo icon-duotone icon-hover-lift" style="font-size: 24px;"></i>
              </a>
            </div>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h3>Služby</h3>
              <ul>
                <li><a href="#services">Kuchyně na míru</a></li>
                <li><a href="#services">Vestavěné skříně</a></li>
                <li><a href="#services">Koupelnový nábytek</a></li>
                <li><a href="#services">Kancelářský nábytek</a></li>
                <li><a href="#services">Atypické řešení</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h3>Společnost</h3>
              <ul>
                <li><a href="#about">O nás</a></li>
                <li><a href="#portfolio">Naše realizace</a></li>
                <li><a href="#partners">Partneři</a></li>
                <li><a href="#contact">Kontakt</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h3>Kontakt</h3>
              <ul>
                <li>
                  <i class="ph-duotone ph-phone icon-duotone-reverse" style="font-size: 16px;"></i>
                  <a href="tel:+420123456789">+420 123 456 789</a>
                </li>
                <li>
                  <i class="ph-duotone ph-envelope-simple icon-duotone-reverse" style="font-size: 16px;"></i>
                  <a href="mailto:info@kpsinteriery.cz">info@kpsinteriery.cz</a>
                </li>
                <li>
                  <i class="ph-duotone ph-map-pin icon-duotone-reverse" style="font-size: 16px;"></i>
                  Brno, Moravskoslezský kraj
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; 2024 KPS Interiéry. Všechna práva vyhrazena.</p>
          </div>
          <div class="footer-legal">
            <a href="#privacy">Ochrana osobních údajů</a>
            <a href="#terms">Obchodní podmínky</a>
          </div>
        </div>
      </div>
      
    </footer>
  );
});