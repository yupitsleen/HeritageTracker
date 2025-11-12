import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableResize } from "../useTableResize";
import { TABLE_CONFIG, LAYOUT } from "../../constants/layout";

describe("useTableResize", () => {
  // Store original innerWidth
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Use fake timers for requestAnimationFrame
    vi.useFakeTimers();

    // Reset window size to a standard desktop size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
  });

  afterEach(() => {
    // Restore real timers
    vi.useRealTimers();

    // Restore original innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.clearAllMocks();
  });

  describe("Column Width Constraints", () => {
    it("enforces minimum column width (200px)", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // Start resizing
      act(() => {
        result.current.handleResizeStart();
      });

      // Simulate mouse move to position that would create width < min (e.g., x = 50)
      act(() => {
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: 50, // 50 - TABLE_LEFT_PADDING (24) = 26px (below min)
        });
        document.dispatchEvent(mouseEvent);
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Width should be clamped to minimum
      expect(result.current.tableWidth).toBeGreaterThanOrEqual(
        TABLE_CONFIG.MIN_TABLE_WIDTH
      );
    });

    it("enforces maximum column width (1100px)", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // Start resizing
      act(() => {
        result.current.handleResizeStart();
      });

      // Simulate mouse move to position that would create width > max (e.g., x = 2000)
      act(() => {
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: 2000, // 2000 - TABLE_LEFT_PADDING (24) = 1976px (above max)
        });
        document.dispatchEvent(mouseEvent);
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Width should be clamped to maximum
      expect(result.current.tableWidth).toBeLessThanOrEqual(
        TABLE_CONFIG.MAX_TABLE_WIDTH
      );
    });

    it("prevents columns from becoming invisible (width >= 10px)", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // Start resizing
      act(() => {
        result.current.handleResizeStart();
      });

      // Simulate mouse move to position that would create width = 0 (x = 0)
      act(() => {
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: 0, // 0 - TABLE_LEFT_PADDING (24) = -24px (negative width)
        });
        document.dispatchEvent(mouseEvent);
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Width should never be less than 10px (clamped to min)
      expect(result.current.tableWidth).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Mouse Drag Behavior", () => {
    it("updates column width during mouse drag", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      const initialWidth = result.current.tableWidth;

      // Start resizing
      act(() => {
        result.current.handleResizeStart();
      });

      // Simulate mouse drag to a new position (500px from left)
      act(() => {
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: 500, // 500 - TABLE_LEFT_PADDING (24) = 476px
        });
        document.dispatchEvent(mouseEvent);
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Width should have changed from initial value
      expect(result.current.tableWidth).not.toBe(initialWidth);
      // Width should be close to 476px (500 - 24)
      expect(result.current.tableWidth).toBeCloseTo(476, 0);
    });

    it("stops resizing on mouse up", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // Start resizing
      act(() => {
        result.current.handleResizeStart();
      });

      expect(result.current.isResizing).toBe(true);

      // Simulate mouse up
      act(() => {
        const mouseUpEvent = new MouseEvent("mouseup");
        document.dispatchEvent(mouseUpEvent);
      });

      // isResizing should be false
      expect(result.current.isResizing).toBe(false);
    });

    it("handles rapid mouse movements without lag", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // Start resizing
      act(() => {
        result.current.handleResizeStart();
      });

      // Simulate 10 rapid mouse movements
      act(() => {
        for (let i = 0; i < 10; i++) {
          const mouseEvent = new MouseEvent("mousemove", {
            clientX: 300 + i * 10, // Move from 300px to 390px
          });
          document.dispatchEvent(mouseEvent);
        }
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Should have updated to the last position (390 - 24 = 366px)
      // Due to requestAnimationFrame batching, only the last position matters
      expect(result.current.tableWidth).toBeCloseTo(366, 0);
    });
  });

  describe("Multi-Column Interactions", () => {
    it("resizing one column doesn't affect others (isolated state)", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // Get initial visible columns
      const initialColumns = result.current.getVisibleColumns();

      // Start resizing
      act(() => {
        result.current.handleResizeStart();
      });

      // Resize to a width that shows more columns (800px)
      act(() => {
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: 800 + LAYOUT.TABLE_LEFT_PADDING, // 824px client position
        });
        document.dispatchEvent(mouseEvent);
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Stop resizing
      act(() => {
        const mouseUpEvent = new MouseEvent("mouseup");
        document.dispatchEvent(mouseUpEvent);
      });

      const newColumns = result.current.getVisibleColumns();

      // More columns should now be visible
      expect(newColumns.length).toBeGreaterThan(initialColumns.length);
      // Initial columns should still be present (type, name)
      expect(newColumns).toContain("type");
      expect(newColumns).toContain("name");
    });

    it("table width updates correctly after resize", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      const targetWidth = 600;

      // Start resizing
      act(() => {
        result.current.handleResizeStart();
      });

      // Drag to target width
      act(() => {
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: targetWidth + LAYOUT.TABLE_LEFT_PADDING, // 624px client position
        });
        document.dispatchEvent(mouseEvent);
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Stop resizing
      act(() => {
        const mouseUpEvent = new MouseEvent("mouseup");
        document.dispatchEvent(mouseUpEvent);
      });

      // Width should match target
      expect(result.current.tableWidth).toBe(targetWidth);
    });
  });

  describe("Edge Cases", () => {
    it("handles resize on first column (leftmost)", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.MIN_TABLE_WIDTH, // Start at minimum width
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // At minimum width, only "type" and "name" columns visible
      const initialColumns = result.current.getVisibleColumns();
      expect(initialColumns).toEqual(["type", "name"]);

      // Start resizing from minimum width
      act(() => {
        result.current.handleResizeStart();
      });

      // Drag to expand table
      act(() => {
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: 400 + LAYOUT.TABLE_LEFT_PADDING, // 424px client position
        });
        document.dispatchEvent(mouseEvent);
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Width should have increased
      expect(result.current.tableWidth).toBeGreaterThan(TABLE_CONFIG.MIN_TABLE_WIDTH);
      // More columns should now be visible
      const newColumns = result.current.getVisibleColumns();
      expect(newColumns.length).toBeGreaterThan(initialColumns.length);
    });

    it("handles resize on last column (rightmost)", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.MAX_TABLE_WIDTH, // Start at maximum width
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // At maximum width, all columns should be visible
      const initialColumns = result.current.getVisibleColumns();
      expect(initialColumns.length).toBeGreaterThan(2);

      // Start resizing from maximum width
      act(() => {
        result.current.handleResizeStart();
      });

      // Try to drag beyond maximum (should clamp)
      act(() => {
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: 2000, // Far beyond max
        });
        document.dispatchEvent(mouseEvent);
      });

      // Use requestAnimationFrame to ensure width update completes
      act(() => {
        vi.advanceTimersByTime(16); // One frame
      });

      // Width should remain at maximum
      expect(result.current.tableWidth).toBe(TABLE_CONFIG.MAX_TABLE_WIDTH);
      // All columns should still be visible
      const newColumns = result.current.getVisibleColumns();
      expect(newColumns.length).toBe(initialColumns.length);
    });
  });

  describe("Progressive Column Display", () => {
    it("shows type and name at minimum width (200px)", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      const columns = result.current.getVisibleColumns();
      expect(columns).toEqual(["type", "name"]);
    });

    it("shows status at 360px+", () => {
      const { result } = renderHook(() =>
        useTableResize(360, TABLE_CONFIG.MIN_TABLE_WIDTH, TABLE_CONFIG.MAX_TABLE_WIDTH)
      );

      const columns = result.current.getVisibleColumns();
      expect(columns).toContain("type");
      expect(columns).toContain("name");
      expect(columns).toContain("status");
    });

    it("shows all columns at maximum width (1100px)", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.MAX_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      const columns = result.current.getVisibleColumns();
      expect(columns).toEqual([
        "type",
        "name",
        "status",
        "dateDestroyed",
        "dateDestroyedIslamic",
        "yearBuilt",
        "yearBuiltIslamic",
      ]);
    });
  });

  describe("Viewport Resize Handling", () => {
    it("clamps table width when viewport shrinks", () => {
      const { result } = renderHook(() =>
        useTableResize(800, TABLE_CONFIG.MIN_TABLE_WIDTH, TABLE_CONFIG.MAX_TABLE_WIDTH)
      );

      // Initial width is 800px
      expect(result.current.tableWidth).toBe(800);

      // Shrink viewport
      act(() => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 600, // Small viewport
        });
        window.dispatchEvent(new Event("resize"));
      });

      // Table width should clamp to available space
      // Available width = 600 - CONTAINER_PADDING (48) = 552
      // Max effective width = 552 * TABLE_MAX_WIDTH_RATIO (0.6) = 331.2
      expect(result.current.tableWidth).toBeLessThan(800);
      expect(result.current.tableWidth).toBeGreaterThanOrEqual(
        TABLE_CONFIG.MIN_TABLE_WIDTH
      );
    });

    it("maintains minimum width even on tiny viewports", () => {
      const { result } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // Set viewport to mobile size
      act(() => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 320, // iPhone SE size
        });
        window.dispatchEvent(new Event("resize"));
      });

      // Width should never go below minimum
      expect(result.current.tableWidth).toBeGreaterThanOrEqual(
        TABLE_CONFIG.MIN_TABLE_WIDTH
      );
    });
  });

  describe("Cleanup", () => {
    it("removes event listeners on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
      const windowRemoveEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { result, unmount } = renderHook(() =>
        useTableResize(
          TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
          TABLE_CONFIG.MIN_TABLE_WIDTH,
          TABLE_CONFIG.MAX_TABLE_WIDTH
        )
      );

      // Start resizing to attach mousemove/mouseup listeners
      act(() => {
        result.current.handleResizeStart();
      });

      // Unmount component
      unmount();

      // Should have removed window resize listener
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );

      // Should have removed document mousemove/mouseup listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousemove",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mouseup",
        expect.any(Function)
      );
    });
  });
});
