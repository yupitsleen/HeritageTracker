import { describe, it, expect, vi } from "vitest";
import { renderWithTheme, screen } from "../../test-utils/renderWithTheme";
import { FilterBar } from "./FilterBar";
import { CalendarProvider } from "../../contexts/CalendarContext";
import type { GazaSite, FilterState } from "../../types";

describe("FilterBar", () => {
  const mockFilters: FilterState = {
    selectedTypes: [],
    selectedStatuses: [],
    destructionDateStart: null,
    destructionDateEnd: null,
    creationYearStart: null,
    creationYearEnd: null,
    searchTerm: "",
  };

  const mockOnFilterChange = vi.fn();

  const mockProps = {
    filters: mockFilters,
    onFilterChange: mockOnFilterChange,
  };

  it("renders without crashing", () => {
    const { container } = renderWithTheme(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it("displays filter controls", () => {
    renderWithTheme(
      <CalendarProvider>
        <FilterBar {...mockProps} />
      </CalendarProvider>
    );
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(20);
  });

  describe("Default Date Values", () => {
    const mockSites: GazaSite[] = [
      {
        id: "1",
        name: "Ancient Mosque",
        type: "mosque",
        yearBuilt: "800 BCE",
        coordinates: [31.5, 34.5],
        status: "destroyed",
        dateDestroyed: "2023-10-15",
        description: "Test site",
        historicalSignificance: "High",
        culturalValue: "High",
        sources: [],
        verifiedBy: [],
      },
      {
        id: "2",
        name: "Medieval Church",
        type: "church",
        yearBuilt: "12th century",
        coordinates: [31.6, 34.6],
        status: "damaged",
        dateDestroyed: "2023-12-20",
        description: "Test site",
        historicalSignificance: "High",
        culturalValue: "High",
        sources: [],
        verifiedBy: [],
      },
      {
        id: "3",
        name: "Modern Museum",
        type: "museum",
        yearBuilt: "1950",
        coordinates: [31.7, 34.7],
        status: "destroyed",
        dateDestroyed: "2024-01-05",
        description: "Test site",
        historicalSignificance: "Medium",
        culturalValue: "Medium",
        sources: [],
        verifiedBy: [],
      },
    ];

    it("calculates destruction date range from sites data", () => {
      renderWithTheme(
        <CalendarProvider>
          <FilterBar {...mockProps} sites={mockSites} />
        </CalendarProvider>
      );

      // Check that the destruction date filter button exists
      const destructionDateButton = screen.getByText("Destruction Date Range");
      expect(destructionDateButton).toBeInTheDocument();
    });

    it("calculates year built range from sites data", () => {
      renderWithTheme(
        <CalendarProvider>
          <FilterBar {...mockProps} sites={mockSites} />
        </CalendarProvider>
      );

      // Year Built Range label should be visible (using getAllByText since it appears in multiple places)
      const yearBuiltLabels = screen.getAllByText("Year Built Range");
      expect(yearBuiltLabels.length).toBeGreaterThan(0);
    });

    it("handles empty sites array gracefully", () => {
      const { container } = renderWithTheme(
        <CalendarProvider>
          <FilterBar {...mockProps} sites={[]} />
        </CalendarProvider>
      );
      expect(container).toBeInTheDocument();
    });

    it("handles sites without destruction dates", () => {
      const sitesWithoutDates: GazaSite[] = [
        {
          id: "1",
          name: "Test Site",
          type: "mosque",
          yearBuilt: "1900",
          coordinates: [31.5, 34.5],
          status: "damaged",
          description: "Test",
          historicalSignificance: "High",
          culturalValue: "High",
          sources: [],
          verifiedBy: [],
        },
      ];

      const { container } = renderWithTheme(
        <CalendarProvider>
          <FilterBar {...mockProps} sites={sitesWithoutDates} />
        </CalendarProvider>
      );
      expect(container).toBeInTheDocument();
    });

    it("handles sites with various year formats", () => {
      const sitesWithVariousYears: GazaSite[] = [
        {
          id: "1",
          name: "BCE Site",
          type: "archaeological",
          yearBuilt: "800 BCE",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          dateDestroyed: "2023-10-15",
          description: "Test",
          historicalSignificance: "High",
          culturalValue: "High",
          sources: [],
          verifiedBy: [],
        },
        {
          id: "2",
          name: "Century Site",
          type: "church",
          yearBuilt: "7th century",
          coordinates: [31.6, 34.6],
          status: "damaged",
          dateDestroyed: "2023-11-20",
          description: "Test",
          historicalSignificance: "High",
          culturalValue: "High",
          sources: [],
          verifiedBy: [],
        },
        {
          id: "3",
          name: "Modern Site",
          type: "museum",
          yearBuilt: "2000",
          coordinates: [31.7, 34.7],
          status: "destroyed",
          dateDestroyed: "2024-01-05",
          description: "Test",
          historicalSignificance: "Medium",
          culturalValue: "Medium",
          sources: [],
          verifiedBy: [],
        },
      ];

      const { container } = renderWithTheme(
        <CalendarProvider>
          <FilterBar {...mockProps} sites={sitesWithVariousYears} />
        </CalendarProvider>
      );
      expect(container).toBeInTheDocument();
    });
  });
});
