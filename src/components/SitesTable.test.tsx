import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SitesTable } from "./SitesTable";
import type { GazaSite } from "../types";

const mockSites: GazaSite[] = [
  {
    id: "site-1",
    name: "Test Mosque",
    nameArabic: "مسجد الاختبار",
    type: "mosque",
    yearBuilt: "7th century",
    coordinates: [31.5, 34.4],
    status: "destroyed",
    dateDestroyed: "2023-12-01",
    description: "Test description",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO"],
    images: {
      before: "/test-before.jpg",
      after: "/test-after.jpg",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Test Source",
        date: "2024-01-01",
        type: "official",
      },
    ],
  },
];

describe("SitesTable", () => {
  it("renders without crashing", () => {
    render(
      <SitesTable
        sites={mockSites}
        onSiteClick={vi.fn()}
      />
    );
    expect(screen.getByText("Heritage Sites")).toBeInTheDocument();
  });

  it("displays table headers with sort icons", () => {
    render(
      <SitesTable
        sites={mockSites}
        onSiteClick={vi.fn()}
      />
    );
    expect(screen.getByText("Site Name")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date Destroyed")).toBeInTheDocument();
    expect(screen.getByText("Date Built")).toBeInTheDocument();
  });

  it("displays site data in table rows", () => {
    render(
      <SitesTable
        sites={mockSites}
        onSiteClick={vi.fn()}
      />
    );
    expect(screen.getByText("Test Mosque")).toBeInTheDocument();
    expect(screen.getByText("mosque")).toBeInTheDocument();
    expect(screen.getByText("destroyed")).toBeInTheDocument();
    expect(screen.getByText("7th century")).toBeInTheDocument();
  });

  it("renders See more button for each site", () => {
    render(
      <SitesTable
        sites={mockSites}
        onSiteClick={vi.fn()}
      />
    );
    expect(screen.getByText("See more")).toBeInTheDocument();
  });

  it("renders expand table button when onExpandTable is provided", () => {
    render(
      <SitesTable
        sites={mockSites}
        onSiteClick={vi.fn()}
        onExpandTable={vi.fn()}
      />
    );
    const expandButton = screen.getByTitle("Expand table");
    expect(expandButton).toBeInTheDocument();
  });

  it("does not render expand button when onExpandTable is not provided", () => {
    render(
      <SitesTable
        sites={mockSites}
        onSiteClick={vi.fn()}
      />
    );
    const expandButton = screen.queryByTitle("Expand table");
    expect(expandButton).not.toBeInTheDocument();
  });

  it("displays Arabic name when available", () => {
    render(
      <SitesTable
        sites={mockSites}
        onSiteClick={vi.fn()}
      />
    );
    expect(screen.getByText("مسجد الاختبار")).toBeInTheDocument();
  });
});
