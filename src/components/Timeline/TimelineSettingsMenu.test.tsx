import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { TimelineSettingsMenu } from "./TimelineSettingsMenu";
import type { AnimationSpeed } from "../../contexts/AnimationContext";

// Mock handlers
const mockHandlers = {
  onZoomToSite: vi.fn(),
  onMapMarkers: vi.fn(),
  onSyncMap: vi.fn(),
  onSpeedChange: vi.fn(),
};

// Helper to create default props
const createDefaultProps = () => ({
  toggles: {
    zoomToSite: true,
    mapMarkers: true,
  },
  onToggle: {
    zoomToSite: mockHandlers.onZoomToSite,
    mapMarkers: mockHandlers.onMapMarkers,
  },
});

describe("TimelineSettingsMenu", () => {
  describe("Smoke Tests", () => {
    it("renders without crashing", () => {
      const { container } = renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      expect(container).toBeInTheDocument();
    });

    it("renders settings button", () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      expect(screen.getByLabelText(/timeline settings/i)).toBeInTheDocument();
    });
  });

  describe("Menu Open/Close", () => {
    it("opens menu when settings button is clicked", async () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      // Menu items should be visible
      await waitFor(() => {
        expect(screen.getByText(/zoom to site/i)).toBeInTheDocument();
      });
    });

    it("REGRESSION: menu opens without t.hover.muted error", async () => {
      // This test ensures we don't regress the bug where t.hover.muted was undefined
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);

      // Should not throw error when clicking
      expect(() => fireEvent.click(settingsButton)).not.toThrow();

      // Menu should render successfully
      await waitFor(() => {
        expect(screen.getByText(/zoom to site/i)).toBeInTheDocument();
      });
    });

    it("closes menu when clicking a menu item", async () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      // Open menu
      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/zoom to site/i)).toBeInTheDocument();
      });

      // Click a menu item
      const zoomButton = screen.getByText(/zoom to site/i);
      fireEvent.click(zoomButton);

      // Menu should close (items disappear)
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  describe("Menu Items", () => {
    it("displays Zoom to Site option", async () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/zoom to site/i)).toBeInTheDocument();
      });
    });

    it("displays Show Map Markers option", async () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/show map markers/i)).toBeInTheDocument();
      });
    });

    it("displays Sync Map option when onSyncMap is provided", async () => {
      renderWithTheme(
        <TimelineSettingsMenu
          toggles={{
            zoomToSite: true,
            mapMarkers: true,
            syncMap: false,
          }}
          onToggle={{
            zoomToSite: mockHandlers.onZoomToSite,
            mapMarkers: mockHandlers.onMapMarkers,
            syncMap: mockHandlers.onSyncMap,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/sync map/i)).toBeInTheDocument();
      });
    });

    it("does not display Sync Map when onSyncMap is not provided", async () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/zoom to site/i)).toBeInTheDocument();
      });

      // Sync Map should not be present
      expect(screen.queryByText(/sync map/i)).not.toBeInTheDocument();
    });

    it("shows checkmark when Zoom to Site is enabled", async () => {
      renderWithTheme(
        <TimelineSettingsMenu
          toggles={{
            zoomToSite: true,
            mapMarkers: false,
          }}
          onToggle={{
            zoomToSite: mockHandlers.onZoomToSite,
            mapMarkers: mockHandlers.onMapMarkers,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        const zoomButton = screen.getByText(/zoom to site/i).closest("button");
        expect(zoomButton?.textContent).toContain("✓");
      });
    });

    it("shows checkmark when Map Markers is visible", async () => {
      renderWithTheme(
        <TimelineSettingsMenu
          toggles={{
            zoomToSite: false,
            mapMarkers: true,
          }}
          onToggle={{
            zoomToSite: mockHandlers.onZoomToSite,
            mapMarkers: mockHandlers.onMapMarkers,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        const markersButton = screen.getByText(/show map markers/i).closest("button");
        expect(markersButton?.textContent).toContain("✓");
      });
    });
  });

  describe("Speed Control", () => {
    it("displays speed control when speedControl prop is provided", async () => {
      renderWithTheme(
        <TimelineSettingsMenu
          {...createDefaultProps()}
          speedControl={{
            speed: 1 as AnimationSpeed,
            onChange: mockHandlers.onSpeedChange,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/speed/i)).toBeInTheDocument();
      });
    });

    it("does not display speed control when speedControl is not provided", async () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/zoom to site/i)).toBeInTheDocument();
      });

      // Speed control should not be present
      expect(screen.queryByLabelText(/speed/i)).not.toBeInTheDocument();
    });

    it("speed control has correct value", async () => {
      renderWithTheme(
        <TimelineSettingsMenu
          {...createDefaultProps()}
          speedControl={{
            speed: 2 as AnimationSpeed,
            onChange: mockHandlers.onSpeedChange,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        const speedControl = screen.getByLabelText(/speed/i) as HTMLSelectElement;
        expect(speedControl.value).toBe("2");
      });
    });
  });

  describe("User Interactions", () => {
    it("calls onZoomToSite when clicking Zoom to Site", async () => {
      const onZoomToSite = vi.fn();

      renderWithTheme(
        <TimelineSettingsMenu
          toggles={{
            zoomToSite: true,
            mapMarkers: true,
          }}
          onToggle={{
            zoomToSite: onZoomToSite,
            mapMarkers: mockHandlers.onMapMarkers,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/zoom to site/i)).toBeInTheDocument();
      });

      const zoomButton = screen.getByText(/zoom to site/i);
      fireEvent.click(zoomButton);

      expect(onZoomToSite).toHaveBeenCalledTimes(1);
    });

    it("calls onMapMarkers when clicking Show Map Markers", async () => {
      const onMapMarkers = vi.fn();

      renderWithTheme(
        <TimelineSettingsMenu
          toggles={{
            zoomToSite: true,
            mapMarkers: true,
          }}
          onToggle={{
            zoomToSite: mockHandlers.onZoomToSite,
            mapMarkers: onMapMarkers,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/show map markers/i)).toBeInTheDocument();
      });

      const markersButton = screen.getByText(/show map markers/i);
      fireEvent.click(markersButton);

      expect(onMapMarkers).toHaveBeenCalledTimes(1);
    });

    it("calls onSyncMap when clicking Sync Map", async () => {
      const onSyncMap = vi.fn();

      renderWithTheme(
        <TimelineSettingsMenu
          toggles={{
            zoomToSite: true,
            mapMarkers: true,
            syncMap: false,
          }}
          onToggle={{
            zoomToSite: mockHandlers.onZoomToSite,
            mapMarkers: mockHandlers.onMapMarkers,
            syncMap: onSyncMap,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByText(/sync map/i)).toBeInTheDocument();
      });

      const syncButton = screen.getByText(/sync map/i);
      fireEvent.click(syncButton);

      expect(onSyncMap).toHaveBeenCalledTimes(1);
    });

    it("speed control is interactive and has correct options", async () => {
      const onSpeedChange = vi.fn();

      renderWithTheme(
        <TimelineSettingsMenu
          {...createDefaultProps()}
          speedControl={{
            speed: 1 as AnimationSpeed,
            onChange: onSpeedChange,
          }}
        />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/speed/i)).toBeInTheDocument();
      });

      const speedControl = screen.getByLabelText(/speed/i) as HTMLSelectElement;

      // Verify speed control has options (0.5x, 1x, 2x, 4x)
      expect(speedControl.options.length).toBeGreaterThan(1);

      // Verify current value matches prop
      expect(speedControl.value).toBe("1");

      // Verify control is not disabled
      expect(speedControl).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      // Settings button should have aria-label
      expect(screen.getByLabelText(/timeline settings/i)).toBeInTheDocument();
    });

    it("menu has proper role attribute", async () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      fireEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("settings button has aria-expanded attribute", () => {
      renderWithTheme(
        <TimelineSettingsMenu {...createDefaultProps()} />
      );

      const settingsButton = screen.getByLabelText(/timeline settings/i);
      expect(settingsButton).toHaveAttribute("aria-expanded");
    });
  });
});
