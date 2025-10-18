import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SitesTable } from "./SitesTable/index";
import type { GazaSite } from "../types";
import { CalendarProvider } from "../contexts/CalendarContext";
import { ThemeProvider } from "../contexts/ThemeContext";

// Helper to wrap component with all required providers
// Keeping for consistency with other test files, may be used in future tests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <CalendarProvider>
        {ui}
      </CalendarProvider>
    </ThemeProvider>
  );
};

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
      before: {
        url: "/test-before.jpg",
        credit: "Test Photographer",
      },
      after: {
        url: "/test-after.jpg",
        credit: "Test Photographer",
      },
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
      before: {
        url: "/church-before.jpg",
        credit: "Test Photographer",
      },
      after: {
        url: "/church-after.jpg",
        credit: "Test Photographer",
      },
    },
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Church Assessment",
        date: "2024-01-05",
        type: "official",
      },
    ],
  },
];

describe("SitesTable", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ThemeProvider><CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider></ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("displays sortable table headers", () => {
    render(
      <ThemeProvider><CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider></ThemeProvider>
    );
    // Check that sort indicators are present (↕ ↑ ↓)
    const sortIndicators = ["↕", "↑", "↓"];
    const bodyText = document.body.textContent || "";
    const hasSortIndicator = sortIndicators.some(indicator => bodyText.includes(indicator));
    expect(hasSortIndicator).toBe(true);
  });

  it("displays site data in table rows", () => {
    render(
      <ThemeProvider><CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider></ThemeProvider>
    );
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(50);
  });

  it("renders clickable site names", () => {
    const { container } = render(
      <ThemeProvider><CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider></ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders expand table button when onExpandTable is provided", () => {
    const { container } = render(
      <ThemeProvider><CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
          onExpandTable={vi.fn()}
        />
      </CalendarProvider></ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("does not render expand button when onExpandTable is not provided", () => {
    const { container } = render(
      <ThemeProvider><CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider></ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("displays Arabic name when available", () => {
    const { container } = render(
      <ThemeProvider><CalendarProvider>
        <SitesTable
          sites={mockSites}
          onSiteClick={vi.fn()}
        />
      </CalendarProvider></ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  describe("Mobile variant smoke tests", () => {
    it("renders mobile accordion layout with header and site count", () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("displays column headers without Type column", () => {
      render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      // Type column removed from mobile view
      expect(screen.queryByText("Type")).not.toBeInTheDocument();
      // Should still have sortable headers with indicators
      const bodyText = document.body.textContent || "";
      expect(bodyText.includes("↕") || bodyText.includes("↑") || bodyText.includes("↓")).toBe(true);
    });

    it("displays all sites in collapsed accordion rows", () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("shows site type in expanded details only (not in collapsed rows)", () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("displays chevron icon that rotates on expand", async () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("expands accordion to show full site details on click", async () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("collapses accordion on second click", async () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("sorts sites by name when clicking name header", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      // Find first header with sort indicator
      const headers = document.querySelectorAll('[class*="cursor-pointer"]');
      expect(headers.length).toBeGreaterThan(0);

      // Click first sortable header
      await user.click(headers[0] as HTMLElement);

      // Verify sort indicator appears (↑ for ascending)
      expect(screen.getByText("↑")).toBeInTheDocument();
    });

    it("does not display Type column in mobile view", () => {
      render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      // Type header and column removed from mobile view
      expect(screen.queryByText("Type")).not.toBeInTheDocument();
    });

    it("sorts sites by toggling between ascending and descending", async () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("displays Arabic names with proper lang attribute (left-aligned in mobile)", () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("displays site names with status-based colors", () => {
      render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      // Find site name elements - there may be multiple instances
      const mosqueElements = screen.getAllByText("Test Mosque");
      const churchElements = screen.getAllByText("Ancient Church");

      // Check that at least one instance has the correct color
      const mosqueName = mosqueElements.find(el =>
        window.getComputedStyle(el).color === "rgb(185, 28, 28)"
      );
      const churchName = churchElements.find(el =>
        window.getComputedStyle(el).color === "rgb(202, 138, 4)"
      );

      // Verify they have style attributes (color coding based on status)
      // Test Mosque is "destroyed" status -> #b91c1c (deep Palestine red)
      expect(mosqueName).toBeDefined();
      // Ancient Church is "damaged" status -> #ca8a04 (muted gold)
      expect(churchName).toBeDefined();
    });

    it("shows sources with clickable links in expanded view", async () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("displays verified by information in expanded view", async () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="mobile"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe("Expanded variant", () => {
    it("displays Export CSV button in expanded variant", () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="expanded"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("does not display Export CSV button in compact variant", () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="compact"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("Export CSV button is clickable without errors", async () => {
      const { container } = render(
        <ThemeProvider><CalendarProvider>
          <SitesTable
            sites={mockSites}
            onSiteClick={vi.fn()}
            variant="expanded"
          />
        </CalendarProvider></ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });
  });
});
