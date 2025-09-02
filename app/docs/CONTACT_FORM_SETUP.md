# Contact Form Setup Guide

## Overview

The contact form has been completely modernized with:
- **Modern glassmorphism design** matching the rest of the website
- **Working email functionality** that sends messages to david@motalik.cz
- **Comprehensive form validation** with user feedback
- **Responsive design** optimized for all devices
- **Professional email templates** with proper formatting

## Features

### 🎨 Modern Design
- **Glassmorphism effects** with backdrop filters and transparency
- **Gradient text effects** for headings
- **Smooth animations** and hover effects
- **Floating background elements** with subtle animations
- **Consistent styling** with the rest of the website

### 📧 Email Integration
- **Resend API integration** for reliable email delivery
- **Professional HTML email templates** with proper formatting
- **Email validation** and sanitization
- **Error handling** with user-friendly messages
- **Fallback mode** when API key is not configured (logs to console)

### ✅ Form Validation
- **Client-side validation** for immediate feedback
- **Server-side validation** for security
- **Required field validation**
- **Email format validation**
- **Phone number format validation**
- **Consent checkbox requirement**
- **Input sanitization** to prevent XSS attacks

## Email Setup Instructions

### 1. Get Resend API Key
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables
1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Add your Resend API key:
```env
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_TO=david@motalik.cz
EMAIL_FROM_DOMAIN=kpsinteriery.cz
```

### 3. Domain Verification (for production)
1. In Resend dashboard, go to Domains
2. Add your domain (kpsinteriery.cz)
3. Follow DNS verification steps
4. Update the `from` field in the API to use your verified domain

## Form Fields

The contact form includes these fields:
- **Name** (required) - Customer's full name
- **Phone** (required) - Contact phone number
- **Email** (required) - Customer's email address
- **Project Type** (optional) - Kitchen, Wardrobe, Bathroom, Office, Other
- **Description** (required) - Detailed project description
- **Budget** (optional) - Price range selection
- **Timeline** (optional) - When they want the project completed
- **Consent** (required) - GDPR compliance checkbox

## Email Template

The system sends a professionally formatted HTML email with:
- **Branded header** with KPS Interiéry styling
- **Complete form data** in an easy-to-read format
- **Customer contact details** with clickable links
- **Project details** with formatted description
- **Timestamp** of when the form was submitted
- **Reply-to** set to customer's email for easy response

## Development Mode

Without a Resend API key, the form will:
- ✅ Still work and validate properly
- 📝 Log email content to the console
- ✅ Show success message to users
- 🔧 Perfect for development and testing

## Production Deployment

For live deployment:
1. Set the `RESEND_API_KEY` environment variable
2. Verify your domain with Resend
3. Update the `from` email address to use your domain
4. Test the form to ensure emails are delivered

## Styling Customization

The form uses CSS custom properties for easy theming:
- `--primary` - Primary brand color
- `--accent` - Accent/orange color
- `--white` - White color
- `--gray` - Text gray color
- `--radius-*` - Border radius values
- `--transition` - Standard transition timing

## Security Features

- ✅ **Input sanitization** to prevent XSS
- ✅ **CSRF protection** through Qwik's built-in security
- ✅ **Rate limiting** can be added at server level
- ✅ **Email validation** prevents spam
- ✅ **Required consent** for GDPR compliance

## Testing

The form can be tested by:
1. Filling out all required fields
2. Submitting the form
3. Checking console logs (development mode)
4. Verifying email delivery (with API key configured)

## Troubleshooting

### Form not submitting
- Check browser console for JavaScript errors
- Ensure all required fields are filled
- Verify consent checkbox is checked

### Emails not being sent
- Check that `RESEND_API_KEY` is set correctly
- Verify domain is verified with Resend
- Check server logs for error messages
- Ensure the API endpoint is accessible

### Styling issues
- Check that CSS custom properties are defined
- Verify backdrop-filter support in browser
- Test on different screen sizes