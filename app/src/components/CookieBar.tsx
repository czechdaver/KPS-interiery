import { component$, useStylesScoped$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";

const styles = `
  .cookie-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(50, 38, 36, 0.98);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(200, 139, 78, 0.3);
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .cookie-bar.visible {
    transform: translateY(0);
  }
  
  .cookie-content {
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
    align-items: center;
  }
  
  .cookie-text {
    color: var(--white);
  }
  
  .cookie-text h3 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--secondary-light);
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .cookie-text p {
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    opacity: 0.9;
  }
  
  .cookie-text a {
    color: var(--secondary-light);
    text-decoration: underline;
    transition: var(--transition);
  }
  
  .cookie-text a:hover {
    color: var(--secondary);
  }
  
  .cookie-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .cookie-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-sm);
    font-family: var(--font-family);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }
  
  .cookie-btn-primary {
    background: var(--secondary);
    color: var(--white);
  }
  
  .cookie-btn-primary:hover {
    background: var(--secondary-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(200, 139, 78, 0.3);
  }
  
  .cookie-btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: var(--white);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .cookie-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  .cookie-btn-minimal {
    background: transparent;
    color: rgba(255, 255, 255, 0.8);
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .cookie-btn-minimal:hover {
    color: var(--secondary-light);
    border-color: var(--secondary-light);
  }
  
  .cookie-settings {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .cookie-settings.visible {
    opacity: 1;
    visibility: visible;
  }
  
  .cookie-modal {
    background: var(--white);
    border-radius: var(--radius-lg);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s ease;
  }
  
  .cookie-settings.visible .cookie-modal {
    transform: scale(1);
  }
  
  .cookie-modal-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid rgba(200, 139, 78, 0.2);
  }
  
  .cookie-modal-header h3 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .cookie-modal-content {
    padding: 1.5rem 2rem;
  }
  
  .cookie-category {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(200, 139, 78, 0.05);
    border-radius: var(--radius-md);
    border-left: 4px solid var(--secondary);
  }
  
  .cookie-category:last-child {
    margin-bottom: 0;
  }
  
  .cookie-category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .cookie-category h4 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary);
    margin: 0;
  }
  
  .cookie-category p {
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--gray);
    margin: 0;
  }
  
  .cookie-toggle {
    width: 48px;
    height: 24px;
    background: var(--gray);
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: var(--transition);
    border: none;
  }
  
  .cookie-toggle.active {
    background: var(--secondary);
  }
  
  .cookie-toggle.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .cookie-toggle::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: var(--white);
    border-radius: 50%;
    transition: var(--transition);
  }
  
  .cookie-toggle.active::after {
    transform: translateX(24px);
  }
  
  .cookie-modal-actions {
    padding: 1rem 2rem 2rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    border-top: 1px solid rgba(200, 139, 78, 0.2);
  }
  
  @media (max-width: 768px) {
    .cookie-content {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 1.25rem;
    }
    
    .cookie-actions {
      justify-content: center;
    }
    
    .cookie-btn {
      flex: 1;
      min-width: 120px;
      justify-content: center;
    }
    
    .cookie-modal {
      width: 95%;
      margin: 1rem;
    }
    
    .cookie-modal-header,
    .cookie-modal-content,
    .cookie-modal-actions {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    
    .cookie-modal-actions {
      flex-direction: column;
    }
    
    .cookie-category-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
`;

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const CookieBar = component$(() => {
  useStylesScoped$(styles);
  
  const isVisible = useSignal(false);
  const showSettings = useSignal(false);
  const consent = useSignal<CookieConsent>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  const initializeAnalytics = $(() => {
    // Initialize Google Analytics 4
    if (typeof window !== 'undefined') {
      // Load gtag script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script1);

      // Initialize gtag
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure'
        });
      `;
      document.head.appendChild(script2);
    }
  });

  useVisibleTask$(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      // Show cookie bar after a short delay
      setTimeout(() => {
        isVisible.value = true;
      }, 1000);
    } else {
      // Load saved preferences
      const parsed = JSON.parse(savedConsent);
      consent.value = { ...consent.value, ...parsed };
      
      // Initialize analytics if consented
      if (parsed.analytics) {
        initializeAnalytics();
      }
    }
  });

  const saveConsent = $((consentData: CookieConsent) => {
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    
    if (consentData.analytics) {
      initializeAnalytics();
    }
    
    isVisible.value = false;
    showSettings.value = false;
  });

  const acceptAll = $(() => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    consent.value = allConsent;
    saveConsent(allConsent);
  });

  const acceptNecessary = $(() => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    consent.value = necessaryOnly;
    saveConsent(necessaryOnly);
  });

  const saveCustomSettings = $(() => {
    saveConsent(consent.value);
  });

  const toggleConsent = $((category: keyof CookieConsent) => {
    if (category !== 'necessary') {
      consent.value = {
        ...consent.value,
        [category]: !consent.value[category]
      };
    }
  });

  return (
    <>
      <div class={`cookie-bar ${isVisible.value ? 'visible' : ''}`}>
        <div class="cookie-content">
          <div class="cookie-text">
            <h3>
              <i class="ph-duotone ph-cookie" style="font-size: 18px;"></i>
              Používáme cookies
            </h3>
            <p>
              Tento web používá soubory cookies k zajištění nejlepšího zážitku. 
              Cookies nám pomáhají analyzovat návštěvnost a přizpůsobit obsah vašim potřebám. 
              <a href="#privacy" target="_blank">Zásady ochrany osobních údajů</a>
            </p>
          </div>
          <div class="cookie-actions">
            <button class="cookie-btn cookie-btn-primary" onClick$={acceptAll}>
              <i class="ph-duotone ph-check-circle" style="font-size: 16px;"></i>
              Přijmout vše
            </button>
            <button class="cookie-btn cookie-btn-secondary" onClick$={() => showSettings.value = true}>
              <i class="ph-duotone ph-gear" style="font-size: 16px;"></i>
              Nastavení
            </button>
            <button class="cookie-btn cookie-btn-minimal" onClick$={acceptNecessary}>
              Pouze nezbytné
            </button>
          </div>
        </div>
      </div>

      <div class={`cookie-settings ${showSettings.value ? 'visible' : ''}`}>
        <div class="cookie-modal">
          <div class="cookie-modal-header">
            <h3>
              <i class="ph-duotone ph-gear" style="font-size: 20px;"></i>
              Nastavení cookies
            </h3>
            <p>
              Zde můžete spravovat své preference týkající se cookies. 
              Některé jsou nezbytné pro správné fungování webu.
            </p>
          </div>
          
          <div class="cookie-modal-content">
            <div class="cookie-category">
              <div class="cookie-category-header">
                <div>
                  <h4>Nezbytné cookies</h4>
                  <p>
                    Tyto cookies jsou nezbytné pro základní fungování webu 
                    a nelze je vypnout.
                  </p>
                </div>
                <button class="cookie-toggle active disabled">
                </button>
              </div>
            </div>

            <div class="cookie-category">
              <div class="cookie-category-header">
                <div>
                  <h4>Analytické cookies</h4>
                  <p>
                    Pomáhají nám pochopit, jak návštěvníci používají náš web. 
                    Data jsou anonymní a slouží ke zlepšení uživatelského zážitku.
                  </p>
                </div>
                <button 
                  class={`cookie-toggle ${consent.value.analytics ? 'active' : ''}`}
                  onClick$={() => toggleConsent('analytics')}
                >
                </button>
              </div>
            </div>

            <div class="cookie-category">
              <div class="cookie-category-header">
                <div>
                  <h4>Marketingové cookies</h4>
                  <p>
                    Používají se k zobrazování relevantních reklam 
                    a měření účinnosti reklamních kampaní.
                  </p>
                </div>
                <button 
                  class={`cookie-toggle ${consent.value.marketing ? 'active' : ''}`}
                  onClick$={() => toggleConsent('marketing')}
                >
                </button>
              </div>
            </div>

            <div class="cookie-category">
              <div class="cookie-category-header">
                <div>
                  <h4>Preferenční cookies</h4>
                  <p>
                    Ukládají vaše preference a nastavení pro lepší 
                    personalizaci webu.
                  </p>
                </div>
                <button 
                  class={`cookie-toggle ${consent.value.preferences ? 'active' : ''}`}
                  onClick$={() => toggleConsent('preferences')}
                >
                </button>
              </div>
            </div>
          </div>
          
          <div class="cookie-modal-actions">
            <button class="cookie-btn cookie-btn-minimal" onClick$={() => showSettings.value = false}>
              Zrušit
            </button>
            <button class="cookie-btn cookie-btn-secondary" onClick$={acceptNecessary}>
              Pouze nezbytné
            </button>
            <button class="cookie-btn cookie-btn-primary" onClick$={saveCustomSettings}>
              <i class="ph-duotone ph-floppy-disk" style="font-size: 16px;"></i>
              Uložit nastavení
            </button>
          </div>
        </div>
      </div>
    </>
  );
});