import type { RequestHandler } from '@builder.io/qwik-city';
import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
  consent: boolean;
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

const createEmailContent = (data: ContactFormData): string => {
  const currentDate = new Date().toLocaleDateString('cs-CZ');
  const currentTime = new Date().toLocaleTimeString('cs-CZ');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #322624, #C88B4E); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #F5ECE6; padding: 30px; border: 1px solid #C88B4E; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #322624; }
        .value { margin-left: 10px; }
        .footer { background: #322624; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛠️ Nová poptávka z webu KPS Interiéry</h1>
            <p>Datum: ${currentDate} v ${currentTime}</p>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">👤 Jméno a příjmení:</span>
                <span class="value">${data.name}</span>
            </div>
            
            <div class="field">
                <span class="label">📧 Email:</span>
                <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
            </div>
            
            <div class="field">
                <span class="label">📱 Telefon:</span>
                <span class="value"><a href="tel:${data.phone}">${data.phone}</a></span>
            </div>
            
            <div class="field">
                <span class="label">🏠 Typ projektu:</span>
                <span class="value">${formatProjectTypeForEmail(data.projectType)}</span>
            </div>
            
            <div class="field">
                <span class="label">💰 Rozpočet:</span>
                <span class="value">${formatBudgetForEmail(data.budget)}</span>
            </div>
            
            <div class="field">
                <span class="label">⏰ Termín realizace:</span>
                <span class="value">${formatTimelineForEmail(data.timeline)}</span>
            </div>
            
            <div class="field">
                <span class="label">📝 Popis projektu:</span>
                <div style="margin-top: 10px; padding: 15px; background: white; border-left: 4px solid #3b82f6; border-radius: 4px;">
                    ${data.description.replace(/\n/g, '<br>')}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>💡 Tato zpráva byla odeslána z kontaktního formuláře na webu KPS Interiéry</p>
            <p>🔒 Zákazník souhlasil se zpracováním osobních údajů</p>
        </div>
    </div>
</body>
</html>
  `.trim();
};

// Initialize Resend with API key from environment variables
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not found in environment variables. Emails will be mocked.');
    return null;
  }
  return new Resend(apiKey);
};

const sendEmail = async (to: string, subject: string, htmlContent: string, formData: ContactFormData): Promise<boolean> => {
  const resend = getResendClient();
  
  if (!resend) {
    // Mock mode - log email content instead of sending
    console.log('📧 EMAIL MOCK MODE - EMAIL WOULD BE SENT TO:', to);
    console.log('📧 SUBJECT:', subject);
    console.log('📧 FORM DATA:', JSON.stringify(formData, null, 2));
    console.log('📧 HTML CONTENT:', htmlContent);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
  
  try {
    const result = await resend.emails.send({
      from: 'KPS Interiéry <noreply@kpsinteriery.cz>', // You'll need to verify this domain with Resend
      to: [to],
      subject: subject,
      html: htmlContent,
      replyTo: formData.email, // Allow David to reply directly to the customer
    });
    
    if (result.error) {
      console.error('Resend API error:', result.error);
      return false;
    }
    
    console.log('✅ Email sent successfully:', result.data?.id);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
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
      consent: data.consent
    };
    
    // Create email content
    const subject = `🛠️ Nová poptávka od ${sanitizedData.name} - KPS Interiéry`;
    const htmlContent = createEmailContent(sanitizedData);
    
    // Send email
    const emailSent = await sendEmail('david@motalik.cz', subject, htmlContent, sanitizedData);
    
    if (emailSent) {
      json(200, { 
        success: true, 
        message: 'Vaše zpráva byla úspěšně odeslána. Brzy se vám ozveme!' 
      });
    } else {
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