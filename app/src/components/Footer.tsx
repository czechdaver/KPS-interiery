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
          flex-direction: column;
          margin-bottom: 1.5rem;
          line-height: 1;
        }
        
        .footer-logo .logo-text {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--white);
          letter-spacing: -1px;
        }
        
        .footer-logo .logo-subtitle {
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent);
          margin-top: -4px;
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
              <span class="logo-text">KPS</span>
              <span class="logo-subtitle">Interiéry</span>
            </div>
            <p class="footer-description">
              Vytváříme nábytek na míru, který předčí vaše očekávání. 
              Kvalita, preciznost a spokojenost jsou naše hlavní hodnoty.
            </p>
            <div class="footer-social">
              <a href="https://instagram.com/kpsinteriery" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                </svg>
              </a>
              <a href="https://facebook.com/kpsinteriery" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href="tel:+420123456789">+420 123 456 789</a>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:info@kpsinteriery.cz">info@kpsinteriery.cz</a>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
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