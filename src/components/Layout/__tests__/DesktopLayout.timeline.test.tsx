import { describe, it, expect, vi } from "vitest";
import { renderWithTheme } from "../../../test-utils/renderWithTheme";
import { TimelineScrubber } from "../../Timeline/TimelineScrubber";
import { AnimationProvider } from "../../../contexts/AnimationContext";
import type { Site } from "../../../types";

// Mock ResizeObserver for jsdom environment
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock observe method
  }
  unobserve() {
    // Mock unobserve method
  }
  disconnect() {
    // Mock disconnect method
  }
};

// Mock D3 drag behavior - returns a proper drag behavior function
vi.mock("d3", async () => {
  const actual = await vi.importActual<typeof import("d3")>("d3");
  return {
    ...actual,
    drag: () => {
      const dragBehavior = function () {
        // Mock drag behavior that does nothing
      };
      dragBehavior.on = vi.fn().mockReturnValue(dragBehavior);
      return dragBehavior;
    },
  };
});

const mockSites: Site[] = [
  {
    id: "test-site-1",
    name: "Test Site 1",
    type: "mosque",
    yearBuilt: "7th century",
    coordinates: [31.5, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    description: "Test description",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
  {
    id: "test-site-2",
    name: "Test Site 2",
    type: "church",
    yearBuilt: "5th century",
    coordinates: [31.6, 34.6],
    status: "heavily-damaged",
    dateDestroyed: "2023-11-01",
    description: "Test description 2",
    historicalSignificance: "Test significance 2",
    culturalValue: "Test value 2",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
];

describe("DesktopLayout - Timeline Integration", () => {
  describe("Dashboard Timeline Configuration", () => {
    it("does not render Sync Map button on Dashboard when onSyncMapToggle is undefined", () => {
      const { queryByText } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={mockSites}
            advancedMode={{
              syncMapOnDotClick: false,
              onSyncMapToggle: undefined,
            }}
          />
        </AnimationProvider>
      );

      // Should NOT show "Sync Map" button when onSyncMapToggle is undefined
      // This allows hiding the button on Dashboard while keeping it on Timeline page
      expect(queryByText(/Sync Map/i)).not.toBeInTheDocument();
    });

    it("renders Previous/Next navigation buttons even when Sync Map is hidden", () => {
      const { getByText, queryByText } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={mockSites}
            advancedMode={{
              syncMapOnDotClick: false,
              onSyncMapToggle: undefined,
            }}
          />
        </AnimationProvider>
      );

      // Should show Previous/Next buttons (advancedMode is truthy)
      expect(getByText(/⏮ Previous/i)).toBeInTheDocument();
      expect(getByText(/Next ⏭/i)).toBeInTheDocument();

      // But NOT show Sync Map button
      expect(queryByText(/Sync Map/i)).not.toBeInTheDocument();
    });

    it("hides map settings (Zoom to Site, Show Map Markers) when hideMapSettings is true", () => {
      const { queryByText, getByText, getByRole, getAllByText } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={mockSites}
            advancedMode={{
              syncMapOnDotClick: false,
              onSyncMapToggle: undefined,
              showNavigation: true, // Show Previous/Next buttons
              hidePlayControls: false, // Show Play/Pause/Speed controls on Dashboard
              hideMapSettings: true, // Hide map settings on Dashboard (moved to map)
            }}
          />
        </AnimationProvider>
      );

      // Should show these buttons
      expect(getByText(/Reset/i)).toBeInTheDocument();
      expect(getByText(/⏮ Previous/i)).toBeInTheDocument();
      expect(getByText(/Next ⏭/i)).toBeInTheDocument();

      // Should SHOW Play button when hidePlayControls is false
      expect(getByRole("button", { name: /^play$/i })).toBeInTheDocument();

      // Should SHOW Speed control even when map settings are hidden
      // Note: Speed label appears twice (responsive design), so use getAllByText
      const speedLabels = getAllByText(/Speed:/i);
      expect(speedLabels.length).toBeGreaterThan(0);

      // Should NOT show map settings when hideMapSettings is true
      expect(queryByText(/Zoom to Site/i)).not.toBeInTheDocument();
      expect(queryByText(/Show Map Markers/i)).not.toBeInTheDocument();

      // Should NOT show Sync Map button
      expect(queryByText(/Sync Map/i)).not.toBeInTheDocument();

      // Should NOT show Settings menu button when hideMapSettings is true
      expect(queryByText(/Settings/i)).not.toBeInTheDocument();
    });

    it("shows map settings (Zoom to Site, Show Map Markers) when hideMapSettings is false or undefined", () => {
      const { getByText } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={mockSites}
            advancedMode={{
              syncMapOnDotClick: false,
              onSyncMapToggle: undefined,
              showNavigation: true,
              hidePlayControls: false,
              hideMapSettings: false, // Explicitly show map settings
            }}
          />
        </AnimationProvider>
      );

      // Should show map settings when hideMapSettings is false
      expect(getByText(/Zoom to Site/i)).toBeInTheDocument();
      expect(getByText(/Show Map Markers/i)).toBeInTheDocument();
    });
  });

  describe("Timeline Page Configuration", () => {
    it("renders Sync Map button on Timeline page when onSyncMapToggle is provided", () => {
      const { getByText } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={mockSites}
            advancedMode={{
              syncMapOnDotClick: false,
              onSyncMapToggle: vi.fn(),
            }}
          />
        </AnimationProvider>
      );

      // Should show "Sync Map" button when onSyncMapToggle is a valid function
      const syncButton = getByText(/Sync Map/i);
      expect(syncButton).toBeInTheDocument();
    });

    it("calls onSyncMapToggle when Sync Map button is clicked", async () => {
      const mockToggle = vi.fn();
      const { getByText } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={mockSites}
            advancedMode={{
              syncMapOnDotClick: false,
              onSyncMapToggle: mockToggle,
            }}
          />
        </AnimationProvider>
      );

      const syncButton = getByText(/Sync Map/i);
      syncButton.click();

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("Advanced Mode vs Normal Mode", () => {
    it("shows Play/Pause buttons in normal mode (no advancedMode prop)", () => {
      const { getByRole } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber sites={mockSites} />
        </AnimationProvider>
      );

      // Should show Play button in normal mode
      const playButton = getByRole("button", { name: /^play$/i });
      expect(playButton).toBeInTheDocument();
    });

    it("hides Play/Pause buttons when hidePlayControls is true", () => {
      const { queryByRole } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={mockSites}
            advancedMode={{
              syncMapOnDotClick: false,
              onSyncMapToggle: vi.fn(),
              hidePlayControls: true, // Explicitly hide Play/Pause controls
            }}
          />
        </AnimationProvider>
      );

      // Should NOT show Play/Pause button controls when hidePlayControls is true
      // Note: keyboard hint may contain "Play/Pause" text, so use button role
      expect(queryByRole("button", { name: /^play$/i })).not.toBeInTheDocument();
      expect(queryByRole("button", { name: /^pause$/i })).not.toBeInTheDocument();
    });

    it("shows Previous/Next only in advanced mode", () => {
      const normalMode = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber sites={mockSites} />
        </AnimationProvider>
      );

      // Should NOT show Previous/Next in normal mode
      expect(normalMode.queryByText(/⏮ Previous/i)).not.toBeInTheDocument();
      expect(normalMode.queryByText(/Next ⏭/i)).not.toBeInTheDocument();

      const advancedMode = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={mockSites}
            advancedMode={{
              syncMapOnDotClick: false,
              onSyncMapToggle: undefined,
            }}
          />
        </AnimationProvider>
      );

      // Should show Previous/Next in advanced mode
      expect(advancedMode.getByText(/⏮ Previous/i)).toBeInTheDocument();
      expect(advancedMode.getByText(/Next ⏭/i)).toBeInTheDocument();
    });
  });
});
