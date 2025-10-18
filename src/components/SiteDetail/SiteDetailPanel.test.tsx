import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteDetailPanel } from "./SiteDetailPanel";
import { ThemeProvider } from "../../contexts/ThemeContext";
import type { GazaSite } from "../../types";

describe("SiteDetailPanel", () => {
  it("renders without crashing with full site data", () => {
    const mockSite: GazaSite = {
      id: "test-site",
      name: "Test Heritage Site",
      nameArabic: "موقع تراثي اختباري",
      type: "mosque",
      yearBuilt: "7th century",
      coordinates: [31.5, 34.45],
      status: "destroyed",
      dateDestroyed: "2023-10-15",
      description: "A test heritage site",
      historicalSignificance: "Very significant",
      culturalValue: "Immense cultural value",
      verifiedBy: ["UNESCO", "Heritage for Peace"],
      sources: [
        {
          organization: "UNESCO",
          type: "official",
          title: "UNESCO Report",
          url: "https://example.com",
          date: "2024-01-01",
        },
      ],
      images: {
        before: {
          url: "https://example.com/before.jpg",
          credit: "Test Photographer / Test Organization",
          license: "CC BY-SA 4.0",
          sourceUrl: "https://example.com/source",
          date: "2023-01-15",
        },
        after: {
          url: "https://example.com/after.jpg",
          credit: "Test Photographer / Test Organization",
          license: "CC BY-SA 4.0",
        },
      },
    };

    render(
      <ThemeProvider>
        <SiteDetailPanel site={mockSite} />
      </ThemeProvider>
    );

    // Check that key elements are rendered
    expect(screen.getByText("Test Heritage Site")).toBeInTheDocument();
    expect(screen.getByText("موقع تراثي اختباري")).toBeInTheDocument();
    expect(screen.getByText("A test heritage site")).toBeInTheDocument();
    expect(screen.getByText("Very significant")).toBeInTheDocument();
    expect(screen.getByText("UNESCO Report")).toBeInTheDocument();
  });

  it("renders without crashing with minimal site data", () => {
    const minimalSite: GazaSite = {
      id: "minimal-site",
      name: "Minimal Site",
      type: "archaeological",
      yearBuilt: "Unknown",
      coordinates: [31.5, 34.45],
      status: "damaged",
      description: "A minimal site",
      historicalSignificance: "Historical significance",
      culturalValue: "Cultural value",
      verifiedBy: ["UNESCO"],
      sources: [],
    };

    render(
      <ThemeProvider>
        <SiteDetailPanel site={minimalSite} />
      </ThemeProvider>
    );

    expect(screen.getByText("Minimal Site")).toBeInTheDocument();
    expect(screen.getByText("A minimal site")).toBeInTheDocument();
  });
});
