import { describe, it, expect } from "vitest";
import {
  getVerifier,
  getAllVerifiers,
  getVerifiersByType,
  calculateVerifierCredibility,
  getVerifierLabel,
} from "./verifiers";

describe("Verifiers Registry", () => {
  describe("getAllVerifiers", () => {
    it("returns all registered verifiers", () => {
      const verifiers = getAllVerifiers();
      expect(verifiers).toHaveLength(12);
    });
  });

  describe("getVerifier", () => {
    it("returns default config for unknown verifier", () => {
      const unknown = getVerifier("Unknown Organization");
      expect(unknown.id).toBe("Unknown Organization");
      expect(unknown.credibilityWeight).toBe(50);
    });
  });

  describe("getVerifiersByType", () => {
    it("returns academic institutions", () => {
      const academic = getVerifiersByType("academic");
      expect(academic.length).toBe(2);
      expect(academic.map((v) => v.id)).toContain("Forensic Architecture");
    });

    it("returns empty array for non-existent type", () => {
      const none = getVerifiersByType("documentation");
      expect(none).toHaveLength(0);
    });
  });

  describe("calculateVerifierCredibility", () => {
    it("returns 0 for empty array", () => {
      expect(calculateVerifierCredibility([])).toBe(0);
    });

    it("calculates average for multiple verifiers", () => {
      // UNESCO: 100, Heritage for Peace: 95 = (100 + 95) / 2 = 97.5 → 98
      const result = calculateVerifierCredibility(["UNESCO", "Heritage for Peace"]);
      expect(result).toBe(98);
    });

    it("handles unknown verifiers with default weight", () => {
      // Unknown gets 50, UNESCO gets 100
      const result = calculateVerifierCredibility(["Unknown", "UNESCO"]);
      expect(result).toBe(75);
    });
  });

  describe("getVerifierLabel", () => {
    it("returns English label by default", () => {
      expect(getVerifierLabel("UNESCO")).toBe("UNESCO");
    });

    it("returns Arabic label when locale is 'ar'", () => {
      expect(getVerifierLabel("UNESCO", "ar")).toBe("اليونسكو");
    });
  });
});
