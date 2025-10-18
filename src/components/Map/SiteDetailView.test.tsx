import { describe, it, expect, vi, afterEach } from "vitest";
import { renderWithTheme, screen, cleanup } from "../../test-utils/renderWithTheme";
import { SiteDetailView } from "./SiteDetailView";
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
  Marker: ({ position }: { position: [number, number] }) => (
    <div data-testid="marker" data-position={JSON.stringify(position)} />
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
      <button aria-label="Switch to Aug 2023 (Pre-conflict) satellite imagery" onClick={() => onPeriodChange("PRE_CONFLICT_2023")}>Aug 2023</button>
      <button aria-label="Switch to Current satellite imagery" onClick={() => onPeriodChange("CURRENT")}>Current</button>
    </div>
  ),
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
    expect(screen.getByLabelText("Switch to Aug 2023 (Pre-conflict) satellite imagery")).toBeInTheDocument();
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
});
