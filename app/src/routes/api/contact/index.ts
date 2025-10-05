import type { RequestHandler } from '@builder.io/qwik-city';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
  consent: boolean;
  'h-captcha-response'?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9\s\-()]{9,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

const formatProjectTypeForEmail = (projectType: string): string => {
  const types: Record<string, string> = {
    kitchen: 'Kuchyň',
    wardrobe: 'Skříně',
    bathroom: 'Koupelna',
    office: 'Kancelář',
    other: 'Jiné'
  };
  return types[projectType] || 'Nespecifikováno';
};

const formatBudgetForEmail = (budget: string): string => {
  const budgets: Record<string, string> = {
    '50000': 'Do 50 000 Kč',
    '100000': '50 000 - 100 000 Kč',
    '200000': '100 000 - 200 000 Kč',
    '500000': '200 000 - 500 000 Kč',
    '500000+': 'Nad 500 000 Kč'
  };
  return budgets[budget] || 'Nespecifikováno';
};

const formatTimelineForEmail = (timeline: string): string => {
  const timelines: Record<string, string> = {
    asap: 'Co nejdříve',
    '1-3months': '1-3 měsíce',
    '3-6months': '3-6 měsíců',
    '6months+': 'Nad 6 měsíců'
  };
  return timelines[timeline] || 'Nespecifikováno';
};

export const onPost: RequestHandler = async ({ json, request }) => {
  try {
    const body = await request.json();
    const data = body as ContactFormData;

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.description) {
      json(400, {
        success: false,
        message: 'Všechna povinná pole musí být vyplněna'
      });
      return;
    }

    // Validate consent
    if (!data.consent) {
      json(400, {
        success: false,
        message: 'Musíte souhlasit se zpracováním osobních údajů'
      });
      return;
    }

    // Validate hCaptcha
    if (!data['h-captcha-response']) {
      json(400, {
        success: false,
        message: 'Prosím dokončete captcha ověření'
      });
      return;
    }

    // Validate email format
    if (!validateEmail(data.email)) {
      json(400, {
        success: false,
        message: 'Neplatný formát emailové adresy'
      });
      return;
    }

    // Validate phone format
    if (!validatePhone(data.phone)) {
      json(400, {
        success: false,
        message: 'Neplatný formát telefonního čísla'
      });
      return;
    }

    // Sanitize inputs
    const sanitizedData: ContactFormData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      projectType: data.projectType,
      description: sanitizeInput(data.description),
      budget: data.budget,
      timeline: data.timeline,
      consent: data.consent,
      'h-captcha-response': data['h-captcha-response']
    };

    // Prepare Web3Forms data
    const currentDate = new Date().toLocaleDateString('cs-CZ');
    const currentTime = new Date().toLocaleTimeString('cs-CZ');

    const formData = new FormData();
    formData.append('access_key', 'edcf39c8-1047-4c9f-909f-509672a1ce9a');
    formData.append('subject', `🛠️ Nová poptávka od ${sanitizedData.name} - KPS Interiéry`);
    formData.append('from_name', sanitizedData.name);
    formData.append('from_email', sanitizedData.email);
    formData.append('reply_to', sanitizedData.email);
    formData.append('to_email', 'info@kps-interiery.cz');
    formData.append('h-captcha-response', sanitizedData['h-captcha-response'] || '');

    // Add form fields to message
    const messageContent = `
📅 Datum: ${currentDate} v ${currentTime}

👤 Jméno a příjmení: ${sanitizedData.name}
📧 Email: ${sanitizedData.email}
📱 Telefon: ${sanitizedData.phone}

🏠 Typ projektu: ${formatProjectTypeForEmail(sanitizedData.projectType)}
💰 Rozpočet: ${formatBudgetForEmail(sanitizedData.budget)}
⏰ Termín realizace: ${formatTimelineForEmail(sanitizedData.timeline)}

📝 Popis projektu:
${sanitizedData.description}

🔒 Zákazník souhlasil se zpracováním osobních údajů
    `.trim();

    formData.append('message', messageContent);

    // Send to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      json(200, {
        success: true,
        message: 'Vaše zpráva byla úspěšně odeslána. Brzy se vám ozveme!'
      });
    } else {
      console.error('Web3Forms error:', result);
      json(500, {
        success: false,
        message: 'Nastala chyba při odesílání zprávy. Zkuste to prosím znovu.'
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    json(500, {
      success: false,
      message: 'Nastala neočekávaná chyba. Zkuste to prosím znovu.'
    });
  }
};
