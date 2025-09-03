# Cookie Bar - GDPR Compliance Documentation

## Overview
The CookieBar component provides GDPR-compliant cookie consent management for the KPS Interiéry website, designed for 2025 EU regulations compliance.

## Features

### GDPR Compliance
- ✅ **Granular Consent**: Users can select specific cookie categories
- ✅ **Opt-in by Default**: Non-essential cookies require explicit consent
- ✅ **Clear Information**: Detailed descriptions for each cookie category
- ✅ **Consent Withdrawal**: Users can change preferences anytime
- ✅ **Consent Logging**: Stores consent with timestamp for compliance records

### Cookie Categories
1. **Necessary** (Always enabled)
   - Essential for website functionality
   - Cannot be disabled
   
2. **Analytics** (Optional)
   - Google Analytics 4 integration
   - Anonymous usage data collection
   - Website performance improvement
   
3. **Marketing** (Optional)
   - Advertising and retargeting
   - Campaign effectiveness tracking
   
4. **Preferences** (Optional)
   - User personalization
   - Settings storage

## Setup Instructions

### 1. Google Analytics Configuration

**IMPORTANT**: You must replace the placeholder Google Analytics ID with your actual measurement ID.

In `/src/components/CookieBar.tsx`, find this line:
```typescript
script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
```

And this line:
```typescript
gtag('config', 'GA_MEASUREMENT_ID', {
```

Replace `GA_MEASUREMENT_ID` with your actual Google Analytics 4 measurement ID (format: `G-XXXXXXXXXX`).

**Example:**
```typescript
script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ0';
gtag('config', 'G-ABC123XYZ0', {
```

### 2. Privacy Policy Integration

Update the privacy policy link in the cookie bar text:
```typescript
<a href="#privacy" target="_blank">Zásady ochrany osobních údajů</a>
```

Replace `#privacy` with the actual URL to your privacy policy page.

### 3. Implementation

The cookie bar is automatically included in the main layout:
```typescript
// In /src/routes/index.tsx
import { CookieBar } from "../components/CookieBar";

// Added at the end of the JSX
<CookieBar />
```

## User Experience Flow

### Initial Visit
1. Cookie bar appears after 1-second delay at bottom of screen
2. Three options presented:
   - **"Přijmout vše"** - Accept all cookies
   - **"Nastavení"** - Open detailed settings modal
   - **"Pouze nezbytné"** - Accept only necessary cookies

### Settings Modal
1. Users can toggle individual cookie categories
2. Detailed descriptions explain each category's purpose
3. Necessary cookies are always enabled (cannot be toggled)
4. Users can save custom preferences

### Consent Storage
- Preferences stored in `localStorage` as `cookie-consent`
- Timestamp stored as `cookie-consent-date`
- Consent persists across browser sessions
- Users can modify preferences by reopening settings

## Technical Implementation

### State Management
```typescript
interface CookieConsent {
  necessary: boolean;    // Always true
  analytics: boolean;    // User choice
  marketing: boolean;    // User choice
  preferences: boolean;  // User choice
}
```

### Analytics Integration
Google Analytics 4 is only loaded when user consents to analytics cookies:
```typescript
const initializeAnalytics = $(() => {
  // Only runs when analytics consent is true
  // Loads GA4 with privacy-focused configuration
});
```

### Privacy Configuration
GA4 is configured with privacy-focused settings:
```typescript
gtag('config', 'GA_MEASUREMENT_ID', {
  anonymize_ip: true,                    // IP anonymization
  cookie_flags: 'SameSite=None;Secure'   // Secure cookie settings
});
```

## Design Integration

### Visual Design
- Uses brand colors (`--primary`, `--secondary`)
- Glassmorphism effects with backdrop blur
- Montserrat font for headings, Cabin for body text
- Phosphor Icons for visual consistency

### Responsive Behavior
- **Desktop**: Horizontal layout with side-by-side text and buttons
- **Mobile**: Vertical stack layout with centered buttons
- **Modal**: Full-screen overlay with scrollable content

### Animations
- Smooth slide-up entrance from bottom
- Modal scale-in animation
- Hover effects on buttons and toggles
- CSS transitions using brand timing functions

## Compliance Notes

### Data Processing Basis
- **Necessary cookies**: Legitimate interest (essential functionality)
- **Analytics cookies**: User consent required
- **Marketing cookies**: User consent required
- **Preference cookies**: User consent required

### Consent Requirements
- Must be freely given, specific, informed, and unambiguous
- Users must be able to withdraw consent as easily as they gave it
- Consent must be documented with timestamp
- Users must be informed about data processing purposes

### Record Keeping
The component automatically stores:
- User consent choices (`cookie-consent`)
- Consent timestamp (`cookie-consent-date`)
- These records help demonstrate compliance during audits

## Customization

### Styling
All styles are scoped within the component. To customize:
1. Modify the `styles` constant in `CookieBar.tsx`
2. Update color variables to match brand guidelines
3. Adjust spacing and typography as needed

### Content
Update Czech text strings in the component:
- Cookie category names and descriptions
- Button labels and messages
- Modal headings and explanations

### Analytics Provider
To use different analytics providers:
1. Replace the `initializeAnalytics` function
2. Update the integration logic for your chosen provider
3. Ensure privacy-focused configuration

## Testing Checklist

### Functionality
- [ ] Cookie bar appears on first visit
- [ ] Consent choices are saved and persisted
- [ ] Analytics only loads when consented
- [ ] Settings modal works correctly
- [ ] All buttons function properly

### GDPR Compliance
- [ ] Granular consent options available
- [ ] Clear descriptions of cookie purposes
- [ ] Easy consent withdrawal
- [ ] No pre-ticked boxes for non-essential cookies
- [ ] Consent timestamp recorded

### User Experience
- [ ] Mobile responsive design
- [ ] Accessible keyboard navigation
- [ ] Clear visual hierarchy
- [ ] Smooth animations
- [ ] Fast loading performance

## Maintenance

### Regular Updates
- Review and update cookie descriptions annually
- Monitor GDPR regulation changes
- Update Google Analytics configuration as needed
- Test functionality after website updates

### Analytics Monitoring
- Verify GA4 data collection is working
- Check that consent rates are reasonable
- Monitor for any privacy-related issues
- Ensure data retention policies are followed

---

**Last Updated**: 2025-01-15  
**Version**: 1.0  
**GDPR Compliance**: 2025 EU Regulations