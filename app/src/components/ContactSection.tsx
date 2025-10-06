import { component$, useStylesScoped$, useStore, $, useVisibleTask$ } from "@builder.io/qwik";
import { PhMapPin, PhPhone, PhEnvelopeSimple, PhClock } from "~/components/icons";

const styles = `
  .contact-section {
    background: linear-gradient(135deg, 
      rgba(60, 46, 38, 0.05) 0%, 
      rgba(199, 122, 90, 0.05) 50%, 
      rgba(60, 46, 38, 0.05) 100%
    );
    position: relative;
    overflow: hidden;
  }
  
  .contact-section::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 70%, rgba(199, 122, 90, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(60, 46, 38, 0.1) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
    z-index: 1;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(1deg); }
    66% { transform: translate(-20px, 20px) rotate(-1deg); }
  }
  
  .contact-container {
    position: relative;
    z-index: 2;
  }
  
  .contact-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 5rem;
  }
  
  
  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 3rem;
    margin-bottom: 5rem;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .contact-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-lg);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }
  
  .contact-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent-dark));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .contact-item:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  .contact-item:hover::before {
    transform: scaleX(1);
  }
  
  .contact-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    flex-shrink: 0;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .contact-icon::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .contact-item:hover .contact-icon {
    transform: rotate(5deg) scale(1.1);
  }
  
  .contact-item:hover .contact-icon::after {
    opacity: 0.3;
  }
  
  .contact-details h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  
  .contact-details p {
    color: var(--gray);
    line-height: 1.6;
    margin: 0;
  }
  
  .contact-details a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
    position: relative;
  }
  
  .contact-details a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent);
    transition: width 0.3s ease;
  }
  
  .contact-details a:hover::after {
    width: 100%;
  }
  
  .contact-form-container {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(25px);
    padding: 3rem;
    border-radius: var(--radius-xl);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  .contact-form-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  }
  
  .contact-form h3 {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }
  
  .form-input {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-md);
    font-family: var(--font-family);
    font-size: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    color: var(--primary);
    appearance: none;
  }
  
  select.form-input {
    padding-right: 2.5rem;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23322624" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"></polyline></svg>');
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 16px;
  }
  
  .form-input:focus {
    outline: none;
    border-color: var(--accent);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0 4px rgba(199, 122, 90, 0.1);
    transform: translateY(-2px);
  }

  select.form-input:focus {
    transform: none;
  }

  .form-input::placeholder {
    color: rgba(60, 46, 38, 0.6);
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .checkbox-group {
    margin: 2rem 0;
  }
  
  .checkbox-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .checkbox-label {
    cursor: pointer;
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
  }
  
  .checkbox-input {
    width: 18px;
    height: 18px;
    margin: 0.25rem 0 0 0;
    accent-color: var(--accent);
    flex-shrink: 0;
    cursor: pointer;
  }
  
  .submit-btn {
    width: 100%;
    padding: 1.25rem 2rem;
    font-size: 1.1rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
    color: var(--white);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(199, 122, 90, 0.4);
  }
  
  .submit-btn:hover::before {
    left: 100%;
  }
  
  .submit-btn:active {
    transform: translateY(0);
  }
  
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .form-message {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .form-message.success {
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }
  
  .form-message.error {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .service-area {
    text-align: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    border-radius: var(--radius-xl);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
  }
  
  .service-area::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  }
  
  .service-area h3 {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
  }
  
  .service-area p {
    font-size: 1.1rem;
    color: var(--gray);
    margin-bottom: 2.5rem;
    line-height: 1.6;
  }
  
  .service-regions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  
  .region {
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    color: var(--white);
    padding: 0.75rem 1.75rem;
    border-radius: 30px;
    font-weight: 700;
    font-size: 0.95rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(199, 122, 90, 0.3);
  }
  
  .region:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(199, 122, 90, 0.4);
  }
  
  @media (max-width: 1024px) {
    .contact-content {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    
    /* Rearrange: form first, then contact-info */
    .contact-form-container {
      order: 1;
    }
    
    .contact-info {
      order: 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    .contact-form-container {
      padding: 2rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    /* Mobile: contact-info as 1x4 vertical stack */
    .contact-info {
      display: flex !important;
      flex-direction: column;
      gap: 1.5rem;
      grid-template-columns: unset;
      grid-template-rows: unset;
    }
    
    .contact-item {
      padding: 1.5rem;
    }
    
    .contact-icon {
      width: 48px;
      height: 48px;
    }
    
    .service-regions {
      gap: 0.75rem;
    }
    
    .region {
      padding: 0.5rem 1.25rem;
      font-size: 0.9rem;
    }
  }
`;

interface FormData {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
  consent: boolean;
  'h-captcha-response': string;
}

export const ContactSection = component$(() => {
  useStylesScoped$(styles);

  const formData = useStore<FormData>({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    description: '',
    budget: '',
    timeline: '',
    consent: false,
    'h-captcha-response': ''
  });

  const formState = useStore({
    isSubmitting: false,
    message: '',
    messageType: '' as 'success' | 'error' | ''
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleHCaptchaSuccess = (event: CustomEvent) => {
      formData['h-captcha-response'] = event.detail;
    };

    const handleHCaptchaExpired = () => {
      formData['h-captcha-response'] = '';
    };

    window.addEventListener('hcaptcha-success', handleHCaptchaSuccess as EventListener);
    window.addEventListener('hcaptcha-expired', handleHCaptchaExpired as EventListener);

    return () => {
      window.removeEventListener('hcaptcha-success', handleHCaptchaSuccess as EventListener);
      window.removeEventListener('hcaptcha-expired', handleHCaptchaExpired as EventListener);
    };
  });
  
  const submitForm = $(async () => {
    if (!formData.consent) {
      formState.message = 'Musíte souhlasit se zpracováním osobních údajů';
      formState.messageType = 'error';
      return;
    }

    if (!formData['h-captcha-response']) {
      formState.message = 'Prosím dokončete captcha ověření';
      formState.messageType = 'error';
      return;
    }

    formState.isSubmitting = true;
    formState.message = '';

    try {
      // Format data for Web3Forms API
      const currentDate = new Date().toLocaleDateString('cs-CZ');
      const currentTime = new Date().toLocaleTimeString('cs-CZ');

      const formatProjectType = (type: string) => {
        const types: Record<string, string> = {
          kitchen: 'Kuchyň',
          wardrobe: 'Skříně',
          bathroom: 'Koupelna',
          office: 'Kancelář',
          other: 'Jiné'
        };
        return types[type] || 'Nespecifikováno';
      };

      const formatBudget = (budget: string) => {
        const budgets: Record<string, string> = {
          '50000': 'Do 50 000 Kč',
          '100000': '50 000 - 100 000 Kč',
          '200000': '100 000 - 200 000 Kč',
          '500000': '200 000 - 500 000 Kč',
          '500000+': 'Nad 500 000 Kč'
        };
        return budgets[budget] || 'Nespecifikováno';
      };

      const formatTimeline = (timeline: string) => {
        const timelines: Record<string, string> = {
          asap: 'Co nejdříve',
          '1-3months': '1-3 měsíce',
          '3-6months': '3-6 měsíců',
          '6months+': 'Nad 6 měsíců'
        };
        return timelines[timeline] || 'Nespecifikováno';
      };

      const messageContent = `
📅 Datum: ${currentDate} v ${currentTime}

👤 Jméno a příjmení: ${formData.name}
📧 Email: ${formData.email}
📱 Telefon: ${formData.phone}

🏠 Typ projektu: ${formatProjectType(formData.projectType)}
💰 Rozpočet: ${formatBudget(formData.budget)}
⏰ Termín realizace: ${formatTimeline(formData.timeline)}

📝 Popis projektu:
${formData.description}

🔒 Zákazník souhlasil se zpracováním osobních údajů
      `.trim();

      const formDataToSend = new FormData();
      formDataToSend.append('access_key', '720d65a7-bfb4-4a2c-9059-8c7182decfdd');
      formDataToSend.append('subject', `🛠️ Nová poptávka od ${formData.name} - KPS Interiéry`);
      formDataToSend.append('from_name', formData.name);
      formDataToSend.append('from_email', formData.email);
      formDataToSend.append('reply_to', formData.email);
      formDataToSend.append('to_email', 'info@kps-interiery.cz');
      formDataToSend.append('h-captcha-response', formData['h-captcha-response']);
      formDataToSend.append('message', messageContent);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        formState.message = 'Vaše zpráva byla úspěšně odeslána. Brzy se vám ozveme!';
        formState.messageType = 'success';

        // Reset form
        formData.name = '';
        formData.phone = '';
        formData.email = '';
        formData.projectType = '';
        formData.description = '';
        formData.budget = '';
        formData.timeline = '';
        formData.consent = false;
        formData['h-captcha-response'] = '';

        // Reset hCaptcha widget
        if (typeof (window as any).hcaptcha !== 'undefined') {
          (window as any).hcaptcha.reset();
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
      formState.message = 'Nastala chyba při odesílání zprávy. Zkuste to prosím znovu.';
      formState.messageType = 'error';
    } finally {
      formState.isSubmitting = false;
    }
  });
  
  return (
    <section class="contact-section section" id="kontakt">
      <div class="container contact-container">
        <div class="contact-header">
          <h2 class="section-title">Pojďme si promluvit o vašem projektu</h2>
          <p class="section-description">
            Máte nápad na nový nábytek? Napište nám nebo zavolejte. Rádi vám poradíme a vytvoříme nezávaznou nabídku na míru.
          </p>
        </div>
        
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">
                <PhMapPin size={28} />
              </div>
              <div class="contact-details">
                <h3>Adresa</h3>
                <p>
                  <a href="https://maps.google.com/?q=Stará+cesta+32,+Zlín-Štípa+763+14,+Česká+republika" target="_blank" rel="noopener noreferrer">
                    Stará cesta 32<br />Zlín-Štípa 763 14<br />Česká republika
                  </a>
                </p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <PhPhone size={28} />
              </div>
              <div class="contact-details">
                <h3>Telefon</h3>
                <p><a href="tel:+420774127133">+420 774 127 133</a></p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <PhEnvelopeSimple size={28} />
              </div>
              <div class="contact-details">
                <h3>Email</h3>
                <p><a href="mailto:info@kps-interiery.cz">info@kps-interiery.cz</a></p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <PhClock size={28} />
              </div>
              <div class="contact-details">
                <h3>Otevírací doba</h3>
                <p>Po-Pá: 8:00 - 16:00<br />So: Po domluvě<br />Ne: Zavřeno</p>
              </div>
            </div>
          </div>
          
          <div class="contact-form-container">
            <form class="contact-form" preventdefault:submit onSubmit$={submitForm}>
              <h3>Máte nápad? Napište nám!</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Jméno a příjmení *</label>
                  <input 
                    type="text" 
                    id="name" 
                    class="form-input"
                    value={formData.name}
                    onInput$={(event) => formData.name = (event.target as HTMLInputElement).value}
                    required 
                    placeholder="Jan Novák"
                  />
                </div>
                <div class="form-group">
                  <label for="phone">Telefon *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    class="form-input"
                    value={formData.phone}
                    onInput$={(event) => formData.phone = (event.target as HTMLInputElement).value}
                    required
                    placeholder="+420 774 127 133"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  class="form-input"
                  value={formData.email}
                  onInput$={(event) => formData.email = (event.target as HTMLInputElement).value}
                  required 
                  placeholder="vas@email.cz"
                />
              </div>
              
              <div class="form-group">
                <label for="project-type">Typ projektu</label>
                <select 
                  id="project-type" 
                  class="form-input"
                  value={formData.projectType}
                  onChange$={(event) => formData.projectType = (event.target as HTMLSelectElement).value}
                >
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
                <textarea 
                  id="description" 
                  class="form-input form-textarea"
                  value={formData.description}
                  onInput$={(event) => formData.description = (event.target as HTMLTextAreaElement).value}
                  required 
                  placeholder="Popište nám váš projekt, představy a požadavky..."
                ></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="budget">Přibližný rozpočet (volitelné)</label>
                  <select 
                    id="budget" 
                    class="form-input"
                    value={formData.budget}
                    onChange$={(event) => formData.budget = (event.target as HTMLSelectElement).value}
                  >
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
                  <select 
                    id="timeline" 
                    class="form-input"
                    value={formData.timeline}
                    onChange$={(event) => formData.timeline = (event.target as HTMLSelectElement).value}
                  >
                    <option value="">Vyberte termín</option>
                    <option value="asap">Co nejdříve</option>
                    <option value="1-3months">1-3 měsíce</option>
                    <option value="3-6months">3-6 měsíců</option>
                    <option value="6months+">Nad 6 měsíců</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group checkbox-group">
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="consent"
                    class="checkbox-input"
                    checked={formData.consent}
                    onChange$={(event) => formData.consent = (event.target as HTMLInputElement).checked}
                    required
                  />
                  <label for="consent" class="checkbox-label">
                    Souhlasím se zpracováním osobních údajů pro účely kontaktování a zpracování poptávky
                  </label>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 1.5rem;">
                <div
                  class="h-captcha"
                  data-captcha="true"
                  data-callback="onHCaptchaSuccess"
                  data-expired-callback="onHCaptchaExpired"
                  data-sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                ></div>
              </div>

              <button
                type="submit"
                class="submit-btn"
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? 'Odesílání...' : 'Odeslat poptávku'}
              </button>
              
              {formState.message && (
                <div class={`form-message ${formState.messageType}`}>
                  {formState.message}
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div class="service-area">
          <h3>Naše působení</h3>
          <p>Realizujeme projekty primárně na Moravě, ale kvalitní projekty rádi realizujeme i v ostatních částech České republiky.</p>
          <div class="service-regions">
            <span class="region">Zlín</span>
            <span class="region">Brno</span>
            <span class="region">Uherské Hradiště</span>
            <span class="region">Ostrava</span>
            <span class="region">Olomouc</span>
            <span class="region">Jihlava</span>
            <span class="region">Praha</span>
          </div>
        </div>
      </div>
    </section>
  );
});