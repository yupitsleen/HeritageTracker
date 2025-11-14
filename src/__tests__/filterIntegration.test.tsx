/**
 * Integration Tests - Filter Propagation Across Components
 *
 * Purpose: Verify that filters applied via FilterBar correctly propagate to all components:
 * - Timeline shows only filtered sites
 * - Map shows only filtered sites
 * - Table shows only filtered sites
 * - All components show the SAME filtered subset
 *
 * Test Strategy: Split into individual component tests for maintainability
 */

import { describe, it, expect, vi } from "vitest";
import { renderWithTheme, screen, waitFor } from "../test-utils/renderWithTheme";
import { AnimationProvider } from "../contexts/AnimationContext";
import { TimelineScrubber } from "../components/Timeline/TimelineScrubber";
import { MapMarkers } from "../components/Map/MapMarkers";
import { SitesTable } from "../components/SitesTable";
import { MapContainer } from "react-leaflet";
import {
  filterSitesByTypeAndStatus,
  filterSitesByDestructionDate,
  filterSitesByCreationYear,
  filterSitesBySearch,
} from "../utils/siteFilters";
import type { Site, FilterState } from "../types";

// Helper function to apply all filters (replicates useFilteredSites logic)
function applyFilters(sites: Site[], filters: FilterState) {
  let filtered = filterSitesByTypeAndStatus(sites, filters.selectedTypes, filters.selectedStatuses);
  filtered = filterSitesByDestructionDate(
    filtered,
    filters.destructionDateStart,
    filters.destructionDateEnd
  );
  filtered = filterSitesByCreationYear(
    filtered,
    filters.creationYearStart,
    filters.creationYearEnd
  );
  filtered = filterSitesBySearch(filtered, filters.searchTerm);

  return {
    filteredSites: filtered,
    count: filtered.length,
    total: sites.length,
  };
}

// Mock ResizeObserver for timeline tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollIntoView for table tests
Element.prototype.scrollIntoView = vi.fn();

// Test data - 4 sites with different types and statuses
const createTestSites = (): Site[] => [
  {
    id: "mosque-1",
    name: "Al-Omari Mosque",
    nameArabic: "مسجد العمري",
    type: "mosque",
    yearBuilt: "1200",
    coordinates: [31.5, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-10-15", // Changed from empty string to actual date
    lastUpdated: "2024-01-01",
    description: "Historic mosque",
    historicalSignificance: "High",
    culturalValue: "High",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
  {
    id: "church-1",
    name: "Saint Porphyrius Church",
    type: "church",
    yearBuilt: "425",
    coordinates: [31.6, 34.6],
    status: "damaged",
    dateDestroyed: "2023-11-20",
    lastUpdated: "2024-01-01",
    description: "Ancient church",
    historicalSignificance: "High",
    culturalValue: "High",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
  {
    id: "museum-1",
    name: "Gaza Museum",
    type: "museum",
    yearBuilt: "1950",
    coordinates: [31.7, 34.7],
    status: "destroyed",
    dateDestroyed: "2024-01-05",
    lastUpdated: "2024-01-01",
    description: "Modern museum",
    historicalSignificance: "Medium",
    culturalValue: "Medium",
    verifiedBy: ["Forensic Architecture"],
    sources: [],
  },
];

const emptyFilters: FilterState = {
  selectedTypes: [],
  selectedStatuses: [],
  destructionDateStart: null,
  destructionDateEnd: null,
  creationYearStart: null,
  creationYearEnd: null,
  searchTerm: "",
};

describe("Filter Integration - Timeline Component", () => {
  const testSites = createTestSites();

  it("shows all sites when no filters applied", async () => {
    const filteredResult = applyFilters(testSites, emptyFilters);

    const { container } = renderWithTheme(
      <AnimationProvider sites={testSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    // Wait for D3 to render all destruction date dots
    await waitFor(() => {
      const dots = container.querySelectorAll(".event-marker");
      expect(dots.length).toBe(3);
    });
  });

  it("shows only mosque sites when mosque type filter applied", async () => {
    const mosqueFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["mosque"],
    };

    const filteredResult = applyFilters(testSites, mosqueFilter);

    const { container } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    // Should only show 1 dot (mosque-1)
    await waitFor(() => {
      const dots = container.querySelectorAll(".event-marker");
      expect(dots.length).toBe(1);
    });

    // Verify correct site count
    expect(filteredResult.count).toBe(1);
    expect(filteredResult.filteredSites[0].id).toBe("mosque-1");
  });

  it("shows only destroyed sites when destroyed status filter applied", async () => {
    const destroyedFilter: FilterState = {
      ...emptyFilters,
      selectedStatuses: ["destroyed"],
    };

    const filteredResult = applyFilters(testSites, destroyedFilter);

    const { container } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    // Should show 2 dots (mosque-1 and museum-1 are destroyed)
    await waitFor(() => {
      const dots = container.querySelectorAll(".event-marker");
      expect(dots.length).toBe(2);
    });

    expect(filteredResult.count).toBe(2);
  });

  it("shows correct sites when combining type and status filters", async () => {
    const combinedFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["mosque"],
      selectedStatuses: ["destroyed"],
    };

    const filteredResult = applyFilters(testSites, combinedFilter);

    const { container } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    // Should show 1 dot (only mosque-1 is both mosque AND destroyed)
    await waitFor(() => {
      const dots = container.querySelectorAll(".event-marker");
      expect(dots.length).toBe(1);
    });

    expect(filteredResult.count).toBe(1);
    expect(filteredResult.filteredSites[0].id).toBe("mosque-1");
  });

  it("shows sites within destruction date range filter", async () => {
    const dateRangeFilter: FilterState = {
      ...emptyFilters,
      destructionDateStart: new Date("2023-10-01"),
      destructionDateEnd: new Date("2023-12-31"),
    };

    const filteredResult = applyFilters(testSites, dateRangeFilter);

    const { container } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    // Should show 2 dots (mosque-1: Oct 15, church-1: Nov 20)
    // museum-1 (Jan 5, 2024) should be excluded
    await waitFor(() => {
      const dots = container.querySelectorAll(".event-marker");
      expect(dots.length).toBe(2);
    });

    expect(filteredResult.count).toBe(2);
  });

  it("shows no sites when filter matches nothing", async () => {
    const noMatchFilter: FilterState = {
      ...emptyFilters,
      searchTerm: "NonExistentSiteName12345",
    };

    const filteredResult = applyFilters(testSites, noMatchFilter);

    const { container } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    // Should show 0 dots
    await waitFor(() => {
      const dots = container.querySelectorAll(".event-marker");
      expect(dots.length).toBe(0);
    });

    expect(filteredResult.count).toBe(0);
  });
});

describe("Filter Integration - Map Component", () => {
  const testSites = createTestSites();

  it("shows all sites when no filters applied", () => {
    const filteredResult = applyFilters(testSites, emptyFilters);

    const { container } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    // Should show 3 circle markers (all sites)
    const circles = container.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(3);
  });

  it("shows only mosque sites when mosque type filter applied", () => {
    const mosqueFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["mosque"],
    };

    const filteredResult = applyFilters(testSites, mosqueFilter);

    const { container } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    // Should show 1 circle marker (mosque-1)
    const circles = container.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(1);
    expect(filteredResult.filteredSites[0].id).toBe("mosque-1");
  });

  it("shows only destroyed sites when destroyed status filter applied", () => {
    const destroyedFilter: FilterState = {
      ...emptyFilters,
      selectedStatuses: ["destroyed"],
    };

    const filteredResult = applyFilters(testSites, destroyedFilter);

    const { container } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    // Should show 2 circle markers (mosque-1 and museum-1)
    const circles = container.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(2);
    expect(filteredResult.count).toBe(2);
  });

  it("shows correct sites when combining filters", () => {
    const combinedFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["church", "museum"],
    };

    const filteredResult = applyFilters(testSites, combinedFilter);

    const { container } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    // Should show 2 circle markers (church-1 and museum-1)
    const circles = container.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(2);
    expect(filteredResult.count).toBe(2);
  });

  it("shows no sites when filter matches nothing", () => {
    const noMatchFilter: FilterState = {
      ...emptyFilters,
      searchTerm: "NonExistentSiteName12345",
    };

    const filteredResult = applyFilters(testSites, noMatchFilter);

    const { container } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    // Should show 0 markers
    const circles = container.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(0);
    expect(filteredResult.count).toBe(0);
  });

  it("shows highlighted site with correct marker type even when filtered", () => {
    const mosqueFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["mosque"],
    };

    const filteredResult = applyFilters(testSites, mosqueFilter);

    const { container } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId="mosque-1"
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    // Highlighted site should show as teardrop icon
    expect(container.querySelector(".leaflet-marker-icon")).toBeInTheDocument();
    expect(filteredResult.count).toBe(1);
  });
});

describe("Filter Integration - Table Component", () => {
  const testSites = createTestSites();

  it("shows all sites when no filters applied", () => {
    const filteredResult = applyFilters(testSites, emptyFilters);

    const { container } = renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    // Should have 3 data rows (plus 1 header row)
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);
  });

  it("shows only mosque sites when mosque type filter applied", () => {
    const mosqueFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["mosque"],
    };

    const filteredResult = applyFilters(testSites, mosqueFilter);

    renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    // Should show "Al-Omari Mosque" in the table
    expect(screen.getByText("Al-Omari Mosque")).toBeInTheDocument();

    // Should not show church or museum
    expect(screen.queryByText("Saint Porphyrius Church")).not.toBeInTheDocument();
    expect(screen.queryByText("Gaza Museum")).not.toBeInTheDocument();

    expect(filteredResult.count).toBe(1);
  });

  it("shows only destroyed sites when destroyed status filter applied", () => {
    const destroyedFilter: FilterState = {
      ...emptyFilters,
      selectedStatuses: ["destroyed"],
    };

    const filteredResult = applyFilters(testSites, destroyedFilter);

    const { container } = renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    // Should have 2 data rows (mosque-1 and museum-1)
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(2);
    expect(filteredResult.count).toBe(2);
  });

  it("shows correct sites when combining filters", () => {
    const combinedFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["mosque", "church"],
    };

    const filteredResult = applyFilters(testSites, combinedFilter);

    renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    // Should show mosque and church
    expect(screen.getByText("Al-Omari Mosque")).toBeInTheDocument();
    expect(screen.getByText("Saint Porphyrius Church")).toBeInTheDocument();

    // Should not show museum
    expect(screen.queryByText("Gaza Museum")).not.toBeInTheDocument();

    expect(filteredResult.count).toBe(2);
  });

  it("shows sites matching search term filter", () => {
    const searchFilter: FilterState = {
      ...emptyFilters,
      searchTerm: "Gaza",
    };

    const filteredResult = applyFilters(testSites, searchFilter);

    renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    // Should show "Gaza Museum"
    expect(screen.getByText("Gaza Museum")).toBeInTheDocument();

    // Should not show mosque or church
    expect(screen.queryByText("Al-Omari Mosque")).not.toBeInTheDocument();
    expect(screen.queryByText("Saint Porphyrius Church")).not.toBeInTheDocument();

    expect(filteredResult.count).toBe(1);
  });

  it("shows no sites when filter matches nothing", () => {
    const noMatchFilter: FilterState = {
      ...emptyFilters,
      searchTerm: "NonExistentSiteName12345",
    };

    const filteredResult = applyFilters(testSites, noMatchFilter);

    const { container } = renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    // Should have 0 data rows
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(0);
    expect(filteredResult.count).toBe(0);
  });

  it("highlights correct row when site is highlighted and filtered", () => {
    const mosqueFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["mosque"],
    };

    const filteredResult = applyFilters(testSites, mosqueFilter);

    const { container } = renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId="mosque-1"
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    // Should have 1 row that is highlighted
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(1);
    expect(rows[0].className).toContain("bg-"); // Has highlight background
  });
});

describe("Filter Integration - Cross-Component Consistency", () => {
  const testSites = createTestSites();

  it("all components show same filtered subset when mosque filter applied", async () => {
    const mosqueFilter: FilterState = {
      ...emptyFilters,
      selectedTypes: ["mosque"],
    };

    const filteredResult = applyFilters(testSites, mosqueFilter);

    // Verify filtered result
    expect(filteredResult.count).toBe(1);
    expect(filteredResult.filteredSites[0].id).toBe("mosque-1");

    // Timeline
    const { container: timelineContainer } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    await waitFor(() => {
      const dots = timelineContainer.querySelectorAll(".event-marker");
      expect(dots.length).toBe(1);
    });

    // Map
    const { container: mapContainer } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    const circles = mapContainer.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(1);

    // Table
    const { container: tableContainer } = renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    const rows = tableContainer.querySelectorAll("tbody tr");
    expect(rows.length).toBe(1);

    // All components show the SAME site
    expect(screen.getByText("Al-Omari Mosque")).toBeInTheDocument();
  });

  it("all components show same filtered subset when destroyed filter applied", async () => {
    const destroyedFilter: FilterState = {
      ...emptyFilters,
      selectedStatuses: ["destroyed"],
    };

    const filteredResult = applyFilters(testSites, destroyedFilter);

    // Verify filtered result
    expect(filteredResult.count).toBe(2);

    // Timeline
    const { container: timelineContainer } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    await waitFor(() => {
      const dots = timelineContainer.querySelectorAll(".event-marker");
      expect(dots.length).toBe(2);
    });

    // Map
    const { container: mapContainer } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    const circles = mapContainer.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(2);

    // Table
    const { container: tableContainer } = renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    const rows = tableContainer.querySelectorAll("tbody tr");
    expect(rows.length).toBe(2);
  });

  it("all components show all sites when filters are cleared", async () => {
    const filteredResult = applyFilters(testSites, emptyFilters);

    // Verify no filtering
    expect(filteredResult.count).toBe(3);
    expect(filteredResult.total).toBe(3);

    // Timeline
    const { container: timelineContainer } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    await waitFor(() => {
      const dots = timelineContainer.querySelectorAll(".event-marker");
      expect(dots.length).toBe(3);
    });

    // Map
    const { container: mapContainer } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    const circles = mapContainer.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(3);

    // Table
    const { container: tableContainer } = renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    const rows = tableContainer.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);
  });

  it("all components show empty state when no sites match filter", async () => {
    const noMatchFilter: FilterState = {
      ...emptyFilters,
      searchTerm: "NonExistentSiteName12345",
    };

    const filteredResult = applyFilters(testSites, noMatchFilter);

    // Verify no results
    expect(filteredResult.count).toBe(0);

    // Timeline
    const { container: timelineContainer } = renderWithTheme(
      <AnimationProvider sites={filteredResult.filteredSites}>
        <TimelineScrubber
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </AnimationProvider>
    );

    await waitFor(() => {
      const dots = timelineContainer.querySelectorAll(".event-marker");
      expect(dots.length).toBe(0);
    });

    // Map
    const { container: mapContainer } = renderWithTheme(
      <MapContainer center={[31.5, 34.5]} zoom={10}>
        <MapMarkers
          sites={filteredResult.filteredSites}
          highlightedSiteId={null}
          onSiteHighlight={() => {}}
        />
      </MapContainer>
    );

    const circles = mapContainer.querySelectorAll("path.leaflet-interactive");
    expect(circles.length).toBe(0);

    // Table
    const { container: tableContainer } = renderWithTheme(
      <SitesTable
        sites={filteredResult.filteredSites}
        variant="compact"
        highlightedSiteId={null}
        onSiteClick={() => {}}
        onSiteHighlight={() => {}}
      />
    );

    const rows = tableContainer.querySelectorAll("tbody tr");
    expect(rows.length).toBe(0);
  });
});
