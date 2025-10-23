import { describe, it, expect } from "vitest";
import {
  ANIMATION_SPEEDS,
  ANIMATION_CONFIG,
  getAnimationSpeed,
  getAvailableSpeeds,
  getDefaultSpeed,
  getSpeedValues,
  isValidSpeed,
  getSpeedLabel,
  calculateTimeIncrement,
} from "./animation";

describe("ANIMATION_SPEEDS", () => {
  it("contains all expected speeds", () => {
    const expectedSpeeds = [0.25, 0.5, 1, 2, 4, 8];
    const actualSpeeds = ANIMATION_SPEEDS.map((s) => s.value);

    expectedSpeeds.forEach((speed) => {
      expect(actualSpeeds).toContain(speed);
    });
  });

  it("has valid structure for all speeds", () => {
    ANIMATION_SPEEDS.forEach((speed) => {
      expect(speed.value).toBeGreaterThan(0);
      expect(speed.label).toBeTruthy();
      expect(speed.label).toMatch(/^[\d.]+x$/); // Format: "0.5x", "1x", etc.
    });
  });

  it("includes Arabic labels for all speeds", () => {
    ANIMATION_SPEEDS.forEach((speed) => {
      expect(speed.labelArabic).toBeTruthy();
    });
  });

  it("has exactly one default speed", () => {
    const defaults = ANIMATION_SPEEDS.filter((s) => s.isDefault);
    expect(defaults).toHaveLength(1);
    expect(defaults[0].value).toBe(1);
  });

  it("is sorted by speed value (ascending)", () => {
    const values = ANIMATION_SPEEDS.map((s) => s.value);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });
});

describe("ANIMATION_CONFIG", () => {
  it("has valid configuration", () => {
    expect(ANIMATION_CONFIG.speeds).toBe(ANIMATION_SPEEDS);
    expect(ANIMATION_CONFIG.defaultSpeed).toBe(1);
    expect(ANIMATION_CONFIG.frameInterval).toBeGreaterThan(0);
    expect(ANIMATION_CONFIG.timeIncrementPerFrame).toBeGreaterThan(0);
  });

  it("has 60fps frame interval", () => {
    // 60fps = 16.67ms per frame, we use 16ms
    expect(ANIMATION_CONFIG.frameInterval).toBe(16);
  });

  it("increments 1 day per frame at 1x speed", () => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    expect(ANIMATION_CONFIG.timeIncrementPerFrame).toBe(oneDayInMs);
  });

  it("includes pause at start configuration", () => {
    expect(ANIMATION_CONFIG.pauseAtStart).toBe(true);
    expect(ANIMATION_CONFIG.pauseAtStartDuration).toBe(1000);
  });
});

describe("getAnimationSpeed", () => {
  it("returns correct speed config by value", () => {
    const speed1x = getAnimationSpeed(1);
    expect(speed1x?.value).toBe(1);
    expect(speed1x?.label).toBe("1x");
  });

  it("returns speed config for all registered speeds", () => {
    [0.25, 0.5, 1, 2, 4, 8].forEach((value) => {
      const speed = getAnimationSpeed(value);
      expect(speed).toBeDefined();
      expect(speed?.value).toBe(value);
    });
  });

  it("returns undefined for unknown speed", () => {
    expect(getAnimationSpeed(3)).toBeUndefined();
    expect(getAnimationSpeed(10)).toBeUndefined();
  });
});

describe("getAvailableSpeeds", () => {
  it("returns all 6 speed options", () => {
    const speeds = getAvailableSpeeds();
    expect(speeds).toHaveLength(6);
  });

  it("returns array of AnimationSpeedConfig objects", () => {
    const speeds = getAvailableSpeeds();
    speeds.forEach((speed) => {
      expect(speed).toHaveProperty("value");
      expect(speed).toHaveProperty("label");
      expect(speed).toHaveProperty("labelArabic");
    });
  });

  it("returns the same reference as ANIMATION_SPEEDS", () => {
    const speeds = getAvailableSpeeds();
    expect(speeds).toBe(ANIMATION_SPEEDS);
  });
});

describe("getDefaultSpeed", () => {
  it("returns 1x speed as default", () => {
    const defaultSpeed = getDefaultSpeed();
    expect(defaultSpeed.value).toBe(1);
    expect(defaultSpeed.isDefault).toBe(true);
  });

  it("returns valid speed config", () => {
    const defaultSpeed = getDefaultSpeed();
    expect(defaultSpeed.label).toBe("1x");
    expect(defaultSpeed.labelArabic).toBeTruthy();
  });
});

describe("getSpeedValues", () => {
  it("returns all speed values", () => {
    const values = getSpeedValues();
    expect(values).toEqual([0.25, 0.5, 1, 2, 4, 8]);
  });

  it("returns only numeric values", () => {
    const values = getSpeedValues();
    values.forEach((value) => {
      expect(typeof value).toBe("number");
    });
  });
});

describe("isValidSpeed", () => {
  it("returns true for registered speeds", () => {
    expect(isValidSpeed(0.25)).toBe(true);
    expect(isValidSpeed(0.5)).toBe(true);
    expect(isValidSpeed(1)).toBe(true);
    expect(isValidSpeed(2)).toBe(true);
    expect(isValidSpeed(4)).toBe(true);
    expect(isValidSpeed(8)).toBe(true);
  });

  it("returns false for unregistered speeds", () => {
    expect(isValidSpeed(3)).toBe(false);
    expect(isValidSpeed(10)).toBe(false);
    expect(isValidSpeed(0.75)).toBe(false);
  });

  it("returns false for invalid values", () => {
    expect(isValidSpeed(0)).toBe(false);
    expect(isValidSpeed(-1)).toBe(false);
  });
});

describe("getSpeedLabel", () => {
  it("returns English label by default", () => {
    expect(getSpeedLabel(1)).toBe("1x");
    expect(getSpeedLabel(0.5)).toBe("0.5x");
    expect(getSpeedLabel(4)).toBe("4x");
  });

  it("returns English label when locale is 'en'", () => {
    expect(getSpeedLabel(1, "en")).toBe("1x");
  });

  it("returns Arabic label when locale is 'ar'", () => {
    expect(getSpeedLabel(1, "ar")).toBe("١×");
    expect(getSpeedLabel(0.5, "ar")).toBe("٠.٥×");
    expect(getSpeedLabel(4, "ar")).toBe("٤×");
  });

  it("returns formatted value for unknown speeds", () => {
    expect(getSpeedLabel(3)).toBe("3x");
    expect(getSpeedLabel(10)).toBe("10x");
  });
});

describe("calculateTimeIncrement", () => {
  it("returns 1 day increment at 1x speed", () => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    expect(calculateTimeIncrement(1)).toBe(oneDayInMs);
  });

  it("returns 0.5 day increment at 0.5x speed", () => {
    const halfDayInMs = 12 * 60 * 60 * 1000;
    expect(calculateTimeIncrement(0.5)).toBe(halfDayInMs);
  });

  it("returns 2 day increment at 2x speed", () => {
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    expect(calculateTimeIncrement(2)).toBe(twoDaysInMs);
  });

  it("returns 4 day increment at 4x speed", () => {
    const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;
    expect(calculateTimeIncrement(4)).toBe(fourDaysInMs);
  });

  it("scales linearly with speed", () => {
    const base = calculateTimeIncrement(1);
    expect(calculateTimeIncrement(2)).toBe(base * 2);
    expect(calculateTimeIncrement(4)).toBe(base * 4);
    expect(calculateTimeIncrement(0.5)).toBe(base * 0.5);
  });
});

describe("Speed Configuration Integration", () => {
  it("default speed is in available speeds", () => {
    const defaultSpeed = getDefaultSpeed();
    const availableSpeeds = getAvailableSpeeds();
    expect(availableSpeeds).toContain(defaultSpeed);
  });

  it("all speeds have unique values", () => {
    const values = getSpeedValues();
    const uniqueValues = [...new Set(values)];
    expect(values.length).toBe(uniqueValues.length);
  });

  it("provides reasonable speed range", () => {
    const values = getSpeedValues();
    const min = Math.min(...values);
    const max = Math.max(...values);

    expect(min).toBe(0.25); // Slowest
    expect(max).toBe(8); // Fastest
    expect(max / min).toBe(32); // 32x range
  });
});
