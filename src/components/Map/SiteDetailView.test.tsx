import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SiteDetailView } from "./SiteDetailView";
import type { GazaSite } from "../../types";

// Mock Leaflet components
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

// Mock Leaflet library
vi.mock("leaflet", () => ({
  default: {
    divIcon: vi.fn(() => ({})),
  },
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

describe("SiteDetailView", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("shows Gaza overview label when no site is highlighted", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    expect(screen.getByText("Gaza Overview (Satellite)")).toBeInTheDocument();
  });

  it("shows site detail label when a site is highlighted", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);
    expect(screen.getByText("Site Detail (Satellite)")).toBeInTheDocument();
    expect(screen.getByText("Great Omari Mosque")).toBeInTheDocument();
  });

  it("renders satellite tile layer", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
  });

  it("does not render marker when no site is highlighted", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    expect(screen.queryByTestId("marker")).not.toBeInTheDocument();
  });

  it("renders marker when a site is highlighted", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);
    const marker = screen.getByTestId("marker");
    expect(marker).toBeInTheDocument();
    expect(marker.getAttribute("data-position")).toBe(
      JSON.stringify(mockSites[0].coordinates)
    );
  });

  it("handles invalid highlightedSiteId gracefully", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId="invalid-id" />);
    expect(screen.getByText("Gaza Overview (Satellite)")).toBeInTheDocument();
    expect(screen.queryByTestId("marker")).not.toBeInTheDocument();
  });

  it("handles empty sites array", () => {
    render(<SiteDetailView sites={[]} highlightedSiteId={null} />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getByText("Gaza Overview (Satellite)")).toBeInTheDocument();
  });

  it("updates when highlightedSiteId changes", () => {
    const { rerender } = render(
      <SiteDetailView sites={mockSites} highlightedSiteId={null} />
    );
    expect(screen.getByText("Gaza Overview (Satellite)")).toBeInTheDocument();

    rerender(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);
    expect(screen.getByText("Site Detail (Satellite)")).toBeInTheDocument();
    expect(screen.getByText("Great Omari Mosque")).toBeInTheDocument();
  });

  it("switches between different highlighted sites", () => {
    const { rerender } = render(
      <SiteDetailView sites={mockSites} highlightedSiteId="1" />
    );
    expect(screen.getByText("Great Omari Mosque")).toBeInTheDocument();

    rerender(<SiteDetailView sites={mockSites} highlightedSiteId="2" />);
    expect(screen.getByText("Al-Saqqa Mosque")).toBeInTheDocument();
  });

  it("renders TimeToggle component", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    // TimeToggle renders with 3 buttons
    expect(screen.getByLabelText("Switch to 2014 Baseline satellite imagery")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to Aug 2023 (Pre-conflict) satellite imagery")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to Current satellite imagery")).toBeInTheDocument();
  });

  it("displays time period label when no site is highlighted", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);
    // The label should show the period label (Aug 2023 (Pre-conflict))
    expect(screen.getByText("Gaza Overview (Satellite)")).toBeInTheDocument();
    expect(screen.getByText("Aug 2023 (Pre-conflict)")).toBeInTheDocument();
  });

  it("shows site name instead of period label when site is highlighted", () => {
    render(<SiteDetailView sites={mockSites} highlightedSiteId="1" />);
    expect(screen.getByText("Great Omari Mosque")).toBeInTheDocument();
    // Period label not shown when site is highlighted
    expect(screen.queryByText("Aug 2023 (Pre-conflict)")).not.toBeInTheDocument();
  });
});
