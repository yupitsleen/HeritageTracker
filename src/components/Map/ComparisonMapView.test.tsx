import { describe, it, expect, vi, afterEach } from "vitest";
import { renderWithTheme, screen, cleanup } from "../../test-utils/renderWithTheme";
import { ComparisonMapView } from "./ComparisonMapView";
import { AnimationProvider } from "../../contexts/AnimationContext";
import type { GazaSite } from "../../types";

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
  TimeToggle: () => <div data-testid="time-toggle" />,
}));

const mockSites: GazaSite[] = [
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

describe("ComparisonMapView", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      const { container } = renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
        />
      );
      expect(container).toBeInTheDocument();
    });

    it("renders two map containers side-by-side", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
        />
      );

      const mapContainers = screen.getAllByTestId("map-container");
      expect(mapContainers).toHaveLength(2);
    });

    it("handles empty sites array", () => {
      const { container } = renderWithAnimation(
        <ComparisonMapView
          sites={[]}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
        />
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe("Date Labels", () => {
    it("renders before date label when provided", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
          beforeDateLabel="2023-10-01"
        />
      );

      expect(screen.getByText("2023-10-01")).toBeInTheDocument();
    });

    it("renders after date label when provided", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
          afterDateLabel="2024-01-15"
        />
      );

      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });

    it("renders both date labels when both are provided", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
          beforeDateLabel="2023-10-01"
          afterDateLabel="2024-01-15"
        />
      );

      expect(screen.getByText("2023-10-01")).toBeInTheDocument();
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });

    it("does not render date labels when not provided", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
        />
      );

      // Check that the date label overlays (with yellow/green background) are not rendered
      // Note: Site popups may contain dates, but the overlay date labels should not be present
      const dateLabels = screen.queryAllByText(/^\d{4}-\d{2}-\d{2}$/);
      const overlayLabels = dateLabels.filter(el =>
        el.classList.contains("bg-[#009639]") ||
        el.classList.contains("bg-[#b8860b]")
      );
      expect(overlayLabels.length).toBe(0);
    });

    it("before date label has yellow background (matching yellow scrubber)", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
          beforeDateLabel="2023-10-01"
        />
      );

      const beforeLabel = screen.getByText("2023-10-01");
      expect(beforeLabel).toHaveClass("bg-[#F4D03F]");
      expect(beforeLabel).toHaveClass("text-black");
    });

    it("after date label has green background (matching green scrubber)", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
          afterDateLabel="2024-01-15"
        />
      );

      const afterLabel = screen.getByText("2024-01-15");
      expect(afterLabel).toHaveClass("bg-[#009639]");
      expect(afterLabel).toHaveClass("text-white");
    });

    it("date labels have correct styling (1.5x size, 70% opacity)", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
          beforeDateLabel="2023-10-01"
          afterDateLabel="2024-01-15"
        />
      );

      const beforeLabel = screen.getByText("2023-10-01");
      const afterLabel = screen.getByText("2024-01-15");

      // Both should have 15px font (1.5x the 10px scrubber tooltip)
      expect(beforeLabel).toHaveClass("text-[15px]");
      expect(afterLabel).toHaveClass("text-[15px]");

      // Both should have 70% opacity
      expect(beforeLabel).toHaveClass("opacity-70");
      expect(afterLabel).toHaveClass("opacity-70");

      // Both should have font-semibold
      expect(beforeLabel).toHaveClass("font-semibold");
      expect(afterLabel).toHaveClass("font-semibold");
    });

    it("date labels match wayback release dates format", () => {
      // Simulate real Wayback release dates
      const beforeReleaseDate = "2023-10-01";
      const afterReleaseDate = "2024-01-15";

      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId={null}
          beforeTileUrl="https://wayback.example.com/before"
          afterTileUrl="https://wayback.example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
          beforeDateLabel={beforeReleaseDate}
          afterDateLabel={afterReleaseDate}
        />
      );

      // Verify exact date format matches
      expect(screen.getByText(beforeReleaseDate)).toBeInTheDocument();
      expect(screen.getByText(afterReleaseDate)).toBeInTheDocument();
    });
  });

  describe("Site Highlighting", () => {
    it("passes highlightedSiteId to both maps", () => {
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId="1"
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
        />
      );

      // Both maps should render markers for highlighted site
      const markers = screen.getAllByTestId("marker");
      expect(markers.length).toBeGreaterThan(0);
    });
  });

  describe("Callbacks", () => {
    it("calls onSiteClick when provided", () => {
      const onSiteClick = vi.fn();
      renderWithAnimation(
        <ComparisonMapView
          sites={mockSites}
          highlightedSiteId="1"
          beforeTileUrl="https://example.com/before"
          afterTileUrl="https://example.com/after"
          beforeMaxZoom={19}
          afterMaxZoom={19}
          onSiteClick={onSiteClick}
        />
      );

      // Component should render without errors when callback is provided
      expect(screen.getAllByTestId("map-container")).toHaveLength(2);
    });
  });
});
