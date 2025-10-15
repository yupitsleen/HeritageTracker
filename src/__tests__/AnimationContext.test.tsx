import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
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
});
