import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    originalLocation: "Gaza City",
  },
  {
    id: "site-2",
    name: "Ancient Church",
    nameArabic: "الكنيسة القديمة",
    type: "church",
    yearBuilt: "5th century",
    coordinates: [31.6, 34.5],
    status: "damaged",
    dateDestroyed: "2023-11-15",
    description: "Historic church",
    historicalSignificance: "Ancient significance",
    culturalValue: "High value",
    verifiedBy: ["UNESCO"],
    images: {
      before: "/church-before.jpg",
      after: "/church-after.jpg",
    },
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Church Assessment",
        date: "2024-01-05",
        type: "official",
      },
    ],
    originalLocation: "Old City",
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

  describe("Mobile variant smoke tests", () => {
    it("renders mobile accordion layout with header and site count", () => {
      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Verify header
      expect(screen.getByText("Heritage Sites")).toBeInTheDocument();
      // Verify site count
      expect(screen.getByText("Showing 2 sites")).toBeInTheDocument();
    });

    it("displays sticky column headers (Site Name, Date)", () => {
      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      expect(screen.getByText("Site Name")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      // Type column removed from mobile view
      expect(screen.queryByText("Type")).not.toBeInTheDocument();
    });

    it("displays all sites in collapsed accordion rows", () => {
      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      expect(screen.getByText("Test Mosque")).toBeInTheDocument();
      expect(screen.getByText("Ancient Church")).toBeInTheDocument();
    });

    it("shows site type in expanded details only (not in collapsed rows)", () => {
      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Types should NOT be visible in collapsed state (column removed from mobile view)
      expect(screen.queryByText("mosque")).not.toBeInTheDocument();
      expect(screen.queryByText("church")).not.toBeInTheDocument();
    });

    it("displays chevron icon that rotates on expand", async () => {
      const user = userEvent.setup();

      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Find the first accordion row
      const mosqueRow = screen.getByText("Test Mosque").closest("div")?.parentElement;
      expect(mosqueRow).toBeInTheDocument();

      // Initially, detailed description should NOT be visible
      expect(screen.queryByText("Test description")).not.toBeInTheDocument();

      // Click to expand
      if (mosqueRow) {
        await user.click(mosqueRow);
      }

      // Now description should be visible
      expect(screen.getByText("Test description")).toBeInTheDocument();
    });

    it("expands accordion to show full site details on click", async () => {
      const user = userEvent.setup();

      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Find clickable row
      const mosqueRow = screen.getByText("Test Mosque").closest("div")?.parentElement;

      // Click to expand
      if (mosqueRow) {
        await user.click(mosqueRow);
      }

      // Verify all detail fields are present
      expect(screen.getByText(/Type:/)).toBeInTheDocument();
      expect(screen.getByText(/Status:/)).toBeInTheDocument();
      expect(screen.getByText(/Year Built:/)).toBeInTheDocument();
      expect(screen.getByText(/Date Destroyed:/)).toBeInTheDocument();
      expect(screen.getByText(/Description:/)).toBeInTheDocument();
      expect(screen.getByText(/Location:/)).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
      expect(screen.getByText("Gaza City")).toBeInTheDocument();
    });

    it("collapses accordion on second click", async () => {
      const user = userEvent.setup();

      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      const mosqueRow = screen.getByText("Test Mosque").closest("div")?.parentElement;

      // Expand
      if (mosqueRow) {
        await user.click(mosqueRow);
      }
      expect(screen.getByText("Test description")).toBeInTheDocument();

      // Collapse
      if (mosqueRow) {
        await user.click(mosqueRow);
      }
      expect(screen.queryByText("Test description")).not.toBeInTheDocument();
    });

    it("sorts sites by name when clicking Site Name header", async () => {
      const user = userEvent.setup();

      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Find the Site Name header in sticky column headers
      const siteNameHeader = screen.getAllByText("Site Name")[0];

      // Click to sort ascending
      await user.click(siteNameHeader);

      // Verify sort indicator appears (↑ for ascending)
      expect(screen.getByText("↑")).toBeInTheDocument();
    });

    it("does not display Type column in mobile view", () => {
      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Type header and column removed from mobile view
      expect(screen.queryByText("Type")).not.toBeInTheDocument();
    });

    it("sorts sites by date when clicking Date header", async () => {
      const user = userEvent.setup();

      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      const dateHeader = screen.getAllByText("Date")[0];

      // Click to sort ascending
      await user.click(dateHeader);

      // Should show ascending indicator
      expect(screen.getByText("↑")).toBeInTheDocument();

      // Click again to reverse
      await user.click(dateHeader);

      // Should show descending indicator
      expect(screen.getByText("↓")).toBeInTheDocument();
    });

    it("displays Arabic names with proper lang attribute (left-aligned in mobile)", () => {
      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Find Arabic text element
      const arabicElement = screen.getByText("مسجد الاختبار");

      expect(arabicElement).toBeInTheDocument();
      // dir="rtl" removed in mobile view, text is left-aligned
      expect(arabicElement).not.toHaveAttribute("dir", "rtl");
      expect(arabicElement).toHaveAttribute("lang", "ar");
    });

    it("displays site names with status-based colors", () => {
      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Find site name elements
      const mosqueName = screen.getAllByText("Test Mosque")[0];
      const churchName = screen.getAllByText("Ancient Church")[0];

      // Verify they have style attributes (color coding based on status)
      // Test Mosque is "destroyed" status -> #b91c1c (deep Palestine red)
      expect(mosqueName).toHaveStyle({ color: "rgb(185, 28, 28)" });
      // Ancient Church is "damaged" status -> #ca8a04 (muted gold)
      expect(churchName).toHaveStyle({ color: "rgb(202, 138, 4)" });
    });

    it("shows sources with clickable links in expanded view", async () => {
      const user = userEvent.setup();

      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Expand first site
      const mosqueRow = screen.getByText("Test Mosque").closest("div")?.parentElement;
      if (mosqueRow) {
        await user.click(mosqueRow);
      }

      // Verify Sources section appears
      expect(screen.getByText(/Sources:/)).toBeInTheDocument();
      expect(screen.getByText("Test Source")).toBeInTheDocument();
    });

    it("displays verified by information in expanded view", async () => {
      const user = userEvent.setup();

      render(
        <CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider>
      );

      // Expand first site
      const mosqueRow = screen.getByText("Test Mosque").closest("div")?.parentElement;
      if (mosqueRow) {
        await user.click(mosqueRow);
      }

      // Verify "Verified By" section
      expect(screen.getByText(/Verified By:/)).toBeInTheDocument();
      expect(screen.getByText("UNESCO")).toBeInTheDocument();
    });
  });
});
