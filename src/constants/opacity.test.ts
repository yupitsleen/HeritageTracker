import { describe, it, expect } from 'vitest';
import { OPACITY, opacityToDecimal, withOpacity } from './opacity';

// ponytail: mechanism-only tests — constant values are tuning knobs, not contract
describe('opacity', () => {
  it('all OPACITY values are numbers in 0-100', () => {
    Object.values(OPACITY).forEach((value) => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    });
  });

  it('opacityToDecimal converts percentage to 0-1 decimal', () => {
    Object.values(OPACITY).forEach((value) => {
      expect(opacityToDecimal(value)).toBeCloseTo(value / 100);
    });
  });

  it('withOpacity appends /value to any class, including arbitrary values', () => {
    expect(withOpacity('bg-black', OPACITY.OVERLAY)).toBe(`bg-black/${OPACITY.OVERLAY}`);
    expect(withOpacity('bg-[#fefefe]', OPACITY.LINK_HOVER)).toBe(`bg-[#fefefe]/${OPACITY.LINK_HOVER}`);
  });
});
