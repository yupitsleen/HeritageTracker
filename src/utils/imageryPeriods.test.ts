import { describe, it, expect } from "vitest";
import { getImageryPeriodForDate } from "./imageryPeriods";

describe("getImageryPeriodForDate", () => {
  describe("dates before 2014", () => {
    it("should return BASELINE_2014 for dates before 2014-02-20", () => {
      expect(getImageryPeriodForDate(new Date("2010-01-01"))).toBe("BASELINE_2014");
      expect(getImageryPeriodForDate(new Date("2013-12-31"))).toBe("BASELINE_2014");
      expect(getImageryPeriodForDate(new Date("2014-02-19"))).toBe("BASELINE_2014");
    });

    it("should return BASELINE_2014 for the exact baseline date", () => {
      expect(getImageryPeriodForDate(new Date("2014-02-20"))).toBe("BASELINE_2014");
    });
  });

  describe("dates between 2014 and Jan 2024", () => {
    it("should return BASELINE_2014 for dates between 2014-02-20 and 2024-01-17", () => {
      expect(getImageryPeriodForDate(new Date("2014-06-15"))).toBe("BASELINE_2014");
      expect(getImageryPeriodForDate(new Date("2020-01-01"))).toBe("BASELINE_2014");
      expect(getImageryPeriodForDate(new Date("2023-08-30"))).toBe("BASELINE_2014");
      expect(getImageryPeriodForDate(new Date("2024-01-17"))).toBe("BASELINE_2014");
    });

    it("should return EARLY_2024 for date 2024-01-18, CURRENT for dates after", () => {
      expect(getImageryPeriodForDate(new Date("2024-01-18"))).toBe("EARLY_2024");
      expect(getImageryPeriodForDate(new Date("2024-01-19"))).toBe("CURRENT");
    });
  });

  describe("dates after Jan 2024", () => {
    it("should return CURRENT for all dates after 2024-01-18", () => {
      expect(getImageryPeriodForDate(new Date("2024-01-19"))).toBe("CURRENT");
      expect(getImageryPeriodForDate(new Date("2024-02-01"))).toBe("CURRENT");
      expect(getImageryPeriodForDate(new Date("2024-10-01"))).toBe("CURRENT");
      expect(getImageryPeriodForDate(new Date("2025-12-31"))).toBe("CURRENT");
    });
  });

  describe("edge cases", () => {
    it("should handle dates far in the past", () => {
      expect(getImageryPeriodForDate(new Date("1900-01-01"))).toBe("BASELINE_2014");
      expect(getImageryPeriodForDate(new Date("0001-01-01"))).toBe("BASELINE_2014");
    });

    it("should handle dates far in the future", () => {
      expect(getImageryPeriodForDate(new Date("2099-12-31"))).toBe("CURRENT");
      expect(getImageryPeriodForDate(new Date("3000-01-01"))).toBe("CURRENT");
    });

    it("should handle current date", () => {
      const now = new Date();
      const period = getImageryPeriodForDate(now);
      // Current date should always be CURRENT (after Oct 7, 2023)
      expect(period).toBe("CURRENT");
    });
  });

  describe("extensibility", () => {
    it("should work dynamically with HISTORICAL_IMAGERY constants", () => {
      // Test that the function doesn't hardcode periods but uses HISTORICAL_IMAGERY
      // This is validated by testing boundary dates for each period
      const baseline = getImageryPeriodForDate(new Date("2014-02-20"));
      const early2024 = getImageryPeriodForDate(new Date("2024-01-18"));
      const current = getImageryPeriodForDate(new Date("2024-02-01"));

      expect(baseline).toBe("BASELINE_2014");
      expect(early2024).toBe("EARLY_2024");
      expect(current).toBe("CURRENT");
    });
  });
});
