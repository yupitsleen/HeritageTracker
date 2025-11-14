import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AnimationProvider, useAnimation } from "../contexts/AnimationContext";

describe("AnimationContext", () => {
  // Smoke test
  it("provides animation context to children", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.currentTimestamp).toBeInstanceOf(Date);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.speed).toBe(1);
  });

  // Error handling
  it("throws error when useAnimation is used outside provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAnimation());
    }).toThrow("useAnimation must be used within AnimationProvider");

    spy.mockRestore();
  });

  // Initial state
  it("initializes with correct start date and state", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.speed).toBe(1);
    expect(result.current.startDate).toEqual(new Date("2023-10-07"));
  });

  // Play/pause functionality
  it("toggles playing state with play and pause", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    // Initial state should be paused
    expect(result.current.isPlaying).toBe(false);

    // Play
    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    // Pause
    act(() => {
      result.current.pause();
    });
    expect(result.current.isPlaying).toBe(false);
  });

  // Reset functionality
  it("resets to start date when reset is called", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    // Set to a different timestamp
    act(() => {
      result.current.setTimestamp(new Date("2023-11-15"));
    });
    expect(result.current.currentTimestamp).toEqual(new Date("2023-11-15"));

    // Reset
    act(() => {
      result.current.reset();
    });
    expect(result.current.currentTimestamp).toEqual(new Date("2023-10-07"));
    expect(result.current.isPlaying).toBe(false);
  });

  // Speed control
  it("updates animation speed", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    expect(result.current.speed).toBe(1);

    // Set to 2x
    act(() => {
      result.current.setSpeed(2);
    });
    expect(result.current.speed).toBe(2);

    // Set to 0.5x
    act(() => {
      result.current.setSpeed(0.5);
    });
    expect(result.current.speed).toBe(0.5);
  });

  // Timestamp setting
  it("sets timestamp within valid range", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    // Set valid date
    act(() => {
      result.current.setTimestamp(new Date("2023-12-01"));
    });
    expect(result.current.currentTimestamp).toEqual(new Date("2023-12-01"));
  });

  // Edge case - clamp timestamp to start date
  it("clamps timestamp to start date when set before range", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    // Try to set date before start
    act(() => {
      result.current.setTimestamp(new Date("2023-09-01"));
    });

    // Should clamp to start date (Oct 7, 2023)
    expect(result.current.currentTimestamp).toEqual(new Date("2023-10-07"));
  });

  // Edge case - clamp timestamp to end date
  it("clamps timestamp to end date when set after range", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // 1 year in future

    // Try to set date after end
    act(() => {
      result.current.setTimestamp(futureDate);
    });

    // Should clamp to end date (current date)
    expect(result.current.currentTimestamp.getTime()).toBeLessThanOrEqual(
      result.current.endDate.getTime()
    );
  });

  // Date range validation
  it("provides correct start and end dates", () => {
    const { result } = renderHook(() => useAnimation(), {
      wrapper: AnimationProvider,
    });

    expect(result.current.startDate).toEqual(new Date("2023-10-07"));
    expect(result.current.endDate).toBeInstanceOf(Date);
    expect(result.current.endDate.getTime()).toBeGreaterThan(
      result.current.startDate.getTime()
    );
  });

  // 7-day buffer validation
  it("applies 7-day buffer at both start and end of timeline", () => {
    // Create test sites with known destruction dates
    const testSites = [
      {
        id: "1",
        name: "First Site",
        type: "mosque",
        coordinates: [31.5, 34.5],
        status: "destroyed",
        dateDestroyed: "2024-01-01", // Earliest date
        description: "Test site 1",
        historicalSignificance: "Test",
        culturalValue: "Test",
        verifiedBy: [],
        sources: [],
      },
      {
        id: "2",
        name: "Last Site",
        type: "mosque",
        coordinates: [31.5, 34.5],
        status: "destroyed",
        dateDestroyed: "2024-12-31", // Latest date
        description: "Test site 2",
        historicalSignificance: "Test",
        culturalValue: "Test",
        verifiedBy: [],
        sources: [],
      },
    ];

    const { result } = renderHook(() => useAnimation(), {
      wrapper: ({ children }) => (
        <AnimationProvider sites={testSites}>{children}</AnimationProvider>
      ),
    });

    // Expected dates with 7-day buffer
    const earliestDate = new Date("2024-01-01");
    const latestDate = new Date("2024-12-31");
    const expectedStart = new Date(earliestDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const expectedEnd = new Date(latestDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Verify 7-day buffer at start
    expect(result.current.startDate.getTime()).toBe(expectedStart.getTime());

    // Verify 7-day buffer at end
    expect(result.current.endDate.getTime()).toBe(expectedEnd.getTime());
  });

  // Sync Map functionality
  describe("Map Sync", () => {
    it("initializes with sync disabled", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      expect(result.current.syncMapEnabled).toBe(false);
      expect(result.current.syncActive).toBe(false);
    });

    it("enables sync when setSyncMapEnabled is called and play is triggered", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      act(() => {
        result.current.setSyncMapEnabled(true);
      });

      expect(result.current.syncMapEnabled).toBe(true);
      expect(result.current.syncActive).toBe(false); // Not active until play

      // Trigger play to activate sync
      act(() => {
        result.current.play();
      });

      expect(result.current.syncActive).toBe(true);
    });

    it("disables sync temporarily when setSyncActive is called", async () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Enable sync
      act(() => {
        result.current.setSyncMapEnabled(true);
      });

      // Start playing (this will activate sync)
      act(() => {
        result.current.play();
      });

      // Wait for sync to activate
      await waitFor(() => {
        expect(result.current.syncActive).toBe(true);
      });

      // Temporarily disable
      act(() => {
        result.current.setSyncActive(false);
      });
      expect(result.current.syncMapEnabled).toBe(true); // User preference unchanged
      expect(result.current.syncActive).toBe(false); // Temporarily disabled
    });

    it("restores syncActive to syncMapEnabled on reset", async () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Enable sync
      act(() => {
        result.current.setSyncMapEnabled(true);
      });

      // Play to activate
      act(() => {
        result.current.play();
      });

      // Wait for sync to activate
      await waitFor(() => {
        expect(result.current.syncActive).toBe(true);
      });

      // Temporarily disable via manual override
      act(() => {
        result.current.setSyncActive(false);
      });
      expect(result.current.syncActive).toBe(false);

      // Reset should restore sync
      act(() => {
        result.current.reset();
      });
      expect(result.current.syncActive).toBe(true);
      expect(result.current.syncMapEnabled).toBe(true);
    });

    it("does not restore syncActive if syncMapEnabled is false", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Sync disabled
      expect(result.current.syncMapEnabled).toBe(false);
      expect(result.current.syncActive).toBe(false);

      // Reset should keep sync disabled
      act(() => {
        result.current.reset();
      });
      expect(result.current.syncActive).toBe(false);
    });

    it("syncs syncActive with syncMapEnabled when toggled", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Enable sync (not active until play)
      act(() => {
        result.current.setSyncMapEnabled(true);
      });
      expect(result.current.syncActive).toBe(false); // Not active until play

      // Start playing to activate
      act(() => {
        result.current.play();
      });
      expect(result.current.syncActive).toBe(true);

      // Disable sync (immediately deactivates)
      act(() => {
        result.current.setSyncMapEnabled(false);
      });
      expect(result.current.syncActive).toBe(false);

      // Re-enable sync (not active until play again)
      act(() => {
        result.current.setSyncMapEnabled(true);
      });
      expect(result.current.syncActive).toBe(false);

      // Play again to reactivate
      act(() => {
        result.current.play();
      });
      expect(result.current.syncActive).toBe(true);
    });
  });

  // NEW FEATURE TESTS

  describe("Zoom to Site Toggle", () => {
    it("initializes with zoom enabled by default", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      expect(result.current.zoomToSiteEnabled).toBe(true);
    });

    it("toggles zoom to site when setZoomToSiteEnabled is called", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Initial state: enabled
      expect(result.current.zoomToSiteEnabled).toBe(true);

      // Disable zoom
      act(() => {
        result.current.setZoomToSiteEnabled(false);
      });
      expect(result.current.zoomToSiteEnabled).toBe(false);

      // Re-enable zoom
      act(() => {
        result.current.setZoomToSiteEnabled(true);
      });
      expect(result.current.zoomToSiteEnabled).toBe(true);
    });

    it("maintains zoom state across play/pause cycles", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Disable zoom
      act(() => {
        result.current.setZoomToSiteEnabled(false);
      });
      expect(result.current.zoomToSiteEnabled).toBe(false);

      // Play
      act(() => {
        result.current.play();
      });
      expect(result.current.zoomToSiteEnabled).toBe(false); // Should remain disabled

      // Pause
      act(() => {
        result.current.pause();
      });
      expect(result.current.zoomToSiteEnabled).toBe(false); // Should remain disabled
    });

    it("maintains zoom state across timestamp changes", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Disable zoom
      act(() => {
        result.current.setZoomToSiteEnabled(false);
      });

      // Change timestamp
      act(() => {
        result.current.setTimestamp(new Date("2023-12-01"));
      });

      expect(result.current.zoomToSiteEnabled).toBe(false);
    });

    it("maintains zoom state across reset", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Disable zoom
      act(() => {
        result.current.setZoomToSiteEnabled(false);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      // Zoom state should be preserved (user preference)
      expect(result.current.zoomToSiteEnabled).toBe(false);
    });

    it("zoom state is independent of sync map state", () => {
      const { result } = renderHook(() => useAnimation(), {
        wrapper: AnimationProvider,
      });

      // Enable sync, disable zoom
      act(() => {
        result.current.setSyncMapEnabled(true);
        result.current.setZoomToSiteEnabled(false);
      });

      expect(result.current.syncMapEnabled).toBe(true);
      expect(result.current.zoomToSiteEnabled).toBe(false);

      // Disable sync, enable zoom
      act(() => {
        result.current.setSyncMapEnabled(false);
        result.current.setZoomToSiteEnabled(true);
      });

      expect(result.current.syncMapEnabled).toBe(false);
      expect(result.current.zoomToSiteEnabled).toBe(true);
    });
  });
});
