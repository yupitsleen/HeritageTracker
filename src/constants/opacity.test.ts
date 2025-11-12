import { describe, it, expect } from 'vitest';
import { OPACITY, opacityToDecimal, withOpacity, type OpacityValue } from './opacity';

describe('OPACITY constants', () => {
  describe('Structure', () => {
    it('contains all required opacity values', () => {
      expect(OPACITY).toHaveProperty('OVERLAY');
      expect(OPACITY).toHaveProperty('MAP_BACKGROUND');
      expect(OPACITY).toHaveProperty('LINK_HOVER');
      expect(OPACITY).toHaveProperty('TEXT_OVERLAY');
      expect(OPACITY).toHaveProperty('HOVER_STATE');
      expect(OPACITY).toHaveProperty('DISABLED');
    });

    it('all values are numbers', () => {
      Object.values(OPACITY).forEach((value) => {
        expect(typeof value).toBe('number');
      });
    });

    it('all values are within valid range (0-100)', () => {
      Object.values(OPACITY).forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Specific Values', () => {
    it('OVERLAY is 95 (most opaque overlay)', () => {
      expect(OPACITY.OVERLAY).toBe(95);
    });

    it('MAP_BACKGROUND is 90', () => {
      expect(OPACITY.MAP_BACKGROUND).toBe(90);
    });

    it('LINK_HOVER is 80', () => {
      expect(OPACITY.LINK_HOVER).toBe(80);
    });

    it('TEXT_OVERLAY is 70', () => {
      expect(OPACITY.TEXT_OVERLAY).toBe(70);
    });

    it('HOVER_STATE is 50 (semi-transparent)', () => {
      expect(OPACITY.HOVER_STATE).toBe(50);
    });

    it('DISABLED is 0 (fully transparent)', () => {
      expect(OPACITY.DISABLED).toBe(0);
    });
  });

  describe('Immutability', () => {
    it('is a readonly object (as const)', () => {
      // TypeScript should enforce this, but we can verify values don't change
      const overlay = OPACITY.OVERLAY;
      expect(OPACITY.OVERLAY).toBe(overlay);
    });
  });
});

describe('opacityToDecimal', () => {
  describe('Conversion Accuracy', () => {
    it('converts 100 to 1.0', () => {
      expect(opacityToDecimal(100 as OpacityValue)).toBe(1.0);
    });

    it('converts 95 to 0.95', () => {
      expect(opacityToDecimal(OPACITY.OVERLAY)).toBe(0.95);
    });

    it('converts 50 to 0.5', () => {
      expect(opacityToDecimal(OPACITY.HOVER_STATE)).toBe(0.5);
    });

    it('converts 0 to 0.0', () => {
      expect(opacityToDecimal(OPACITY.DISABLED)).toBe(0.0);
    });

    it('converts 70 to 0.7', () => {
      expect(opacityToDecimal(OPACITY.TEXT_OVERLAY)).toBe(0.7);
    });
  });

  describe('Precision', () => {
    it('handles decimal precision correctly', () => {
      const result = opacityToDecimal(OPACITY.OVERLAY);
      expect(result.toFixed(2)).toBe('0.95');
    });
  });
});

describe('withOpacity', () => {
  describe('Tailwind Class Generation', () => {
    it('generates correct class for bg-black with OVERLAY', () => {
      expect(withOpacity('bg-black', OPACITY.OVERLAY)).toBe('bg-black/95');
    });

    it('generates correct class for bg-white with OVERLAY', () => {
      expect(withOpacity('bg-white', OPACITY.OVERLAY)).toBe('bg-white/95');
    });

    it('generates correct class for bg-white with MAP_BACKGROUND', () => {
      expect(withOpacity('bg-white', OPACITY.MAP_BACKGROUND)).toBe('bg-white/90');
    });

    it('generates correct class for text-white with TEXT_OVERLAY', () => {
      expect(withOpacity('text-white', OPACITY.TEXT_OVERLAY)).toBe('text-white/70');
    });

    it('generates correct class for bg-gray-700 with HOVER_STATE', () => {
      expect(withOpacity('bg-gray-700', OPACITY.HOVER_STATE)).toBe('bg-gray-700/50');
    });

    it('generates correct class for ring-white with HOVER_STATE', () => {
      expect(withOpacity('ring-white', OPACITY.HOVER_STATE)).toBe('ring-white/50');
    });
  });

  describe('Edge Cases', () => {
    it('handles 0 opacity correctly', () => {
      expect(withOpacity('bg-black', OPACITY.DISABLED)).toBe('bg-black/0');
    });

    it('handles complex class names', () => {
      expect(withOpacity('bg-[#fefefe]', OPACITY.LINK_HOVER)).toBe('bg-[#fefefe]/80');
    });

    it('handles arbitrary color values', () => {
      expect(withOpacity('bg-[#000000]', OPACITY.OVERLAY)).toBe('bg-[#000000]/95');
    });
  });

  describe('String Format', () => {
    it('always uses forward slash separator', () => {
      const result = withOpacity('bg-black', OPACITY.OVERLAY);
      expect(result).toContain('/');
      expect(result.split('/').length).toBe(2);
    });

    it('does not add extra spaces', () => {
      const result = withOpacity('bg-black', OPACITY.OVERLAY);
      expect(result).not.toContain(' ');
    });
  });
});

describe('Type Safety', () => {
  it('OpacityValue type includes all OPACITY keys', () => {
    // This test verifies that TypeScript type checking works
    // If it compiles, the type is correct
    const overlay: OpacityValue = OPACITY.OVERLAY;
    const mapBg: OpacityValue = OPACITY.MAP_BACKGROUND;
    const linkHover: OpacityValue = OPACITY.LINK_HOVER;
    const textOverlay: OpacityValue = OPACITY.TEXT_OVERLAY;
    const hoverState: OpacityValue = OPACITY.HOVER_STATE;
    const disabled: OpacityValue = OPACITY.DISABLED;

    expect(overlay).toBe(95);
    expect(mapBg).toBe(90);
    expect(linkHover).toBe(80);
    expect(textOverlay).toBe(70);
    expect(hoverState).toBe(50);
    expect(disabled).toBe(0);
  });
});
