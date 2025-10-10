import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SitesTable } from "./SitesTable";
import type { GazaSite } from "../types";
import { CalendarProvider } from "../contexts/CalendarContext";

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
      <CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider>
    );
    expect(screen.getByText("Heritage Sites")).toBeInTheDocument();
  });

  it("displays table headers with sort icons", () => {
    render(
      <CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider>
    );
    expect(screen.getByText("Site Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Destruction Date")).toBeInTheDocument();
  });

  it("displays site data in table rows", () => {
    render(
      <CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider>
    );
    expect(screen.getByText("Test Mosque")).toBeInTheDocument();
    expect(screen.getByText("destroyed")).toBeInTheDocument();
  });

  it("renders clickable site names", () => {
    render(
      <CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider>
    );
    const siteButton = screen.getByText("Test Mosque");
    expect(siteButton).toBeInTheDocument();
    expect(siteButton.tagName).toBe("DIV"); // Site name is in a div inside a button
  });

  it("renders expand table button when onExpandTable is provided", () => {
    render(
      <CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
          onExpandTable={vi.fn()}
        />
      </CalendarProvider>
    );
    const expandButton = screen.getByTitle("Expand table to see all columns");
    expect(expandButton).toBeInTheDocument();
  });

  it("does not render expand button when onExpandTable is not provided", () => {
    render(
      <CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider>
    );
    const expandButton = screen.queryByTitle("Expand table to see all columns");
    expect(expandButton).not.toBeInTheDocument();
  });

  it("displays Arabic name when available", () => {
    render(
      <CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider>
    );
    expect(screen.getByText("مسجد الاختبار")).toBeInTheDocument();
  });
});
