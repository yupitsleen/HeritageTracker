import { useState, useEffect, useCallback } from "react";
import { TABLE_CONFIG, LAYOUT } from "../constants/layout";

/**
 * Hook to manage resizable table width
 * Handles mouse events for drag-to-resize functionality
 *
 * @param initialWidth - Initial table width in pixels
 * @param minWidth - Minimum table width in pixels
 * @param maxWidth - Maximum table width in pixels
 * @returns Table width state and resize handlers
 */
export function useTableResize(
  initialWidth: number = TABLE_CONFIG.DEFAULT_TABLE_WIDTH,
  minWidth: number = TABLE_CONFIG.MIN_TABLE_WIDTH,
  maxWidth: number = TABLE_CONFIG.MAX_TABLE_WIDTH
) {
  const [tableWidth, setTableWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  // Clamp table width to current viewport constraints
  useEffect(() => {
    const handleViewportResize = () => {
      setTableWidth((currentWidth) => {
        // Get available width (viewport - padding)
        const availableWidth = window.innerWidth - LAYOUT.CONTAINER_PADDING;
        const effectiveMaxWidth = Math.min(maxWidth, availableWidth * LAYOUT.TABLE_MAX_WIDTH_RATIO);

        // Clamp current width to new constraints
        return Math.max(minWidth, Math.min(effectiveMaxWidth, currentWidth));
      });
    };

    // Run on mount to set initial size
    handleViewportResize();

    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, [minWidth, maxWidth]);

  // Start resizing
  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  // Handle mouse move and mouse up events
  useEffect(() => {
    if (!isResizing) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // Use requestAnimationFrame for smooth, performant updates
      rafId = requestAnimationFrame(() => {
        // Calculate new width from left edge of viewport to mouse position
        const newWidth = e.clientX - LAYOUT.TABLE_LEFT_PADDING;
        // Clamp to min/max bounds
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

        // Only update if value actually changed (avoid unnecessary re-renders)
        setTableWidth((prev) => (clampedWidth !== prev ? clampedWidth : prev));
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      // Cancel any pending animation frame on cleanup
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  // Calculate which columns to show based on table width (progressive display)
  const getVisibleColumns = useCallback((): string[] => {
    // Type and Site Name are always visible (at minimum width)
    const columns = ["type", "name"];

    // Progressively add columns as width increases
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.status) {
      columns.push("status");
    }
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.dateDestroyed) {
      columns.push("dateDestroyed");
    }
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.dateDestroyedIslamic) {
      columns.push("dateDestroyedIslamic");
    }
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.yearBuilt) {
      columns.push("yearBuilt");
    }
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.yearBuiltIslamic) {
      columns.push("yearBuiltIslamic");
    }

    return columns;
  }, [tableWidth]);

  return {
    tableWidth,
    isResizing,
    handleResizeStart,
    getVisibleColumns,
  };
}
