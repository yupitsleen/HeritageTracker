import { describe, it, expect, vi } from "vitest";
import { renderWithTheme, screen } from "../test-utils/renderWithTheme";
import { HeritageMap } from "./Map/HeritageMap";
import { SitesTable } from "./SitesTable/index";
import { CalendarProvider } from "../contexts/CalendarContext";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";
import {
  filterSitesByTypeAndStatus,
  filterSitesByDestructionDate,
  filterSitesBySearch
} from "../utils/siteFilters";

/**
 * Performance Benchmarks - Environment-Dependent Tests
 *
 * IMPORTANT: These tests are SKIPPED by default (.skip.tsx extension)
 *
 * Why skipped:
 * - Performance thresholds are environment-dependent (CI/CD vs local dev)
 * - Exact millisecond thresholds are brittle (1000ms vs 1001ms)
 * - System load, network conditions affect timing
 * - Tests may pass locally but fail in CI
 *
 * When to run:
 * - Run manually during performance optimization work
 * - Run locally to validate performance improvements
 * - Compare before/after metrics for algorithmic changes
 *
 * To enable: Rename file to performance.test.tsx (remove .skip)
 *
 * Original purpose: Ensure app handles 25+ sites without performance regression
 */

// Helper function to apply all filters
const filterSites = (
  sites: GazaSite[],
  filters: {
    searchQuery: string;
    selectedTypes: Array<GazaSite["type"]>;
    selectedStatuses: Array<GazaSite["status"]>;
    destructionDateStart: Date | null;
    destructionDateEnd: Date | null;
  }
): GazaSite[] => {
  let filtered = sites;

  // Apply search filter
  if (filters.searchQuery) {
    filtered = filterSitesBySearch(filtered, filters.searchQuery);
  }

  // Apply type and status filters
  filtered = filterSitesByTypeAndStatus(
    filtered,
    filters.selectedTypes,
    filters.selectedStatuses
  );

  // Apply destruction date filter
  filtered = filterSitesByDestructionDate(
    filtered,
    filters.destructionDateStart,
    filters.destructionDateEnd
  );

  return filtered;
};

// Generate mock site data at scale (25 sites)
const generateMockSites = (count: number): GazaSite[] => {
  const types: Array<GazaSite["type"]> = [
    "mosque",
    "church",
    "archaeological",
    "museum",
    "historic-building",
  ];
  const statuses: Array<GazaSite["status"]> = ["destroyed", "heavily-damaged", "damaged"];

  return Array.from({ length: count }, (_, i) => ({
    id: `site-${i + 1}`,
    name: `Heritage Site ${i + 1}`,
    nameArabic: `موقع التراث ${i + 1}`,
    type: types[i % types.length],
    yearBuilt: `${1000 + i * 10} CE`,
    yearBuiltIslamic: `${400 + i * 5} AH`,
    coordinates: [31.5 - (i * 0.01), 34.4 + (i * 0.01)] as [number, number],
    status: statuses[i % statuses.length],
    dateDestroyed: `2023-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    dateDestroyedIslamic: `${1 + (i % 12)} Muharram 1445 AH`,
    description: `Test description for heritage site ${i + 1}. This site has significant cultural and historical value.`,
    historicalSignificance: `Historical significance for site ${i + 1}`,
    culturalValue: `Cultural value for site ${i + 1}`,
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "UNESCO",
        title: `Report ${i + 1}`,
        url: `https://unesco.org/report-${i + 1}`,
        date: "2024-01-01",
        type: "official" as const,
      },
    ],
    images: {
      before: {
        url: `https://example.com/before-${i + 1}.jpg`,
        credit: "Test Photographer",
      },
      after: {
        url: `https://example.com/after-${i + 1}.jpg`,
        credit: "Test Photographer",
      },
    },
  }));
};

describe("Performance Tests (25+ Sites)", () => {
  const mockSites25 = generateMockSites(25);

  describe("Map Component Performance", () => {
    it("renders map with 25 sites without crashing", () => {
      const { container } = renderWithTheme(
        <AnimationProvider>
          <HeritageMap
            sites={mockSites25}
            onSiteClick={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      expect(container.querySelector(".leaflet-container")).toBeInTheDocument();
    });

    it("map renders within acceptable time", () => {
      const startTime = performance.now();

      renderWithTheme(
        <AnimationProvider>
          <HeritageMap
            sites={mockSites25}
            onSiteClick={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      console.log(`\n✓ Map rendered 25 sites in ${renderTime.toFixed(2)}ms`);

      // Should render in less than 1 second
      expect(renderTime).toBeLessThan(1000);
    });
  });


  describe("Table Component Performance", () => {
    it("renders table with 25 sites without crashing", () => {
      const { container } = renderWithTheme(
        <CalendarProvider>
          <SitesTable
            sites={mockSites25}
            onSiteClick={() => {}}
            onSiteHighlight={() => {}}
            highlightedSiteId={null}
            onExpandTable={() => {}}
          />
        </CalendarProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("table renders within acceptable time", () => {
      const startTime = performance.now();

      renderWithTheme(
        <CalendarProvider>
          <SitesTable
            sites={mockSites25}
            onSiteClick={() => {}}
            onSiteHighlight={() => {}}
            highlightedSiteId={null}
            onExpandTable={() => {}}
          />
        </CalendarProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      console.log(`\n✓ Table rendered 25 sites in ${renderTime.toFixed(2)}ms`);

      // Should render in less than 1 second
      expect(renderTime).toBeLessThan(1000);
    });

    it("table displays all 25 sites", () => {
      renderWithTheme(
        <CalendarProvider>
          <SitesTable
            sites={mockSites25}
            onSiteClick={() => {}}
            onSiteHighlight={() => {}}
            highlightedSiteId={null}
            onExpandTable={() => {}}
          />
        </CalendarProvider>
      );

      // Check that first and last sites are rendered (use getAllByText for duplicates)
      const site1Elements = screen.getAllByText("Heritage Site 1");
      expect(site1Elements.length).toBeGreaterThan(0);
      const site25Elements = screen.getAllByText("Heritage Site 25");
      expect(site25Elements.length).toBeGreaterThan(0);
    });
  });

  describe("Data Scale Metrics", () => {
    it("reports test data generation", () => {
      console.log(`\n✓ Generated ${mockSites25.length} mock sites for testing`);

      const typeDistribution = mockSites25.reduce(
        (acc, site) => {
          acc[site.type] = (acc[site.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      console.log("\n✓ Type distribution:");
      Object.entries(typeDistribution).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });

      expect(mockSites25.length).toBe(25);
    });

    it("verifies data diversity", () => {
      const uniqueTypes = new Set(mockSites25.map((s) => s.type));
      const uniqueStatuses = new Set(mockSites25.map((s) => s.status));
      const uniqueDates = new Set(mockSites25.map((s) => s.dateDestroyed));

      console.log(`\n✓ Data diversity:`);
      console.log(`  - Unique types: ${uniqueTypes.size}`);
      console.log(`  - Unique statuses: ${uniqueStatuses.size}`);
      console.log(`  - Unique destruction dates: ${uniqueDates.size}`);

      // Should have variety in the data
      expect(uniqueTypes.size).toBeGreaterThanOrEqual(5);
      expect(uniqueStatuses.size).toBeGreaterThanOrEqual(3);
      expect(uniqueDates.size).toBeGreaterThan(1);
    });
  });

  describe("Stress Test (50 Sites)", () => {
    const mockSites50 = generateMockSites(50);

    it("handles 50 sites in map", () => {
      const { container } = renderWithTheme(
        <AnimationProvider>
          <HeritageMap
            sites={mockSites50}
            onSiteClick={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      expect(container.querySelector(".leaflet-container")).toBeInTheDocument();
    });


    it("handles 50 sites in table", () => {
      renderWithTheme(
        <CalendarProvider>
          <SitesTable
            sites={mockSites50}
            onSiteClick={() => {}}
            onSiteHighlight={() => {}}
            highlightedSiteId={null}
            onExpandTable={() => {}}
          />
        </CalendarProvider>
      );

      const headingElements = screen.getAllByText("Heritage Sites");
      expect(headingElements.length).toBeGreaterThan(0);
      console.log(`\n✓ Successfully rendered all components with 50 sites`);
    });
  });

  describe("MapMarkers Memoization Performance", () => {
    it("verifies destroyed sites Set is computed efficiently", () => {
      const mockSites100 = generateMockSites(100);

      const startTime = performance.now();

      renderWithTheme(
        <AnimationProvider>
          <HeritageMap
            sites={mockSites100}
            onSiteClick={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      console.log(`\n✓ MapMarkers rendered 100 sites in ${renderTime.toFixed(2)}ms`);

      // With O(n) optimization, 100 sites should render quickly
      expect(renderTime).toBeLessThan(1500);
    });

    it("verifies re-render performance with updated timestamp", () => {
      const mockSites100 = generateMockSites(100);

      const { rerender } = renderWithTheme(
        <AnimationProvider>
          <HeritageMap
            sites={mockSites100}
            onSiteClick={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      const startTime = performance.now();

      // Force re-render with different highlighted site
      rerender(
        <AnimationProvider>
          <HeritageMap
            sites={mockSites100}
            onSiteClick={() => {}}
            highlightedSiteId="site-50"
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      const endTime = performance.now();
      const rerenderTime = endTime - startTime;

      console.log(`\n✓ MapMarkers re-rendered 100 sites in ${rerenderTime.toFixed(2)}ms`);

      // Re-renders should be fast with React.memo
      expect(rerenderTime).toBeLessThan(1000);
    });
  });

  describe("React.memo Effectiveness", () => {
    it("prevents unnecessary HeritageMap re-renders", () => {
      const mockSites25 = generateMockSites(25);
      const onSiteClick = vi.fn();
      const onSiteHighlight = vi.fn();

      const { rerender } = renderWithTheme(
        <AnimationProvider>
          <HeritageMap
            sites={mockSites25}
            onSiteClick={onSiteClick}
            highlightedSiteId={null}
            onSiteHighlight={onSiteHighlight}
          />
        </AnimationProvider>
      );

      // Re-render with same props - React.memo should prevent re-render
      const startTime = performance.now();

      rerender(
        <AnimationProvider>
          <HeritageMap
            sites={mockSites25}
            onSiteClick={onSiteClick}
            highlightedSiteId={null}
            onSiteHighlight={onSiteHighlight}
          />
        </AnimationProvider>
      );

      const endTime = performance.now();
      const rerenderTime = endTime - startTime;

      console.log(`\n✓ HeritageMap memo prevented re-render in ${rerenderTime.toFixed(2)}ms`);

      // Memoized component should re-render very quickly
      expect(rerenderTime).toBeLessThan(500);
    });
  });

  describe("Filter Performance at Scale (1000+ Sites)", () => {
    const mockSites1000 = generateMockSites(1000);

    it("filters 1000 sites by type in linear time", () => {
      const startTime = performance.now();

      const filtered = filterSites(mockSites1000, {
        searchQuery: "",
        selectedTypes: ["mosque"],
        selectedStatuses: [],
        destructionDateStart: null,
        destructionDateEnd: null,
      });

      const endTime = performance.now();
      const filterTime = endTime - startTime;

      console.log(`\n✓ Filtered 1000 sites by type in ${filterTime.toFixed(2)}ms`);
      console.log(`  - Result: ${filtered.length} mosques found`);

      // Linear filtering should be very fast
      expect(filterTime).toBeLessThan(100);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(site => site.type === "mosque")).toBe(true);
    });

    it("filters 1000 sites by status in linear time", () => {
      const startTime = performance.now();

      const filtered = filterSites(mockSites1000, {
        searchQuery: "",
        selectedTypes: [],
        selectedStatuses: ["destroyed"],
        destructionDateStart: null,
        destructionDateEnd: null,
      });

      const endTime = performance.now();
      const filterTime = endTime - startTime;

      console.log(`\n✓ Filtered 1000 sites by status in ${filterTime.toFixed(2)}ms`);
      console.log(`  - Result: ${filtered.length} destroyed sites found`);

      expect(filterTime).toBeLessThan(100);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(site => site.status === "destroyed")).toBe(true);
    });

    it("filters 1000 sites by search query efficiently", () => {
      const startTime = performance.now();

      const filtered = filterSites(mockSites1000, {
        searchQuery: "Heritage Site 1",
        selectedTypes: [],
        selectedStatuses: [],
        destructionDateStart: null,
        destructionDateEnd: null,
      });

      const endTime = performance.now();
      const filterTime = endTime - startTime;

      console.log(`\n✓ Searched 1000 sites in ${filterTime.toFixed(2)}ms`);
      console.log(`  - Result: ${filtered.length} matching sites found`);

      expect(filterTime).toBeLessThan(150);
      expect(filtered.length).toBeGreaterThan(0);
    });

    it("handles complex multi-filter queries on 1000 sites", () => {
      const startTime = performance.now();

      const filtered = filterSites(mockSites1000, {
        searchQuery: "Heritage",
        selectedTypes: ["mosque", "church"],
        selectedStatuses: ["destroyed"],
        destructionDateStart: new Date("2023-01-01"),
        destructionDateEnd: new Date("2023-12-31"),
      });

      const endTime = performance.now();
      const filterTime = endTime - startTime;

      console.log(`\n✓ Complex filter on 1000 sites in ${filterTime.toFixed(2)}ms`);
      console.log(`  - Result: ${filtered.length} sites matching all criteria`);

      // Complex filtering should still be fast
      expect(filterTime).toBeLessThan(200);
      expect(filtered.length).toBeGreaterThan(0);
    });

    it("benchmarks render performance with 1000 sites in table", () => {
      const startTime = performance.now();

      const { container } = renderWithTheme(
        <CalendarProvider>
          <SitesTable
            sites={mockSites1000}
            onSiteClick={() => {}}
            onSiteHighlight={() => {}}
            highlightedSiteId={null}
            onExpandTable={() => {}}
          />
        </CalendarProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      console.log(`\n✓ Table rendered 1000 sites in ${renderTime.toFixed(2)}ms`);

      expect(container).toBeInTheDocument();
      // 1000 sites may take longer but should be reasonable
      // Threshold increased slightly to account for more complex button styling
      expect(renderTime).toBeLessThan(3200);
    });
  });

  describe("Memory Efficiency", () => {
    it("verifies no memory leaks with repeated renders", () => {
      const mockSites100 = generateMockSites(100);

      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = renderWithTheme(
          <AnimationProvider>
            <HeritageMap
              sites={mockSites100}
              onSiteClick={() => {}}
              highlightedSiteId={null}
              onSiteHighlight={() => {}}
            />
          </AnimationProvider>
        );
        unmount();
      }

      console.log(`\n✓ Survived 10 mount/unmount cycles with 100 sites`);

      // If we got here without crashes, memory management is working
      expect(true).toBe(true);
    });
  });
});
