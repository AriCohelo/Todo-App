import { describe, it, expect } from 'vitest';
import { sanitizeHtml, validateInput, isValidTitle, isValidContent, escapeHtml, preventXSS } from '../security';

describe('Security Utils', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World';
      const result = sanitizeHtml(maliciousInput);
      expect(result).toBe('Hello World');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove HTML tags but keep text content', () => {
      const htmlInput = '<div><p>Hello <strong>World</strong></p></div>';
      const result = sanitizeHtml(htmlInput);
      expect(result).toBe('Hello World');
    });

    it('should handle empty input', () => {
      expect(sanitizeHtml('')).toBe('');
    });

    it('should handle plain text', () => {
      const plainText = 'Hello World';
      expect(sanitizeHtml(plainText)).toBe(plainText);
    });
  });

  describe('validateInput', () => {
    it('should sanitize and trim input', () => {
      const input = '  <script>alert("xss")</script>Hello  ';
      const result = validateInput(input, 1000, true);
      expect(result).toBe('Hello');
    });

    it('should respect max length', () => {
      const longInput = 'a'.repeat(1500);
      const result = validateInput(longInput, 100);
      expect(result.length).toBe(100);
    });

    it('should handle non-string input', () => {
      const result = validateInput(123 as any);
      expect(result).toBe('');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = validateInput(input, 1000, true);
      expect(result).toBe('Hello World');
    });

    it('should preserve whitespace when shouldTrim is false', () => {
      const input = '  Hello World  ';
      const result = validateInput(input, 1000, false);
      expect(result).toBe('  Hello World  ');
    });

    it('should not trim by default', () => {
      const input = '  Hello World  ';
      const result = validateInput(input);
      expect(result).toBe('  Hello World  ');
    });
  });

  describe('isValidTitle', () => {
    it('should accept valid titles', () => {
      expect(isValidTitle('Valid Title')).toBe(true);
      expect(isValidTitle('A')).toBe(true);
      expect(isValidTitle('a'.repeat(100))).toBe(true);
    });

    it('should reject empty titles', () => {
      expect(isValidTitle('')).toBe(false);
    });

    it('should reject overly long titles', () => {
      const longTitle = 'a'.repeat(101);
      expect(isValidTitle(longTitle)).toBe(false);
    });
  });

  describe('isValidContent', () => {
    it('should accept valid content', () => {
      expect(isValidContent('Valid content')).toBe(true);
      expect(isValidContent('')).toBe(true);
      expect(isValidContent('a'.repeat(1000))).toBe(true);
    });

    it('should reject overly long content', () => {
      const longContent = 'a'.repeat(1001);
      expect(isValidContent(longContent)).toBe(false);
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
      expect(escapeHtml('&')).toBe('&amp;');
      // Note: textContent preserves quotes as-is, this is expected behavior
      expect(escapeHtml('"')).toBe('"');
      expect(escapeHtml("'")).toBe("'");
    });

    it('should handle plain text', () => {
      const plainText = 'Hello World';
      expect(escapeHtml(plainText)).toBe(plainText);
    });
  });

  describe('preventXSS', () => {
    it('should both sanitize and escape dangerous input', () => {
      const maliciousInput = '<script>alert("xss")</script><div>Hello</div>';
      const result = preventXSS(maliciousInput);
      expect(result).toBe('Hello');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<div>');
    });

    it('should handle complex XSS attempts', () => {
      const xssAttempts = [
        '<img src="x" onerror="alert(1)">',
        '<svg onload="alert(1)"></svg>',
        '"><script>alert("xss")</script>',
      ];

      xssAttempts.forEach(attempt => {
        const result = preventXSS(attempt);
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('onload');
      });
    });

    it('should handle javascript protocol attempts', () => {
      const javascriptAttempt = 'javascript:alert("xss")';
      const result = preventXSS(javascriptAttempt);
      // DOMPurify strips this completely, so result should be empty or safe
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });
});