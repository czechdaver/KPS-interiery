# Testing Documentation - KPS Interiéry

This directory contains comprehensive tests for the KPS Interiéry website built with Qwik.

## Test Structure

```
tests/
├── components/          # Component unit tests
├── lib/                # Library/utility function tests  
├── api/                # API endpoint tests
├── integration/        # Integration tests
├── performance/        # Performance tests
├── security/          # Security and validation tests
├── e2e/               # End-to-end tests with Playwright
├── setup.ts           # Global test setup
├── vitest.config.ts   # Vitest configuration
├── playwright.config.ts # Playwright configuration
└── global-setup.ts    # Playwright global setup
```

## Test Types

### Unit Tests
- **Location**: `components/`, `lib/`, `api/`
- **Framework**: Vitest with JSDOM
- **Purpose**: Test individual functions and components in isolation
- **Coverage**: 
  - Gallery library functions (`lib/gallery.test.ts`)
  - ResponsiveImage component (`components/ResponsiveImage.test.tsx`)
  - Contact API endpoint (`api/contact.test.ts`)

### Integration Tests
- **Location**: `integration/`
- **Framework**: Vitest
- **Purpose**: Test component interactions and data flow
- **Coverage**:
  - Gallery loading workflows
  - Image optimization pipeline
  - Error recovery scenarios

### Performance Tests
- **Location**: `performance/`
- **Framework**: Vitest with performance APIs
- **Purpose**: Validate performance requirements
- **Coverage**:
  - Image loading optimization
  - URL generation efficiency
  - Memory management
  - Large dataset handling

### Security Tests
- **Location**: `security/`
- **Framework**: Vitest
- **Purpose**: Validate input sanitization and security measures
- **Coverage**:
  - XSS prevention
  - SQL injection prevention
  - Input validation
  - Rate limiting considerations
  - CSRF protection

### End-to-End Tests
- **Location**: `e2e/`
- **Framework**: Playwright
- **Purpose**: Test complete user workflows
- **Coverage**:
  - Gallery interaction flows
  - Responsive behavior
  - Accessibility compliance
  - Error handling
  - Performance benchmarks

## Running Tests

### Prerequisites
```bash
cd app
npm install
```

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run with UI
npm run test:ui

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### End-to-End Tests
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run e2e

# Run with UI mode
npm run e2e:ui

# Run in headed mode (see browser)
npm run e2e:headed

# Debug mode
npm run e2e:debug
```

### All Tests
```bash
# Run everything
npm run test:all

# CI mode (with coverage)
npm run test:ci
```

## Test Configuration

### Vitest Configuration
- **File**: `vitest.config.ts`
- **Environment**: JSDOM for DOM testing
- **Coverage**: V8 provider with HTML reports
- **Thresholds**: 80% line coverage, 75% branch coverage
- **Timeout**: 10 seconds per test

### Playwright Configuration  
- **File**: `playwright.config.ts`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome/Safari
- **Base URL**: `http://localhost:5173` (configurable)
- **Reports**: HTML, JSON, and line reports
- **Timeout**: 30 seconds per test

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect, vi } from 'vitest';
import { loadGalleryData } from '../../app/src/lib/gallery';

describe('Gallery Library', () => {
  it('should load gallery data successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await loadGalleryData('test-gallery');
    expect(result).toBeDefined();
  });
});
```

### Component Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { ResponsiveImage } from '../../app/src/components/ResponsiveImage';

describe('ResponsiveImage', () => {
  it('should render with optimized sources', async () => {
    const { render } = await createDOM();
    
    await render(
      <ResponsiveImage 
        src="/test/image.jpg"
        alt="Test image"
      />
    );

    const picture = document.querySelector('picture');
    expect(picture).toBeTruthy();
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('should open gallery lightbox', async ({ page }) => {
  await page.goto('/');
  
  const portfolioItem = page.locator('.portfolio-item').first();
  await portfolioItem.hover();
  
  const viewButton = portfolioItem.locator('.portfolio-view-btn');
  await viewButton.click();
  
  // Verify lightbox opens
});
```

## Coverage Requirements

### Minimum Coverage Thresholds
- **Statements**: 80%
- **Branches**: 75% 
- **Functions**: 80%
- **Lines**: 80%

### Excluded from Coverage
- Node modules
- Build artifacts
- Configuration files
- Type definitions

## Mocking Strategy

### Global Mocks (in `setup.ts`)
- `fetch` API for HTTP requests
- `ResizeObserver` for layout tests
- `matchMedia` for responsive tests
- PhotoSwipe library for lightbox tests

### Test-Specific Mocks
- Resend API for email tests
- Image loading for performance tests
- Network conditions for E2E tests

## Performance Benchmarks

### Image Loading
- URL generation: <50ms for 100 images
- Concurrent operations: <25ms for 20 parallel tasks
- Memory usage: <1MB increase for 1000 operations

### Gallery Loading
- Single gallery: <100ms
- Multiple galleries: <200ms for 4 galleries
- Error recovery: graceful handling within 1 second

## Security Testing

### Input Validation
- XSS prevention in all form fields
- SQL injection attempts blocked
- Unicode normalization handled
- Buffer overflow protection

### API Security
- CSRF protection validated
- Rate limiting considerations
- Environment variable security
- Error message sanitization

## Accessibility Testing

### Automated Checks
- ARIA labels and attributes
- Keyboard navigation
- Screen reader compatibility
- High contrast mode support

### Manual Testing Guidelines
- Test with screen readers
- Navigate using only keyboard
- Verify color contrast ratios
- Check focus management

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: |
    npm install
    npm run test:ci
    npm run e2e

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## Debugging Tests

### Unit Tests
- Use `test.only()` to run single tests
- Add `console.log()` statements
- Use VS Code debugger with Vitest extension

### E2E Tests  
- Run with `--headed` to see browser
- Use `--debug` for step-by-step debugging
- Check network tab in browser dev tools
- Use `page.pause()` for manual inspection

### Common Issues
- **Timeout errors**: Increase timeout in config
- **Element not found**: Wait for elements with `waitFor()`
- **Network failures**: Mock or stub external requests
- **Memory leaks**: Check for proper cleanup in tests

## Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Keep tests focused and atomic
- Clean up after each test

### Performance
- Mock heavy operations
- Use `beforeEach` for common setup
- Avoid unnecessary DOM operations
- Clean up event listeners

### Maintainability
- Use page object model for E2E tests
- Create reusable test utilities
- Keep test data consistent
- Document complex test scenarios

## Contributing

When adding new tests:
1. Follow existing patterns and naming conventions
2. Include both positive and negative test cases
3. Add performance tests for new features
4. Update this documentation for major changes
5. Ensure all tests pass before submitting PR

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Qwik Testing Guide](https://qwik.builder.io/docs/testing/)