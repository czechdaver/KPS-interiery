import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { PhInstagramLogo, PhFacebookLogo, PhPhone, PhEnvelopeSimple, PhMapPin } from "~/components/icons";
import { ObfuscatedEmail } from "~/components/ObfuscatedEmail";

export const Footer = component$(() => {
  useStylesScoped$(`
        .footer {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: var(--white);
          padding: 4rem 0 2rem;
          border-top: 1px solid rgba(200, 139, 78, 0.2);
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
          height: 56px; /* 70% z 80px */
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
          width: 52px;
          height: 52px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }
        
        .social-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
          opacity: 0;
          transition: var(--transition);
        }
        
        .social-link:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--white);
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .social-link:hover::before {
          opacity: 1;
        }
        
        .social-link:active {
          transform: translateY(-1px) scale(1.02);
        }
        
        .social-link svg {
          width: 22px;
          height: 22px;
          z-index: 1;
          position: relative;
          transition: var(--transition);
        }

        .social-link:hover svg {
          transform: scale(1.1);
        }
        
        .footer-links {
          display: grid;
          grid-template-columns: 1.75fr 1fr 1.25fr !important;
          gap: 2rem;
        }
        
        .footer-column h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
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
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: var(--transition);
          font-size: 0.95rem;
        }
        
        .footer-column a:hover {
          color: var(--secondary-light);
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
          border-top: 1px solid rgba(200, 139, 78, 0.2);
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
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        
        .footer-legal a:hover {
          color: var(--secondary-light);
        }
        
        @media (max-width: 768px) and (min-width: 1px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1200px) {
          .footer-links {
            grid-template-columns: 1.55fr 1fr 1.25fr;
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
              <img src={`${import.meta.env.BASE_URL}branding/kps-logo-slogan-inverse.svg`} alt="KPS Interiéry" width="200" height="80" />
            </div>
            <p class="footer-description">
              Vytváříme nábytek na míru, který předčí vaše očekávání. 
              Kvalita, preciznost a spokojenost jsou naše hlavní hodnoty.
            </p>
            <div class="footer-social">
              <a 
                href="https://instagram.com/kpsinteriery" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="social-link"
                aria-label="Sledujte nás na Instagramu"
              >
                <PhInstagramLogo size={22} />
              </a>
              <a 
                href="https://facebook.com/kpsinteriery" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="social-link"
                aria-label="Sledujte nás na Facebooku"
              >
                <PhFacebookLogo size={22} />
              </a>
            </div>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h3>Služby</h3>
              <ul>
                <li><a href="#sluzby">Kuchyně na míru</a></li>
                <li><a href="#sluzby">Vestavěné skříně</a></li>
                <li><a href="#sluzby">Koupelnový nábytek</a></li>
                <li><a href="#sluzby">Kancelářský nábytek</a></li>
                <li><a href="#sluzby">Atypické řešení</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h3>Společnost</h3>
              <ul>
                <li><a href="#uvod">Úvod</a></li>
                <li><a href="#realizace">Naše realizace</a></li>
                <li><a href="/galerie/">Galerie</a></li>
                <li><a href="#partners">Naši partneři</a></li>
                <li><a href="#kontakt">Kontakt</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h3>Kontakt</h3>
              <ul>
                <li>
                  <PhPhone size={16} class="icon-duotone-reverse" />
                  <a href="tel:+420774127133">+420 774 127 133</a>
                </li>
                <li>
                  <PhEnvelopeSimple size={16} class="icon-duotone-reverse" />
                  <ObfuscatedEmail user="info" domain="kps-interiery.cz" />
                </li>
                <li>
                  <PhMapPin size={16} class="icon-duotone-reverse" />
                  <a href="https://maps.google.com/?q=Stará+cesta+32,+Zlín-Štípa+763+14,+Česká+republika" target="_blank" rel="noopener noreferrer">
                    Stará cesta 32, Zlín-Štípa 763 14
                  </a>
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