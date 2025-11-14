import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { TimelineScrubber } from "./TimelineScrubber";
import { AnimationProvider } from "../../contexts/AnimationContext";
import type { Site } from "../../types";

/**
 * TimelineScrubber - Tooltip Positioning Bug Tests
 *
 * BUG: Info icon tooltip renders far away on first hover, but correctly on subsequent hovers
 *
 * This happens because:
 * 1. First hover: tooltip ref has no dimensions yet → getBoundingClientRect() returns wrong values
 * 2. Second hover: tooltip ref has cached dimensions → positioning works correctly
 *
 * These tests verify that tooltip positioning is CONSISTENT between first and subsequent hovers.
 */

const mockSites: Site[] = [
  {
    id: "site-1",
    name: "Test Site",
    type: "mosque",
    yearBuilt: "1200",
    coordinates: [31.5, 34.4],
    status: "destroyed",
    dateDestroyed: "2024-01-15",
    description: "Test",
    historicalSignificance: "Test",
    culturalValue: "Test",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
  {
    id: "site-2",
    name: "Test Site 2",
    type: "church",
    yearBuilt: "1300",
    coordinates: [31.6, 34.5],
    status: "damaged",
    dateDestroyed: "2024-02-20",
    description: "Test 2",
    historicalSignificance: "Test 2",
    culturalValue: "Test 2",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
];

describe("TimelineScrubber - Tooltip Positioning Bug", () => {
  let originalGetBoundingClientRect: typeof Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    // Save original method
    originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

    // Mock getBoundingClientRect for info icon (trigger element)
    // Position it at top-right of viewport where the bug is most visible
    Element.prototype.getBoundingClientRect = vi.fn(function (this: Element) {
      if (this.classList?.contains('cursor-help')) {
        // This is the trigger wrapper
        return {
          top: 50,
          left: window.innerWidth - 50, // Near right edge
          right: window.innerWidth - 30,
          bottom: 66,
          width: 20,
          height: 16,
          x: window.innerWidth - 50,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect;
      }

      // For tooltip element itself
      if (this.classList?.contains('bg-gray-900')) {
        // This is the tooltip
        return {
          top: 0,
          left: 0,
          right: 320,
          bottom: 60,
          width: 320,
          height: 60,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      }

      // Default fallback
      return originalGetBoundingClientRect.call(this);
    });
  });

  afterEach(() => {
    // Restore original method
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it("CRITICAL: tooltip position should be consistent on first hover and second hover", async () => {
    renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber
          sites={mockSites}
          selectedDate={new Date("2024-01-15")}
          onDateChange={vi.fn()}
          onSiteHighlight={vi.fn()}
          advancedMode={false}
        />
      </AnimationProvider>
    );

    // Find the info icon trigger
    const infoIcon = screen.getByRole("img");
    const trigger = infoIcon.parentElement!;

    // === FIRST HOVER ===
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText(/Click Play to animate/i);
      expect(tooltip).toBeInTheDocument();
    });

    let tooltip = screen.getByText(/Click Play to animate/i);
    const firstHoverPosition = {
      top: parseFloat(tooltip.style.top),
      left: parseFloat(tooltip.style.left),
    };

    // Tooltip should be near the trigger (not at 0,0 or far away)
    expect(firstHoverPosition.top).toBeGreaterThan(0);
    expect(firstHoverPosition.top).toBeLessThan(200); // Should be near trigger at top:50
    expect(firstHoverPosition.left).toBeGreaterThan(window.innerWidth / 2); // Should be on right side

    // === SECOND HOVER ===
    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
      expect(screen.queryByText(/Click Play to animate/i)).not.toBeInTheDocument();
    });

    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      tooltip = screen.getByText(/Click Play to animate/i);
      expect(tooltip).toBeInTheDocument();
    });

    const secondHoverPosition = {
      top: parseFloat(tooltip.style.top),
      left: parseFloat(tooltip.style.left),
    };

    // CRITICAL: First and second hover positions should be IDENTICAL
    expect(secondHoverPosition.top).toBe(firstHoverPosition.top);
    expect(secondHoverPosition.left).toBe(firstHoverPosition.left);
  });

  it("REGRESSION: first hover should not render tooltip at (0, 0)", async () => {
    renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber
          sites={mockSites}
          selectedDate={new Date("2024-01-15")}
          onDateChange={vi.fn()}
          onSiteHighlight={vi.fn()}
          advancedMode={false}
        />
      </AnimationProvider>
    );

    const infoIcon = screen.getByRole("img");
    const trigger = infoIcon.parentElement!;

    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText(/Click Play to animate/i);
      expect(tooltip).toBeInTheDocument();
    });

    const tooltip = screen.getByText(/Click Play to animate/i);
    const position = {
      top: parseFloat(tooltip.style.top),
      left: parseFloat(tooltip.style.left),
    };

    // Should NOT be at origin (0, 0)
    expect(position.top).not.toBe(0);
    expect(position.left).not.toBe(0);
  });

  it("should position tooltip near trigger element on first hover", async () => {
    renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber
          sites={mockSites}
          selectedDate={new Date("2024-01-15")}
          onDateChange={vi.fn()}
          onSiteHighlight={vi.fn()}
          advancedMode={false}
        />
      </AnimationProvider>
    );

    const infoIcon = screen.getByRole("img");
    const trigger = infoIcon.parentElement!;
    const triggerRect = trigger.getBoundingClientRect();

    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText(/Click Play to animate/i);
      expect(tooltip).toBeInTheDocument();
    });

    const tooltip = screen.getByText(/Click Play to animate/i);
    const tooltipTop = parseFloat(tooltip.style.top);
    const tooltipLeft = parseFloat(tooltip.style.left);

    // Tooltip should be positioned relative to trigger
    // Allow ±100px tolerance for positioning logic (above/below, left/right adjustments)
    expect(Math.abs(tooltipTop - triggerRect.top)).toBeLessThan(100);
    expect(Math.abs(tooltipLeft - (triggerRect.left + triggerRect.width / 2))).toBeLessThan(200);
  });

  it("should show tooltip with correct visibility on first hover (not hidden at 0,0)", async () => {
    renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber
          sites={mockSites}
          selectedDate={new Date("2024-01-15")}
          onDateChange={vi.fn()}
          onSiteHighlight={vi.fn()}
          advancedMode={false}
        />
      </AnimationProvider>
    );

    const infoIcon = screen.getByRole("img");
    const trigger = infoIcon.parentElement!;

    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText(/Click Play to animate/i);
      expect(tooltip).toBeInTheDocument();
    });

    const tooltip = screen.getByText(/Click Play to animate/i);
    const computedStyle = window.getComputedStyle(tooltip);

    // Should be visible (not hidden)
    expect(computedStyle.visibility).not.toBe('hidden');
    expect(computedStyle.opacity).not.toBe('0');
  });

  it("advanced mode: tooltip position should be consistent between mode switches", async () => {
    const { rerender } = renderWithTheme(
      <AnimationProvider>
        <TimelineScrubber
          sites={mockSites}
          selectedDate={new Date("2024-01-15")}
          onDateChange={vi.fn()}
          onSiteHighlight={vi.fn()}
          advancedMode={false}
        />
      </AnimationProvider>
    );

    const infoIcon = screen.getByRole("img");
    const trigger = infoIcon.parentElement!;

    // Normal mode hover
    fireEvent.mouseEnter(trigger);
    await waitFor(() => screen.getByText(/Click Play to animate/i));
    let tooltip = screen.getByText(/Click Play to animate/i);
    const normalModePosition = {
      top: parseFloat(tooltip.style.top),
      left: parseFloat(tooltip.style.left),
    };
    fireEvent.mouseLeave(trigger);

    // Switch to advanced mode
    rerender(
      <AnimationProvider>
        <TimelineScrubber
          sites={mockSites}
          selectedDate={new Date("2024-01-15")}
          onDateChange={vi.fn()}
          onSiteHighlight={vi.fn()}
          advancedMode={true}
        />
      </AnimationProvider>
    );

    // Advanced mode hover (different tooltip content)
    fireEvent.mouseEnter(trigger);
    await waitFor(() => screen.getByText(/Click red dots to highlight/i));
    tooltip = screen.getByText(/Click red dots to highlight/i);
    const advancedModePosition = {
      top: parseFloat(tooltip.style.top),
      left: parseFloat(tooltip.style.left),
    };

    // Positions should be consistent (same trigger location)
    expect(Math.abs(advancedModePosition.top - normalModePosition.top)).toBeLessThan(20);
    expect(advancedModePosition.left).toBe(normalModePosition.left);
  });
});
