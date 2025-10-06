import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteDetailPanel } from "./SiteDetailPanel";
import type { GazaSite } from "../../types";

describe("SiteDetailPanel", () => {
  it("renders without crashing with full site data", () => {
    const mockSite: GazaSite = {
      id: "test-site",
      name: "Test Heritage Site",
      nameArabic: "موقع تراثي اختباري",
      type: "mosque",
      yearBuilt: "7th century",
      location: "Gaza City",
      coordinates: [31.5, 34.45],
      status: "destroyed",
      dateDestroyed: "2023-10-15",
      description: "A test heritage site",
      descriptionArabic: "موقع تراثي للاختبار",
      historicalSignificance: "Very significant",
      culturalValue: "Immense cultural value",
      sources: [
        {
          type: "official",
          title: "UNESCO Report",
          url: "https://example.com",
          date: "2024-01-01",
        },
      ],
      images: [
        {
          url: "https://example.com/image.jpg",
          caption: "Before destruction",
          type: "before",
        },
      ],
    };

    render(<SiteDetailPanel site={mockSite} />);

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
      location: "Gaza",
      coordinates: [31.5, 34.45],
      status: "damaged",
      description: "A minimal site",
      sources: [],
    };

    render(<SiteDetailPanel site={minimalSite} />);

    expect(screen.getByText("Minimal Site")).toBeInTheDocument();
    expect(screen.getByText("A minimal site")).toBeInTheDocument();
  });
});
