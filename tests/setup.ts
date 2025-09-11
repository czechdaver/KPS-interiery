import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables
vi.stubEnv('BASE_URL', '');
vi.stubEnv('RESEND_API_KEY', 'test-key');

// Mock global fetch for tests
global.fetch = vi.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock PhotoSwipe
vi.mock('photoswipe', () => ({
  default: vi.fn().mockImplementation(() => ({
    init: vi.fn(),
    destroy: vi.fn(),
    close: vi.fn(),
    next: vi.fn(),
    prev: vi.fn()
  }))
}));

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});