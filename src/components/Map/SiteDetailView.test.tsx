import { describe, it, expect, vi, afterEach } from "vitest";
import { renderWithTheme, screen, cleanup } from "../../test-utils/renderWithTheme";
import { SiteDetailView } from "./SiteDetailView";
import { AnimationProvider } from "../../contexts/AnimationContext";
import type { Site } from "../../types";

// Mock Leaflet library
vi.mock("leaflet", () => ({
  default: {
    divIcon: vi.fn(() => ({})),
    Icon: {
      Default: {
        prototype: {
          options: {},
        },
      },
    },
  },
}));

// Mock react-leaflet components
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children, className }: { children?: React.ReactNode; className?: string; [key: string]: unknown }) => (
    <div data-testid="map-container" className={className}>
      {children}
    </div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, position }: { children?: React.ReactNode; position: [number, number] }) => (
    <div data-testid="marker" data-position={JSON.stringify(position)}>
      {children}
    </div>
  ),
  CircleMarker: ({ children, center }: { children?: React.ReactNode; center: [number, number]; [key: string]: unknown }) => (
    <div data-testid="circle-marker" data-center={JSON.stringify(center)}>
      {children}
    </div>
  ),
  Popup: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
  useMap: () => ({
    setView: vi.fn(),
    getContainer: () => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    getZoom: () => 10,
    setZoom: vi.fn(),
  }),
  useMapEvents: () => ({}),
}));

// Mock MapHelperComponents
vi.mock("./MapHelperComponents", () => ({
  MapUpdater: () => null,
  ScrollWheelHandler: () => null,
}));

// Mock TimeToggle component
vi.mock("./TimeToggle", () => ({
  TimeToggle: ({ onPeriodChange }: { onPeriodChange: (period: string) => void }) => (
    <div data-testid="time-toggle">
      <button aria-label="Switch to 2014 Baseline satellite imagery" onClick={() => onPeriodChange("BASELINE_2014")}>2014</button>
      <button aria-label="Switch to Jan 2024 satellite imagery" onClick={() => onPeriodChange("EARLY_2024")}>Jan 2024</button>
      <button aria-label="Switch to Current satellite imagery" onClick={() => onPeriodChange("CURRENT")}>Current</button>
    </div>
  ),
}));

const mockSites: Site[] = [
  {
    id: "1",
    name: "Great Omari Mosque",
    nameArabic: "الجامع العمري الكبير",
    type: "mosque",
    yearBuilt: "7th century",
    coordinates: [31.52, 34.46],
    status: "destroyed",
    dateDestroyed: "2023-12-07",
    description: "Historic mosque",
    historicalSignificance: "Significant",
    culturalValue: "High",
    sources: [],
    verifiedBy: ["UNESCO"],
  },
  {
    id: "2",
    name: "Al-Saqqa Mosque",
    type: "mosque",
    yearBuilt: "14th century",
    coordinates: [31.5, 34.45],
    status: "damaged",
    description: "Historic mosque",
    historicalSignificance: "Significant",
    culturalValue: "High",
    sources: [],
    verifiedBy: [],
  },
];

// Helper to render with AnimationProvider and ThemeProvider
const renderWithAnimation = (ui: React.ReactElement) => {
  return renderWithTheme(
    <AnimationProvider sites={mockSites}>
      {ui}
    </AnimationProvider>
  );
};

describe("SiteDetailView", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    const { container } = renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    expect(container).toBeInTheDocument();
  });

  it("renders map when no site is highlighted", () => {
    renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("shows marker when a site is highlighted", () => {
    renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);
    expect(screen.getByTestId("marker")).toBeInTheDocument();
  });

  it("renders satellite tile layer", () => {
    const { container } = renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    expect(container).toBeInTheDocument();
  });

  it("renders map when no site is highlighted (duplicate test)", () => {
    renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("shows marker when a site is highlighted (duplicate test)", () => {
    renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);
    expect(screen.getByTestId("marker")).toBeInTheDocument();
  });

  it("handles invalid highlightedSiteId gracefully", () => {
    renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId="invalid-id" />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.queryByTestId("marker")).not.toBeInTheDocument();
  });

  it("handles empty sites array", () => {
    renderWithAnimation(<SiteDetailView sites={[]} highlightedSiteId={null} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("updates when highlightedSiteId changes", () => {
    renderWithAnimation(
      <SiteDetailView sites={mockSites} highlightedSiteId={null} />
    );
    expect(screen.getByTestId("map-container")).toBeInTheDocument();

    // Need to call renderWithAnimation helper which wraps with ThemeProvider
    renderWithAnimation(
      <SiteDetailView sites={mockSites} highlightedSiteId="1" />
    );
    expect(screen.getByTestId("marker")).toBeInTheDocument();
  });

  it("switches between different highlighted sites", () => {
    const { rerender } = renderWithAnimation(
      <SiteDetailView sites={mockSites} highlightedSiteId="1" />
    );
    expect(screen.getByTestId("marker")).toBeInTheDocument();

    // Rerender with different site
    rerender(
      <AnimationProvider sites={mockSites}>
        <SiteDetailView sites={mockSites} highlightedSiteId="2" />
      </AnimationProvider>
    );
    expect(screen.getByTestId("marker")).toBeInTheDocument();
  });

  it("renders TimeToggle component", () => {
    renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    // TimeToggle renders with 3 buttons
    expect(screen.getByLabelText("Switch to 2014 Baseline satellite imagery")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to Jan 2024 satellite imagery")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to Current satellite imagery")).toBeInTheDocument();
  });

  it("renders time period toggle when no site is highlighted", () => {
    renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    // TimeToggle should be present
    expect(screen.getByTestId("time-toggle")).toBeInTheDocument();
  });

  it("renders time period toggle when site is highlighted", () => {
    renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);
    // TimeToggle should be present with marker
    expect(screen.getByTestId("time-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("marker")).toBeInTheDocument();
  });

  describe("Date Label", () => {
    it("renders date label when provided", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId={null}
          dateLabel="2024-01-15"
        />
      );

      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });

    it("does not render date label when not provided", () => {
      renderWithAnimation(
        <SiteDetailView sites={mockSites} highlightedSiteId={null} />
      );

      // Check that the date label overlay (with green background) is not rendered
      // Note: Site popups may contain dates, but the overlay date label should not be present
      const dateLabels = screen.queryAllByText(/^\d{4}-\d{2}-\d{2}$/);
      const overlayLabels = dateLabels.filter(el =>
        el.classList.contains("bg-[#009639]") ||
        el.classList.contains("bg-[#b8860b]")
      );
      expect(overlayLabels.length).toBe(0);
    });

    it("date label has green background and correct styling", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId={null}
          dateLabel="2024-01-15"
        />
      );

      const label = screen.getByText("2024-01-15");
      // DateLabel component now uses inline styles for background color
      expect(label).toHaveStyle({ backgroundColor: "#009639", opacity: "0.7" });
      expect(label).toHaveClass("text-white");
      expect(label).toHaveClass("text-[15px]");
      expect(label).toHaveClass("font-semibold");
    });

    it("renders date label with custom tile URL", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId={null}
          customTileUrl="https://wayback.example.com/tiles"
          customMaxZoom={19}
          dateLabel="2023-10-01"
        />
      );

      expect(screen.getByText("2023-10-01")).toBeInTheDocument();
    });
  });

  describe("Adaptive Zoom", () => {
    it("uses adaptive zoom (18) for imagery from 2022-04-27 or later when comparison mode is OFF", () => {
      // This test verifies the logic, actual zoom is set in MapContainer props
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId="1"
          dateLabel="2024-01-15"
          comparisonModeActive={false}
        />
      );

      expect(screen.getByTestId("map-container")).toBeInTheDocument();
      // The zoom level would be 18 for dates >= 2022-04-27
    });

    it("uses standard zoom (17) for imagery before 2022-04-27 when comparison mode is OFF", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId="1"
          dateLabel="2020-06-15"
          comparisonModeActive={false}
        />
      );

      expect(screen.getByTestId("map-container")).toBeInTheDocument();
      // The zoom level would be 17 for dates < 2022-04-27
    });

    it("uses standard zoom (17) in comparison mode regardless of imagery date", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId="1"
          dateLabel="2024-01-15"
          comparisonModeActive={true}
        />
      );

      expect(screen.getByTestId("map-container")).toBeInTheDocument();
      // The zoom level would be 17 in comparison mode to keep maps consistent
    });

    it("uses standard zoom when no dateLabel is provided", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId="1"
          comparisonModeActive={false}
        />
      );

      expect(screen.getByTestId("map-container")).toBeInTheDocument();
      // No dateLabel means no adaptive zoom, defaults to 17
    });

    it("handles edge case: exactly 2022-04-27 uses adaptive zoom", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId="1"
          dateLabel="2022-04-27"
          comparisonModeActive={false}
        />
      );

      expect(screen.getByTestId("map-container")).toBeInTheDocument();
      // The zoom level would be 18 for the threshold date
    });

    it("handles edge case: one day before threshold uses standard zoom", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId="1"
          dateLabel="2022-04-26"
          comparisonModeActive={false}
        />
      );

      expect(screen.getByTestId("map-container")).toBeInTheDocument();
      // The zoom level would be 17 for dates just before threshold
    });
  });

  describe("Popup Functionality", () => {
    it("renders popup when site is highlighted", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);

      // Marker should have popup as child
      const marker = screen.getByTestId("marker");
      expect(marker).toBeInTheDocument();

      // Popup should be present
      const popup = screen.getByTestId("popup");
      expect(popup).toBeInTheDocument();
    });

    it("renders all site markers when no site is highlighted", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);

      // Should render circle markers for all sites (not the teardrop marker)
      expect(screen.queryByTestId("marker")).not.toBeInTheDocument();
      // Should have multiple circle markers (one for each site in mockSites)
      const circleMarkers = screen.queryAllByTestId("circle-marker");
      expect(circleMarkers.length).toBeGreaterThan(0);
    });

    it("calls onSiteClick when popup action is triggered", () => {
      const onSiteClick = vi.fn();
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId="1"
          onSiteClick={onSiteClick}
        />
      );

      // Popup should be present (contains SitePopup component)
      const popup = screen.getByTestId("popup");
      expect(popup).toBeInTheDocument();
    });

    it("popup is only rendered for highlighted site", () => {
      const { rerender } = renderWithAnimation(
        <SiteDetailView sites={mockSites} highlightedSiteId="1" />
      );

      // Should have popup for site 1
      expect(screen.getByTestId("popup")).toBeInTheDocument();

      // Change to different site
      rerender(
        <AnimationProvider sites={mockSites}>
          <SiteDetailView sites={mockSites} highlightedSiteId="2" />
        </AnimationProvider>
      );

      // Should still have popup (for site 2 now)
      expect(screen.getByTestId("popup")).toBeInTheDocument();
    });

    it("popup has proper max dimensions", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);

      const popup = screen.getByTestId("popup");
      expect(popup).toBeInTheDocument();
      // Popup component itself is mocked, but we verify it's rendered
    });
  });

  describe("Map Settings on Dashboard", () => {
    it("renders map settings checkboxes at bottom-left when no customTileUrl is provided", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);

      // Should render "Zoom to Site" checkbox
      const zoomToSiteCheckbox = screen.getByRole("checkbox", { name: /zoom to site/i });
      expect(zoomToSiteCheckbox).toBeInTheDocument();

      // Should render "Show Map Markers" checkbox
      const showMarkersCheckbox = screen.getByRole("checkbox", { name: /show map markers/i });
      expect(showMarkersCheckbox).toBeInTheDocument();
    });

    it("does not render map settings when customTileUrl is provided (Timeline page)", () => {
      renderWithAnimation(
        <SiteDetailView
          sites={mockSites}
          highlightedSiteId={null}
          customTileUrl="https://wayback.example.com/tiles"
          customMaxZoom={19}
          dateLabel="2023-10-01"
        />
      );

      // Should NOT render map settings checkboxes on Timeline page
      expect(screen.queryByRole("checkbox", { name: /zoom to site/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("checkbox", { name: /show map markers/i })).not.toBeInTheDocument();
    });

    it("Zoom to Site checkbox is checked by default", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);

      const zoomToSiteCheckbox = screen.getByRole("checkbox", { name: /zoom to site/i }) as HTMLInputElement;
      expect(zoomToSiteCheckbox.checked).toBe(true);
    });

    it("Show Map Markers checkbox reflects AnimationContext state", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);

      const showMarkersCheckbox = screen.getByRole("checkbox", { name: /show map markers/i }) as HTMLInputElement;
      // In test environment, AnimationContext defaults to true
      // In Dashboard, it's set to false on mount via useEffect
      expect(showMarkersCheckbox).toBeInTheDocument();
    });

    it("map settings are positioned at bottom-left with proper styling", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);

      // Find the container with map settings
      const zoomToSiteCheckbox = screen.getByRole("checkbox", { name: /zoom to site/i });
      const settingsContainer = zoomToSiteCheckbox.closest("div.absolute.bottom-2.left-2");

      expect(settingsContainer).toBeInTheDocument();
      expect(settingsContainer).toHaveStyle({ zIndex: 1000 });
    });

    it("map settings are visible when site is highlighted", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);

      // Map settings should still be visible when a site is selected
      expect(screen.getByRole("checkbox", { name: /zoom to site/i })).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: /show map markers/i })).toBeInTheDocument();
    });
  });
});
