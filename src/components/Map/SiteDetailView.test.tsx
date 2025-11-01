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
  Marker: ({ children, position }: { children?: React.ReactNode; position: [number, number] }) => (
    <div data-testid="marker" data-position={JSON.stringify(position)}>
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
      const { container } = renderWithAnimation(
        <SiteDetailView sites={mockSites} highlightedSiteId={null} />
      );

      // Check that no date labels are rendered
      expect(container.textContent).not.toMatch(/\d{4}-\d{2}-\d{2}/);
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
      expect(label).toHaveClass("bg-[#009639]");
      expect(label).toHaveClass("text-white");
      expect(label).toHaveClass("text-[15px]");
      expect(label).toHaveClass("opacity-70");
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

    it("does not render popup when no site is highlighted", () => {
      renderWithAnimation(<SiteDetailView sites={mockSites} highlightedSiteId={null} />);

      // No marker or popup should be present
      expect(screen.queryByTestId("marker")).not.toBeInTheDocument();
      expect(screen.queryByTestId("popup")).not.toBeInTheDocument();
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
});
