import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { TimelineControls } from "./TimelineControls";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { LocaleProvider } from "../../contexts/LocaleContext";

/**
 * Baseline tests for TimelineControls responsive behavior
 *
 * These tests verify the CURRENT behavior works correctly.
 * They serve as regression tests during refactoring.
 *
 * Focus: Test USER-VISIBLE behavior, not implementation details
 */

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LocaleProvider>
      {children}
    </LocaleProvider>
  </ThemeProvider>
);

describe("TimelineControls - Baseline Behavior", () => {
  const defaultProps = {
    isPlaying: false,
    isAtStart: false,
    speed: 1 as const,
    zoomToSiteEnabled: true,
    mapMarkersVisible: true,
    advancedMode: false,
    hidePlayControls: false,
    syncMapOnDotClick: false,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onReset: vi.fn(),
    onSpeedChange: vi.fn(),
    onZoomToSiteToggle: vi.fn(),
    onMapMarkersToggle: vi.fn(),
    onSyncMapToggle: vi.fn(),
  };

  describe("Basic Rendering", () => {
    it("renders play button when not playing", () => {
      render(<TimelineControls {...defaultProps} isPlaying={false} />, { wrapper: Wrapper });
      expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
    });

    it("renders pause button when playing", () => {
      render(<TimelineControls {...defaultProps} isPlaying={true} />, { wrapper: Wrapper });
      expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
    });

    it("renders reset button", () => {
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });
      expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    });

    it("renders settings menu button", () => {
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });
      expect(screen.getByRole("button", { name: /timeline settings/i })).toBeInTheDocument();
    });
  });

  describe("Settings Menu Interaction", () => {
    it("opens settings menu when clicked", async () => {
      const user = userEvent.setup();
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });

      const settingsButton = screen.getByRole("button", { name: /timeline settings/i });
      await user.click(settingsButton);

      // Menu should open
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
    });

    it("shows toggle options in settings menu", async () => {
      const user = userEvent.setup();
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /timeline settings/i }));

      const menu = screen.getByRole("menu");
      expect(menu).toHaveTextContent(/zoom to site/i);
      expect(menu).toHaveTextContent(/show map markers/i);
    });

    it("shows speed control in settings menu", async () => {
      const user = userEvent.setup();
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /timeline settings/i }));

      const menu = screen.getByRole("menu");
      expect(menu).toHaveTextContent(/speed/i);
    });

    it("hides speed control when hidePlayControls is true", async () => {
      const user = userEvent.setup();
      render(<TimelineControls {...defaultProps} hidePlayControls={true} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /timeline settings/i }));

      const menu = screen.getByRole("menu");
      expect(menu).not.toHaveTextContent(/speed/i);
    });

    it("includes sync map option when advancedMode is true", async () => {
      const user = userEvent.setup();
      render(<TimelineControls {...defaultProps} advancedMode={true} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /timeline settings/i }));

      const menu = screen.getByRole("menu");
      expect(menu).toHaveTextContent(/sync map/i);
    });

    it("closes menu when toggle option clicked", async () => {
      const user = userEvent.setup();
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /timeline settings/i }));
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      // Click a toggle option in the menu (use within to scope to menu only)
      const zoomButton = within(menu).getByText(/zoom to site/i).closest("button");
      await user.click(zoomButton!);

      // Menu should close
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("Control Interactions", () => {
    it("calls onPlay when play button clicked", async () => {
      const user = userEvent.setup();
      const onPlay = vi.fn();
      render(<TimelineControls {...defaultProps} onPlay={onPlay} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /play/i }));
      expect(onPlay).toHaveBeenCalledOnce();
    });

    it("calls onPause when pause button clicked", async () => {
      const user = userEvent.setup();
      const onPause = vi.fn();
      render(<TimelineControls {...defaultProps} isPlaying={true} onPause={onPause} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /pause/i }));
      expect(onPause).toHaveBeenCalledOnce();
    });

    it("calls onReset when reset button clicked", async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();
      render(<TimelineControls {...defaultProps} onReset={onReset} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /reset/i }));
      expect(onReset).toHaveBeenCalledOnce();
    });

    it("calls onZoomToSiteToggle when zoom option clicked in menu", async () => {
      const user = userEvent.setup();
      const onZoomToSiteToggle = vi.fn();
      render(<TimelineControls {...defaultProps} onZoomToSiteToggle={onZoomToSiteToggle} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /timeline settings/i }));

      const menu = screen.getByRole("menu");
      const zoomButton = within(menu).getByText(/zoom to site/i).closest("button");
      await user.click(zoomButton!);

      expect(onZoomToSiteToggle).toHaveBeenCalledOnce();
    });
  });

  describe("Conditional Rendering", () => {
    it("hides play/pause buttons when hidePlayControls is true", () => {
      render(<TimelineControls {...defaultProps} hidePlayControls={true} />, { wrapper: Wrapper });

      expect(screen.queryByRole("button", { name: /play/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /pause/i })).not.toBeInTheDocument();
    });

    it("disables reset button when isAtStart is true", () => {
      render(<TimelineControls {...defaultProps} isAtStart={true} />, { wrapper: Wrapper });

      const resetButton = screen.getByRole("button", { name: /reset/i });
      expect(resetButton).toBeDisabled();
    });
  });

  describe("Active States", () => {
    it("shows checkmark for active zoom toggle in menu", async () => {
      const user = userEvent.setup();
      render(<TimelineControls {...defaultProps} zoomToSiteEnabled={true} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /timeline settings/i }));

      const menu = screen.getByRole("menu");
      const zoomButton = within(menu).getByText(/zoom to site/i).closest("button");

      // Should have checkmark
      expect(zoomButton).toHaveTextContent("✓");
    });

    it("shows checkmark for active markers toggle in menu", async () => {
      const user = userEvent.setup();
      render(<TimelineControls {...defaultProps} mapMarkersVisible={true} />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /timeline settings/i }));

      const menu = screen.getByRole("menu");
      const markersButton = within(menu).getByText(/show map markers/i).closest("button");
      expect(markersButton).toHaveTextContent("✓");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels on all buttons", () => {
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });

      expect(screen.getByRole("button", { name: /play/i })).toHaveAccessibleName();
      expect(screen.getByRole("button", { name: /reset/i })).toHaveAccessibleName();
      expect(screen.getByRole("button", { name: /timeline settings/i })).toHaveAccessibleName();
    });

    it("settings button has aria-expanded attribute", () => {
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });

      const settingsButton = screen.getByRole("button", { name: /timeline settings/i });
      expect(settingsButton).toHaveAttribute("aria-expanded");
    });

    it("settings button has aria-haspopup attribute", () => {
      render(<TimelineControls {...defaultProps} />, { wrapper: Wrapper });

      const settingsButton = screen.getByRole("button", { name: /timeline settings/i });
      expect(settingsButton).toHaveAttribute("aria-haspopup", "menu");
    });
  });
});
