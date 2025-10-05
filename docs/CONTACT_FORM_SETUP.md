# Contact Form Setup Guide

## Overview

The contact form uses **Web3Forms** for email delivery with **hCaptcha** spam protection:
- **Free email service** via Web3Forms
- **Built-in spam protection** with hCaptcha
- **No backend email configuration needed**
- **Professional email delivery** to info@kps-interiery.cz
- **Responsive design** matching website aesthetics

## Features

### 🎨 Modern Design
- **Glassmorphism effects** with backdrop filters and transparency
- **Gradient text effects** for headings
- **Smooth animations** and hover effects
- **Floating background elements** with subtle animations
- **Consistent styling** with the rest of the website

### 📧 Email Integration (Web3Forms)
- **Web3Forms API** for reliable email delivery
- **Professional email formatting** with complete form data
- **Email validation** and sanitization
- **Error handling** with user-friendly messages
- **Reply-to** set to customer's email for easy responses

### 🛡️ Spam Protection
- **hCaptcha integration** for bot protection
- **Client-side validation** before submission
- **Server-side validation** for security
- **Input sanitization** to prevent XSS attacks

### ✅ Form Validation
- **Client-side validation** for immediate feedback
- **Server-side validation** for security
- **Required field validation**
- **Email format validation**
- **Phone number format validation**
- **Consent checkbox requirement**
- **Captcha completion check**

## Configuration

### Web3Forms Setup
- **Access Key**: `edcf39c8-1047-4c9f-909f-509672a1ce9a`
- **Recipient Email**: info@kps-interiery.cz
- **From Email**: Customer's email (for direct replies)
- **Reply-to**: Customer's email

### hCaptcha Configuration
- **Site Key**: `50b2fe65-b00b-4b9e-ad62-3ba471098be2`
- **Free tier** with basic spam protection
- **Automatic validation** via Web3Forms
- **Widget auto-reset** after successful submission

## Form Fields

The contact form includes:
- **Name** (required) - Customer's full name
- **Phone** (required) - Contact phone number
- **Email** (required) - Customer's email address
- **Project Type** (optional) - Kitchen, Wardrobe, Bathroom, Office, Other
- **Description** (required) - Detailed project description
- **Budget** (optional) - Price range selection
- **Timeline** (optional) - When they want the project completed
- **Consent** (required) - GDPR compliance checkbox
- **hCaptcha** (required) - Spam protection verification

## Email Format

Emails sent to info@kps-interiery.cz include:
- **Subject**: 🛠️ Nová poptávka od [Customer Name] - KPS Interiéry
- **From**: Customer's email address
- **Reply-to**: Customer's email (for easy responses)
- **Message Content**:
  - Date and time of submission
  - Customer name, email, and phone
  - Project type, budget, and timeline
  - Full project description
  - GDPR consent confirmation

## How It Works

1. **User fills out form** with project details
2. **Completes hCaptcha** verification
3. **Form validates** all fields client-side
4. **Submits to API** endpoint `/api/contact`
5. **Server validates** data and captcha token
6. **Sends to Web3Forms** API with all form data
7. **Web3Forms delivers** email to info@kps-interiery.cz
8. **User receives** success confirmation

## Technical Implementation

### Frontend (`app/src/components/ContactSection.tsx`)
- Qwik reactive form with state management
- hCaptcha widget integration
- Event listeners for captcha success/expiry
- Client-side validation before submission
- Form reset after successful submission

### Backend (`app/src/routes/api/contact/index.ts`)
- Validates all form fields
- Sanitizes user input
- Checks hCaptcha token presence
- Formats data for Web3Forms
- Sends via Web3Forms API

### Global Scripts (`app/src/root.tsx`)
- hCaptcha library loaded globally
- Callback functions for captcha events
- Hidden input management for token
- Custom events for Qwik integration

## Security Features

- ✅ **hCaptcha verification** prevents bot submissions
- ✅ **Input sanitization** prevents XSS attacks
- ✅ **Server-side validation** ensures data integrity
- ✅ **CSRF protection** through Qwik's built-in security
- ✅ **Required consent** for GDPR compliance
- ✅ **Email validation** prevents invalid addresses
- ✅ **Phone validation** ensures proper format

## Testing

### Local Testing
1. Navigate to the contact section on the homepage
2. Fill out all required fields
3. Complete the hCaptcha challenge
4. Submit the form
5. Check for success message
6. Verify email arrives at info@kps-interiery.cz

### Production Testing
- Form works immediately after deployment
- No environment variables needed
- No API keys to configure
- Web3Forms handles all email delivery

## Troubleshooting

### Form not submitting
- Check that all required fields are filled
- Ensure hCaptcha is completed
- Check browser console for errors
- Verify consent checkbox is checked

### hCaptcha not loading
- Check internet connection
- Ensure hCaptcha script is loaded in root.tsx
- Check browser console for script errors
- Verify site key is correct

### Emails not arriving
- Check spam/junk folder
- Verify recipient email in Web3Forms dashboard
- Check server logs for API errors
- Ensure Web3Forms access key is valid

### Styling issues
- Verify CSS custom properties are defined
- Check backdrop-filter browser support
- Test on different screen sizes
- Clear browser cache

## Advantages Over Previous Setup

✅ **Simpler**: No API keys or environment variables needed
✅ **Cheaper**: Web3Forms free tier vs Resend paid
✅ **More Secure**: Built-in hCaptcha spam protection
✅ **Better UX**: Clear captcha widget for users
✅ **Easier Maintenance**: No email service to manage
✅ **Reliable**: Web3Forms handles email delivery

## Support

For issues with:
- **Web3Forms**: https://web3forms.com/
- **hCaptcha**: https://www.hcaptcha.com/
- **Contact form functionality**: Check application logs

---

**Last Updated**: 2025-10-05
**Service**: Web3Forms + hCaptcha
**Email Destination**: info@kps-interiery.cz
