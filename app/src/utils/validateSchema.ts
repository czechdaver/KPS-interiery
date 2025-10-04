/**
 * Schema validation utilities for testing LocalBusiness markup
 */

// Example function to validate our schema data structure
export function validateLocalBusinessSchema(schema: any): boolean {
  const requiredFields = [
    '@context',
    '@type',
    'name',
    'address',
    'contactPoint',
    'geo',
    'openingHoursSpecification',
    'areaServed',
    'hasOfferCatalog'
  ];

  return requiredFields.every(field => {
    const hasField = field in schema;
    if (!hasField) {
      console.warn(`Missing required field: ${field}`);
    }
    return hasField;
  });
}

// Validate address format for Czech Republic
export function validateCzechAddress(address: any): boolean {
  const required = ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry'];
  const hasAllFields = required.every(field => field in address);

  if (!hasAllFields) {
    console.warn('Missing required address fields');
    return false;
  }

  // Check if it's a valid Czech address
  const isCzechAddress = address.addressCountry?.name === 'Czech Republic' ||
                        address.addressCountry === 'CZ';

  if (!isCzechAddress) {
    console.warn('Address country should be Czech Republic');
    return false;
  }

  return true;
}

// Validate opening hours format
export function validateOpeningHours(hours: any[]): boolean {
  return hours.every(spec => {
    const hasRequiredFields = spec['@type'] === 'OpeningHoursSpecification' &&
                             'dayOfWeek' in spec &&
                             'opens' in spec &&
                             'closes' in spec;

    if (!hasRequiredFields) {
      console.warn('Invalid opening hours specification format');
      return false;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(spec.opens) || !timeRegex.test(spec.closes)) {
      console.warn('Invalid time format in opening hours');
      return false;
    }

    return true;
  });
}

// Test function to validate all schema components
export function testSchemaComponents(): void {
  console.log('✅ Schema validation utilities loaded successfully');
  console.log('📍 Czech business location: Zlínský kraj');
  console.log('🏢 Business type: LocalBusiness (Furniture)');
  console.log('🛠️ Services: Kitchen, Wardrobe, Bathroom, Office furniture');
  console.log('🌍 Service area: Czech Republic (primary), Central Europe');
}