import { describe, it, expect } from "vitest";
import { getEffectiveDestructionDate } from "./format";

describe("getEffectiveDestructionDate", () => {
  it("returns dateDestroyed when available", () => {
    const site = {
      dateDestroyed: "2023-10-15",
      sourceAssessmentDate: "2025-10-06",
    };
    expect(getEffectiveDestructionDate(site)).toBe("2023-10-15");
  });

  it("falls back to sourceAssessmentDate when dateDestroyed is not available", () => {
    const site = {
      dateDestroyed: undefined,
      sourceAssessmentDate: "2025-10-06",
    };
    expect(getEffectiveDestructionDate(site)).toBe("2025-10-06");
  });

  it("returns undefined when neither date is available", () => {
    const site = {
      dateDestroyed: undefined,
      sourceAssessmentDate: undefined,
    };
    expect(getEffectiveDestructionDate(site)).toBeUndefined();
  });

  it("prefers dateDestroyed over sourceAssessmentDate", () => {
    const site = {
      dateDestroyed: "2023-12-01",
      sourceAssessmentDate: "2024-05-27",
    };
    expect(getEffectiveDestructionDate(site)).toBe("2023-12-01");
  });
});
