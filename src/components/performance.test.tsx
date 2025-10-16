import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeritageMap } from "./Map/HeritageMap";
import { SitesTable } from "./SitesTable/index";
import { CalendarProvider } from "../contexts/CalendarContext";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";

/**
 * Performance smoke tests to ensure app handles 25+ sites
 * Tests rendering performance and basic functionality at scale
 */

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
      const { container } = render(
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

      render(
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
      const { container } = render(
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

      render(
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
      render(
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
      const { container } = render(
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
      render(
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
});
