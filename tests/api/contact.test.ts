import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { onPost } from '../../app/src/routes/api/contact/index';

// Mock Resend
const mockResendSend = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: mockResendSend
    }
  }))
}));

// Test data
const validFormData = {
  name: 'Jan Novák',
  email: 'jan.novak@example.com',
  phone: '+420 123 456 789',
  projectType: 'kitchen',
  description: 'Rádi bychom realizovali novou kuchyň v našem bytě.',
  budget: '100000',
  timeline: '3-6months',
  consent: true
};

const createMockRequest = (data: any) => ({
  json: () => Promise.resolve(data)
} as Request);

const createMockJson = () => {
  const jsonResponses: Array<{ status: number; data: any }> = [];
  const json = vi.fn((status: number, data: any) => {
    jsonResponses.push({ status, data });
  });
  return { json, jsonResponses };
};

describe('Contact API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('Successful submissions', () => {
    it('should handle valid form submission', async () => {
      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(validFormData);

      mockResendSend.mockResolvedValueOnce({
        data: { id: 'email-123' }
      });

      await onPost({ 
        json, 
        request,
        // Add other required properties with minimal mocks
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses).toHaveLength(1);
      expect(jsonResponses[0].status).toBe(200);
      expect(jsonResponses[0].data.success).toBe(true);
      expect(jsonResponses[0].data.message).toContain('úspěšně odeslána');
      
      expect(mockResendSend).toHaveBeenCalledWith({
        from: 'KPS Interiéry <noreply@kpsinteriery.cz>',
        to: ['david@motalik.cz'],
        subject: expect.stringContaining('Jan Novák'),
        html: expect.stringContaining('Jan Novák'),
        replyTo: 'jan.novak@example.com'
      });
    });

    it('should work in mock mode without RESEND_API_KEY', async () => {
      vi.stubEnv('RESEND_API_KEY', ''); // Empty API key triggers mock mode
      
      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(validFormData);

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: () => undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(200);
      expect(jsonResponses[0].data.success).toBe(true);
      expect(mockResendSend).not.toHaveBeenCalled();
    });
  });

  describe('Validation errors', () => {
    it('should reject missing required fields', async () => {
      const incompleteData = { ...validFormData };
      delete incompleteData.name;

      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(incompleteData);

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(400);
      expect(jsonResponses[0].data.success).toBe(false);
      expect(jsonResponses[0].data.message).toContain('povinná pole');
    });

    it('should reject missing consent', async () => {
      const dataWithoutConsent = { ...validFormData, consent: false };

      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(dataWithoutConsent);

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(400);
      expect(jsonResponses[0].data.message).toContain('souhlasit');
    });

    it('should validate email format', async () => {
      const invalidEmailData = { ...validFormData, email: 'invalid-email' };

      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(invalidEmailData);

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(400);
      expect(jsonResponses[0].data.message).toContain('Neplatný formát');
    });

    it('should validate phone format', async () => {
      const invalidPhoneData = { ...validFormData, phone: '123' };

      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(invalidPhoneData);

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(400);
      expect(jsonResponses[0].data.message).toContain('telefonního čísla');
    });
  });

  describe('Email validation helpers', () => {
    const testCases = [
      { email: 'test@example.com', valid: true },
      { email: 'user.name@domain.co.uk', valid: true },
      { email: 'invalid-email', valid: false },
      { email: '@domain.com', valid: false },
      { email: 'user@', valid: false },
      { email: 'user@domain', valid: false },
      { email: '', valid: false }
    ];

    testCases.forEach(({ email, valid }) => {
      it(`should ${valid ? 'accept' : 'reject'} email: ${email}`, async () => {
        const testData = { ...validFormData, email };
        const { json, jsonResponses } = createMockJson();
        const request = createMockRequest(testData);

        if (valid) {
          mockResendSend.mockResolvedValueOnce({ data: { id: 'test' } });
        }

        await onPost({ 
          json, 
          request,
          url: new URL('http://localhost/api/contact'),
          params: {},
          headers: new Headers(),
          method: 'POST',
          signal: new AbortController().signal,
          env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
          platform: {},
          clientConn: { ip: '127.0.0.1' },
          locale: () => 'cs',
          redirect: vi.fn(),
          error: vi.fn(),
          text: vi.fn(),
          html: vi.fn(),
          parseBody: vi.fn(),
          cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
          sharedMap: new Map(),
          defer: vi.fn(),
          fail: vi.fn(),
          exit: vi.fn()
        });

        if (valid) {
          expect(jsonResponses[0].status).toBe(200);
        } else {
          expect(jsonResponses[0].status).toBe(400);
        }
      });
    });
  });

  describe('Phone validation helpers', () => {
    const phoneTestCases = [
      { phone: '+420 123 456 789', valid: true },
      { phone: '123456789', valid: true },
      { phone: '+1 (555) 123-4567', valid: true },
      { phone: '123', valid: false },
      { phone: 'abc123456789', valid: false },
      { phone: '', valid: false }
    ];

    phoneTestCases.forEach(({ phone, valid }) => {
      it(`should ${valid ? 'accept' : 'reject'} phone: ${phone}`, async () => {
        const testData = { ...validFormData, phone };
        const { json, jsonResponses } = createMockJson();
        const request = createMockRequest(testData);

        if (valid) {
          mockResendSend.mockResolvedValueOnce({ data: { id: 'test' } });
        }

        await onPost({ 
          json, 
          request,
          url: new URL('http://localhost/api/contact'),
          params: {},
          headers: new Headers(),
          method: 'POST',
          signal: new AbortController().signal,
          env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
          platform: {},
          clientConn: { ip: '127.0.0.1' },
          locale: () => 'cs',
          redirect: vi.fn(),
          error: vi.fn(),
          text: vi.fn(),
          html: vi.fn(),
          parseBody: vi.fn(),
          cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
          sharedMap: new Map(),
          defer: vi.fn(),
          fail: vi.fn(),
          exit: vi.fn()
        });

        if (valid) {
          expect(jsonResponses[0].status).toBe(200);
        } else {
          expect(jsonResponses[0].status).toBe(400);
        }
      });
    });
  });

  describe('Input sanitization', () => {
    it('should sanitize HTML tags from inputs', async () => {
      const maliciousData = {
        ...validFormData,
        name: '<script>alert("xss")</script>John Doe',
        description: '<img src="x" onerror="alert(1)">Normal description'
      };

      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(maliciousData);

      mockResendSend.mockResolvedValueOnce({ data: { id: 'test' } });

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(200);
      
      const emailCall = mockResendSend.mock.calls[0][0];
      expect(emailCall.html).not.toContain('<script>');
      expect(emailCall.html).not.toContain('<img src="x"');
      expect(emailCall.html).toContain('John Doe');
    });
  });

  describe('Error handling', () => {
    it('should handle Resend API errors', async () => {
      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(validFormData);

      mockResendSend.mockResolvedValueOnce({
        error: { message: 'API Error' }
      });

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(500);
      expect(jsonResponses[0].data.success).toBe(false);
    });

    it('should handle JSON parsing errors', async () => {
      const { json, jsonResponses } = createMockJson();
      const request = {
        json: () => Promise.reject(new Error('Invalid JSON'))
      } as Request;

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(500);
      expect(jsonResponses[0].data.success).toBe(false);
      expect(jsonResponses[0].data.message).toContain('neočekávaná chyba');
    });

    it('should handle network errors', async () => {
      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(validFormData);

      mockResendSend.mockRejectedValueOnce(new Error('Network error'));

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      expect(jsonResponses[0].status).toBe(500);
      expect(jsonResponses[0].data.success).toBe(false);
    });
  });

  describe('Email content generation', () => {
    it('should generate properly formatted email HTML', async () => {
      const { json, jsonResponses } = createMockJson();
      const request = createMockRequest(validFormData);

      mockResendSend.mockResolvedValueOnce({ data: { id: 'test' } });

      await onPost({ 
        json, 
        request,
        url: new URL('http://localhost/api/contact'),
        params: {},
        headers: new Headers(),
        method: 'POST',
        signal: new AbortController().signal,
        env: { get: (key: string) => key === 'RESEND_API_KEY' ? 'test-key' : undefined },
        platform: {},
        clientConn: { ip: '127.0.0.1' },
        locale: () => 'cs',
        redirect: vi.fn(),
        error: vi.fn(),
        text: vi.fn(),
        html: vi.fn(),
        parseBody: vi.fn(),
        cookie: { get: vi.fn(), set: vi.fn(), delete: vi.fn(), has: vi.fn() },
        sharedMap: new Map(),
        defer: vi.fn(),
        fail: vi.fn(),
        exit: vi.fn()
      });

      const emailCall = mockResendSend.mock.calls[0][0];
      
      expect(emailCall.html).toContain('<!DOCTYPE html>');
      expect(emailCall.html).toContain('Jan Novák');
      expect(emailCall.html).toContain('jan.novak@example.com');
      expect(emailCall.html).toContain('+420 123 456 789');
      expect(emailCall.html).toContain('Kuchyň'); // Formatted project type
      expect(emailCall.html).toContain('50 000 - 100 000 Kč'); // Formatted budget
      expect(emailCall.html).toContain('3-6 měsíců'); // Formatted timeline
    });
  });
});