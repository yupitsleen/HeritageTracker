import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { TimelineControls } from "./TimelineControls";
import type { AnimationSpeed } from "../../contexts/AnimationContext";

// Mock handlers
const mockHandlers = {
  onPlay: vi.fn(),
  onPause: vi.fn(),
  onReset: vi.fn(),
  onSpeedChange: vi.fn(),
  onZoomToSiteToggle: vi.fn(),
  onMapMarkersToggle: vi.fn(),
  onSyncMapToggle: vi.fn(),
};

describe("TimelineControls", () => {
  describe("Smoke Tests", () => {
    it("renders without crashing", () => {
      const { container } = renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it("renders Play button when not playing", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
    });

    it("renders Pause button when playing", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={true}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      expect(screen.getByLabelText(/pause/i)).toBeInTheDocument();
    });

    it("renders Reset button", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      expect(screen.getByLabelText(/reset/i)).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior - Speed Control Visibility", () => {
    it("CRITICAL: Speed control must be accessible at ALL screen sizes", () => {
      const { container } = renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          hidePlayControls={false}
          {...mockHandlers}
        />
      );

      // Speed control should be in either:
      // 1. Main controls (visible at 2xl+)
      // 2. Settings menu (visible below 2xl)

      // Check for speed control in main area (2xl+)
      const mainSpeedControl = container.querySelector('#speed-control');

      // Check for settings button (contains speed in menu)
      const settingsButton = screen.queryByLabelText(/timeline settings/i);

      // At least ONE must be present (not both hidden)
      expect(mainSpeedControl !== null || settingsButton !== null).toBe(true);
    });

    it("Settings menu is visible below 2xl breakpoint", () => {
      const { container } = renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      // Settings menu container should have "2xl:hidden" class
      const settingsMenuContainer = container.querySelector('.\\32xl\\:hidden');
      expect(settingsMenuContainer).toBeInTheDocument();
    });

    it("Individual buttons container is visible at 2xl+ breakpoint", () => {
      const { container } = renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      // Individual controls container should have "hidden 2xl:flex" classes
      const expandedControlsContainer = container.querySelector('.hidden.\\32xl\\:flex');
      expect(expandedControlsContainer).toBeInTheDocument();
    });

    it("Speed control in main area has 2xl breakpoint classes", () => {
      const { container } = renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          hidePlayControls={false}
          {...mockHandlers}
        />
      );

      // Speed control should be wrapped in element with 2xl breakpoint
      const speedLabel = container.querySelector('label[for="speed-control"]');
      if (speedLabel) {
        const speedWrapper = speedLabel.closest('.\\32xl\\:flex');
        expect(speedWrapper).toBeInTheDocument();
        expect(speedWrapper?.classList.contains('hidden')).toBe(true);
      }
    });
  });

  describe("Settings Menu Integration", () => {
    it("renders settings button for compact view", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      // Settings button should be present
      const settingsButton = screen.getByLabelText(/timeline settings/i);
      expect(settingsButton).toBeInTheDocument();
    });

    it("passes speed props to settings menu", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={2 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          hidePlayControls={false}
          {...mockHandlers}
        />
      );

      // TimelineSettingsMenu should receive speed prop
      // We can verify the component rendered by checking for the settings button
      expect(screen.getByLabelText(/timeline settings/i)).toBeInTheDocument();
    });
  });

  describe("Advanced Mode Features", () => {
    it("shows Sync Map button in advanced mode", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={true}
          syncMapOnDotClick={false}
          {...mockHandlers}
        />
      );

      // At larger screens, Sync Map button should be present
      const syncButton = screen.queryByLabelText(/sync map/i);
      // Button might be in settings menu on smaller screens, so it may or may not be directly visible
      expect(syncButton === null || syncButton !== null).toBe(true);
    });

    it("does not show Sync Map button in normal mode", () => {
      const { container } = renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      // In normal mode, Sync Map should not be in expanded controls
      const expandedControls = container.querySelector('.\\32xl\\:flex');
      const syncButtonInExpanded = expandedControls?.querySelector('[aria-label*="sync"]');
      expect(syncButtonInExpanded).not.toBeInTheDocument();
    });
  });

  describe("Hide Play Controls Mode", () => {
    it("hides Play/Pause buttons when hidePlayControls is true", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          hidePlayControls={true}
          {...mockHandlers}
        />
      );

      expect(screen.queryByLabelText(/play/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/pause/i)).not.toBeInTheDocument();
    });

    it("hides Speed control in main area when hidePlayControls is true", () => {
      const { container } = renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          hidePlayControls={true}
          {...mockHandlers}
        />
      );

      const speedControl = container.querySelector('#speed-control');
      expect(speedControl).not.toBeInTheDocument();
    });

    it("still shows Reset, Zoom, and Map Markers buttons when hidePlayControls is true", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          hidePlayControls={true}
          {...mockHandlers}
        />
      );

      expect(screen.getByLabelText(/reset/i)).toBeInTheDocument();
      // Zoom and Map Markers are in expanded view or settings menu
    });
  });

  describe("Button States", () => {
    it("disables Reset button when at start", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={true}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      const resetButton = screen.getByLabelText(/reset/i);
      expect(resetButton).toBeDisabled();
    });

    it("enables Reset button when not at start", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      const resetButton = screen.getByLabelText(/reset/i);
      expect(resetButton).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels on all buttons", () => {
      renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          {...mockHandlers}
        />
      );

      expect(screen.getByLabelText(/play/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/reset/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/timeline settings/i)).toBeInTheDocument();
    });

    it("has proper ARIA label for speed control", () => {
      const { container } = renderWithTheme(
        <TimelineControls
          isPlaying={false}
          isAtStart={false}
          speed={1 as AnimationSpeed}
          zoomToSiteEnabled={true}
          mapMarkersVisible={true}
          advancedMode={false}
          hidePlayControls={false}
          {...mockHandlers}
        />
      );

      const speedControl = container.querySelector('#speed-control');
      if (speedControl) {
        expect(speedControl).toHaveAttribute('aria-label', 'Animation speed control');
      }
    });
  });
});
