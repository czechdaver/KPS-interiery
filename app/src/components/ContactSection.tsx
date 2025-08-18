import { component$, useStylesScoped$ } from "@builder.io/qwik";

const styles = `
  .contact-section {
    background: linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%);
  }
  
  .contact-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 4rem;
  }
  
  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 4rem;
    margin-bottom: 4rem;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
  }
  
  .contact-item:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
  
  .contact-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--accent), var(--primary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    flex-shrink: 0;
  }
  
  .contact-details h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  
  .contact-details p {
    color: var(--gray);
    line-height: 1.5;
    margin: 0;
  }
  
  .contact-details a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
  }
  
  .contact-details a:hover {
    color: var(--primary);
  }
  
  .contact-form-container {
    background: var(--white);
    padding: 3rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }
  
  .contact-form h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--radius-sm);
    font-family: var(--font-family);
    font-size: 1rem;
    transition: var(--transition);
    background: var(--white);
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .checkbox-group {
    margin: 2rem 0;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    font-size: 0.95rem;
  }
  
  .checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
  }
  
  .submit-btn {
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 700;
  }
  
  .service-area {
    text-align: center;
    padding: 3rem;
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }
  
  .service-area h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 1rem;
  }
  
  .service-area p {
    font-size: 1.1rem;
    color: var(--gray);
    margin-bottom: 2rem;
  }
  
  .service-regions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  
  .region {
    background: linear-gradient(135deg, var(--accent), var(--primary));
    color: var(--white);
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.95rem;
  }
  
  @media (max-width: 1024px) {
    .contact-content {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
  
  @media (max-width: 768px) {
    .contact-form-container {
      padding: 2rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .service-regions {
      gap: 0.75rem;
    }
    
    .region {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
    }
  }
`;

export const ContactSection = component$(() => {
  useStylesScoped$(styles);
  return (
    <section class="contact-section section" id="contact">
      <div class="container">
        <div class="contact-header">
          <h2 class="section-title">Pojďme si promluvit o vašem projektu</h2>
          <p class="section-description">
            Máte nápad na nový nábytek? Napište nám nebo zavolejte. Rádi vám poradíme a vytvoříme nezávaznou nabídku.
          </p>
        </div>
        
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div class="contact-details">
                <h3>Adresa</h3>
                <p>Brno, Moravskoslezský kraj<br />Česká republika</p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <div class="contact-details">
                <h3>Telefon</h3>
                <p><a href="tel:+420123456789">+420 123 456 789</a></p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div class="contact-details">
                <h3>Email</h3>
                <p><a href="mailto:info@kpsinteriery.cz">info@kpsinteriery.cz</a></p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <div class="contact-details">
                <h3>Otevírací doba</h3>
                <p>Po-Pá: 8:00 - 16:00<br />So: Po domluvě<br />Ne: Zavřeno</p>
              </div>
            </div>
          </div>
          
          <div class="contact-form-container">
            <form class="contact-form">
              <h3>Máte nápad? Napište nám!</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Jméno a příjmení *</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div class="form-group">
                  <label for="phone">Telefon *</label>
                  <input type="tel" id="phone" name="phone" required />
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required />
              </div>
              
              <div class="form-group">
                <label for="project-type">Typ projektu</label>
                <select id="project-type" name="project-type">
                  <option value="">Vyberte typ projektu</option>
                  <option value="kitchen">Kuchyň</option>
                  <option value="wardrobe">Skříně</option>
                  <option value="bathroom">Koupelna</option>
                  <option value="office">Kancelář</option>
                  <option value="other">Jiné</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="description">Popis projektu *</label>
                <textarea id="description" name="description" rows={4} required placeholder="Popište nám váš projekt..."></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="budget">Přibližný rozpočet (volitelné)</label>
                  <select id="budget" name="budget">
                    <option value="">Vyberte rozpočet</option>
                    <option value="50000">Do 50 000 Kč</option>
                    <option value="100000">50 000 - 100 000 Kč</option>
                    <option value="200000">100 000 - 200 000 Kč</option>
                    <option value="500000">200 000 - 500 000 Kč</option>
                    <option value="500000+">Nad 500 000 Kč</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="timeline">Kdy by měla realizace proběhnout?</label>
                  <select id="timeline" name="timeline">
                    <option value="">Vyberte termín</option>
                    <option value="asap">Co nejdříve</option>
                    <option value="1-3months">1-3 měsíce</option>
                    <option value="3-6months">3-6 měsíců</option>
                    <option value="6months+">Nad 6 měsíců</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" required />
                  <span class="checkmark"></span>
                  Souhlasím se zpracováním osobních údajů
                </label>
              </div>
              
              <button type="submit" class="btn btn-primary submit-btn">
                Odeslat poptávku
              </button>
            </form>
          </div>
        </div>
        
        <div class="service-area">
          <h3>Naše působení</h3>
          <p>Realizujeme projekty primárně na Moravě, ale kvalitní projekty rádi realizujeme i v Čechách.</p>
          <div class="service-regions">
            <span class="region">Brno</span>
            <span class="region">Ostrava</span>
            <span class="region">Olomouc</span>
            <span class="region">Zlín</span>
            <span class="region">Jihlava</span>
            <span class="region">Praha</span>
          </div>
        </div>
      </div>
      
    </section>
  );
});