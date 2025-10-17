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

  // Calculate which columns to show based on table width
  const getVisibleColumns = useCallback((): string[] => {
    const columns = ["name", "type", "status", "dateDestroyed"];
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.dateDestroyedIslamic)
      columns.push("dateDestroyedIslamic");
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.yearBuilt)
      columns.push("yearBuilt");
    if (tableWidth >= TABLE_CONFIG.COLUMN_BREAKPOINTS.yearBuiltIslamic)
      columns.push("yearBuiltIslamic");
    return columns;
  }, [tableWidth]);

  return {
    tableWidth,
    isResizing,
    handleResizeStart,
    getVisibleColumns,
  };
}
