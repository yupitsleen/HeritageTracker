import { useState, useEffect, useCallback } from "react";
import { TABLE_CONFIG } from "../constants/layout";

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
        const availableWidth = window.innerWidth - 48; // 48px for padding (px-4 on each side)
        const effectiveMaxWidth = Math.min(maxWidth, availableWidth * 0.6); // Max 60% of viewport

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

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new width from left edge of viewport to mouse position
      // Subtract 24px for left padding (pl-6)
      const newWidth = e.clientX - 24;
      // Clamp to min/max bounds
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setTableWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  // Calculate which columns to show based on table width (progressive display)
  const getVisibleColumns = useCallback((): string[] => {
    const columns = ["name"]; // Site Name is always visible

    // Progressively add columns as width increases
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.type) {
      columns.push("type");
    }
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
