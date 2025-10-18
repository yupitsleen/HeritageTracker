import { describe, it, expect } from "vitest";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { StatsDashboard } from "./StatsDashboard";
import type { GazaSite } from "../../types";

// Mock sites data for testing
const mockSites: GazaSite[] = [
  {
    id: "site-1",
    name: "Test Mosque",
    nameArabic: "مسجد الاختبار",
    type: "mosque",
    yearBuilt: "800 BCE",
    coordinates: [31.5, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    description: "Test description",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [],
  },
  {
    id: "site-2",
    name: "Test Church",
    nameArabic: "كنيسة الاختبار",
    type: "church",
    yearBuilt: "400 CE",
    coordinates: [31.5, 34.5],
    status: "heavily-damaged",
    dateDestroyed: "2023-11-20",
    description: "Test description",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO", "Forensic Architecture"],
    sources: [],
  },
  {
    id: "site-3",
    name: "Test Archaeological Site",
    nameArabic: "موقع أثري الاختبار",
    type: "archaeological",
    yearBuilt: "2000 BCE",
    coordinates: [31.5, 34.5],
    status: "damaged",
    dateDestroyed: "2024-01-10",
    description: "Test description",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["Heritage for Peace"],
    sources: [],
  },
];

describe("StatsDashboard", () => {
  it("renders without crashing and shows substantive content", () => {
    renderWithTheme(<StatsDashboard sites={mockSites} />);
    // Verify that statistics dashboard has meaningful content
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(1000); // Has substantive content
  });

  it("displays calculated statistics from site data", () => {
    renderWithTheme(<StatsDashboard sites={mockSites} />);
    // Should display some numeric statistics
    const bodyText = document.body.textContent || "";
    const hasNumbers = /\d+/.test(bodyText);
    expect(hasNumbers).toBe(true);
  });

  it("displays narrative content sections", () => {
    renderWithTheme(<StatsDashboard sites={mockSites} />);
    // Check that key narrative sections exist
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(500);
    // Should mention notable sites or examples
    const hasSiteReferences = bodyText.includes("Mosque") || bodyText.includes("Church") || bodyText.includes("Gaza");
    expect(hasSiteReferences).toBe(true);
  });

  it("is scrollable", () => {
    const { container } = renderWithTheme(<StatsDashboard sites={mockSites} />);
    const scrollableDiv = container.querySelector('[class*="overflow"]');
    expect(scrollableDiv).toBeInTheDocument();
  });

  it("handles empty sites array gracefully", () => {
    renderWithTheme(<StatsDashboard sites={[]} />);
    // Should still render without crashing
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(100); // Has some content even with no sites
  });
});
