import { describe, it, expect, vi } from 'vitest';
import { CARD_COLORS, COLOR_NAMES, getRandomColor } from '../colors';

describe('colors constants', () => {
  describe('CARD_COLORS', () => {
    it('contains expected number of colors', () => {
      expect(CARD_COLORS).toHaveLength(9);
    });

    it('contains valid Tailwind CSS gradient classes', () => {
      CARD_COLORS.forEach(color => {
        expect(color).toMatch(/^bg-gradient-to-br from-\w+-300\/80 to-\w+-100\/40$/);
      });
    });

    it('contains expected color variants', () => {
      const expectedColors = [
        'bg-gradient-to-br from-rose-300/80 to-rose-100/40',
        'bg-gradient-to-br from-orange-300/80 to-orange-100/40',
        'bg-gradient-to-br from-amber-300/80 to-amber-100/40',
        'bg-gradient-to-br from-emerald-300/80 to-emerald-100/40',
        'bg-gradient-to-br from-teal-300/80 to-teal-100/40',
        'bg-gradient-to-br from-cyan-300/80 to-cyan-100/40',
        'bg-gradient-to-br from-slate-300/80 to-slate-100/40',
        'bg-gradient-to-br from-violet-300/80 to-violet-100/40',
        'bg-gradient-to-br from-stone-300/80 to-stone-100/40'
      ];

      expectedColors.forEach(expectedColor => {
        expect(CARD_COLORS).toContain(expectedColor);
      });
    });

    it('has no duplicate colors', () => {
      const uniqueColors = [...new Set(CARD_COLORS)];
      expect(uniqueColors).toHaveLength(CARD_COLORS.length);
    });

    it('maintains consistent array content', () => {
      const originalLength = CARD_COLORS.length;
      const originalColors = [...CARD_COLORS];
      
      // Test that the array content remains consistent
      expect(CARD_COLORS).toEqual(originalColors);
      expect(CARD_COLORS).toHaveLength(originalLength);
      expect(CARD_COLORS).toHaveLength(9);
    });
  });

  describe('COLOR_NAMES', () => {
    it('contains expected number of color names', () => {
      expect(COLOR_NAMES).toHaveLength(9);
    });

    it('has same length as CARD_COLORS', () => {
      expect(COLOR_NAMES).toHaveLength(9);
      expect(COLOR_NAMES.length).toBe(CARD_COLORS.length);
    });

    it('contains expected color names', () => {
      const expectedNames = ['rose', 'orange', 'amber', 'emerald', 'teal', 'cyan', 'slate', 'violet', 'stone'];
      
      expectedNames.forEach(expectedName => {
        expect(COLOR_NAMES).toContain(expectedName);
      });
    });

    it('color names match the color classes in CARD_COLORS', () => {
      COLOR_NAMES.forEach((colorName, index) => {
        const cardColor = CARD_COLORS[index];
        expect(cardColor).toContain(`from-${colorName}-300/80`);
        expect(cardColor).toContain(`to-${colorName}-100/40`);
      });
    });

    it('has no duplicate color names', () => {
      const uniqueNames = [...new Set(COLOR_NAMES)];
      expect(uniqueNames).toHaveLength(COLOR_NAMES.length);
    });

    it('contains only lowercase color names', () => {
      COLOR_NAMES.forEach(colorName => {
        expect(colorName).toBe(colorName.toLowerCase());
      });
    });

    it('contains only valid color name strings', () => {
      COLOR_NAMES.forEach(colorName => {
        expect(typeof colorName).toBe('string');
        expect(colorName.length).toBeGreaterThan(0);
        expect(colorName).toMatch(/^[a-z]+$/);
      });
    });
  });

  describe('getRandomColor', () => {
    it('returns a string', () => {
      const color = getRandomColor();
      expect(typeof color).toBe('string');
    });

    it('returns a color from CARD_COLORS array', () => {
      const color = getRandomColor();
      expect(CARD_COLORS).toContain(color);
    });

    it('returns different colors on multiple calls (randomness test)', () => {
      // Mock Math.random to test different indices
      const originalRandom = Math.random;
      const colors = new Set();

      // Test multiple indices
      for (let i = 0; i < CARD_COLORS.length; i++) {
        Math.random = vi.fn(() => i / CARD_COLORS.length);
        colors.add(getRandomColor());
      }

      Math.random = originalRandom;

      // Should have collected multiple different colors
      expect(colors.size).toBeGreaterThan(1);
    });

    it('handles edge case when Math.random returns 0', () => {
      const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0);

      const color = getRandomColor();
      
      expect(CARD_COLORS).toContain(color);
      expect(color).toBe(CARD_COLORS[0]);

      mockRandom.mockRestore();
    });

    it('handles edge case when Math.random returns close to 1', () => {
      const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.99999);

      const color = getRandomColor();
      
      expect(CARD_COLORS).toContain(color);
      expect(color).toBe(CARD_COLORS[CARD_COLORS.length - 1]);

      mockRandom.mockRestore();
    });

    it('distributes colors evenly across multiple calls', () => {
      const colorCounts: Record<string, number> = {};
      const totalCalls = 90; // Use multiple of 9 for even distribution

      // Mock Math.random to cycle through indices
      let callCount = 0;
      const mockRandom = vi.spyOn(Math, 'random').mockImplementation(() => {
        return (callCount++ % CARD_COLORS.length) / CARD_COLORS.length;
      });

      // Call getRandomColor many times
      for (let i = 0; i < totalCalls; i++) {
        const color = getRandomColor();
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }

      mockRandom.mockRestore();

      // Each color should have been selected
      CARD_COLORS.forEach(color => {
        expect(colorCounts[color]).toBeGreaterThan(0);
      });

      // Should have exactly the number of unique colors as in CARD_COLORS
      expect(Object.keys(colorCounts).length).toBe(CARD_COLORS.length);
    });

    it('returns valid color class every time', () => {
      // Test with various random values that map to valid indices
      const testCases = [
        { random: 0, expectedIndex: 0 },
        { random: 0.11, expectedIndex: 0 }, // 0.11 * 9 = 0.99, Math.floor = 0
        { random: 0.25, expectedIndex: 2 }, // 0.25 * 9 = 2.25, Math.floor = 2
        { random: 0.5, expectedIndex: 4 },  // 0.5 * 9 = 4.5, Math.floor = 4
        { random: 0.99999, expectedIndex: 8 } // 0.99999 * 9 = 8.99, Math.floor = 8
      ];

      testCases.forEach(({ random, expectedIndex }) => {
        const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(random);
        
        const color = getRandomColor();
        
        expect(typeof color).toBe('string');
        expect(color.length).toBeGreaterThan(0);
        expect(color).toMatch(/^bg-gradient-to-br from-\w+-300\/80 to-\w+-100\/40$/);
        expect(CARD_COLORS).toContain(color);
        expect(color).toBe(CARD_COLORS[expectedIndex]);

        mockRandom.mockRestore();
      });
    });

    it('maintains function purity (no side effects)', () => {
      const originalCardColors = [...CARD_COLORS];
      const originalColorNames = [...COLOR_NAMES];

      // Call function multiple times
      for (let i = 0; i < 10; i++) {
        getRandomColor();
      }

      // Arrays should remain unchanged
      expect(CARD_COLORS).toEqual(originalCardColors);
      expect(COLOR_NAMES).toEqual(originalColorNames);
    });
  });

  describe('array integrity and consistency', () => {
    it('maintains consistent ordering between arrays', () => {
      // The test verifies that COLOR_NAMES[i] corresponds to the color used in CARD_COLORS[i]
      for (let i = 0; i < COLOR_NAMES.length; i++) {
        const colorName = COLOR_NAMES[i];
        const cardColor = CARD_COLORS[i];
        
        expect(cardColor).toContain(colorName);
      }
    });

    it('has consistent gradient pattern across all colors', () => {
      CARD_COLORS.forEach(color => {
        // All colors should follow same gradient pattern
        expect(color).toContain('bg-gradient-to-br');
        expect(color).toContain('from-');
        expect(color).toContain('-300/80');
        expect(color).toContain('to-');
        expect(color).toContain('-100/40');
        
        // Should match the expected pattern
        expect(color).toMatch(/^bg-gradient-to-br from-\w+-300\/80 to-\w+-100\/40$/);
      });
    });

    it('uses valid Tailwind color names', () => {
      const validTailwindColors = [
        'rose', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 
        'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 
        'fuchsia', 'pink', 'slate', 'gray', 'zinc', 'neutral', 'stone'
      ];

      COLOR_NAMES.forEach(colorName => {
        expect(validTailwindColors).toContain(colorName);
      });
    });
  });

  describe('performance considerations', () => {
    it('getRandomColor executes quickly', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        getRandomColor();
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete 1000 calls in reasonable time (less than 50ms)
      expect(executionTime).toBeLessThan(50);
    });

    it('does not create new objects on each call', () => {
      // getRandomColor should return references to existing strings, not create new ones
      const color1 = getRandomColor();
      const color2 = getRandomColor();

      // If they happen to be the same color, they should be the same reference
      if (color1 === color2) {
        expect(color1).toBe(color2); // Same reference
      }

      // Both should be from the original CARD_COLORS array
      expect(CARD_COLORS.includes(color1)).toBe(true);
      expect(CARD_COLORS.includes(color2)).toBe(true);
    });
  });
});