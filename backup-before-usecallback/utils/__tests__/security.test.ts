import { describe, it, expect } from 'vitest';
import { validateInput, isValidTitle, isValidContent } from '../security';

describe('Security Utils', () => {
  describe('validateInput', () => {
    it('should sanitize and trim input', () => {
      const input = '  <script>alert("xss")</script>Hello World  ';
      const result = validateInput(input, 1000, true);
      expect(result).toBe('Hello World');
      expect(result).not.toContain('<script>');
    });

    it('should respect max length', () => {
      const longInput = 'a'.repeat(200);
      const result = validateInput(longInput, 100);
      expect(result).toHaveLength(100);
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

    it('should trim by default', () => {
      const input = '  Hello World  ';
      const result = validateInput(input);
      expect(result).toBe('Hello World');
    });

    it('should remove HTML tags but keep content', () => {
      const htmlInput = '<div><p>Hello <strong>World</strong></p></div>';
      const result = validateInput(htmlInput);
      expect(result).toBe('Hello World');
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
});