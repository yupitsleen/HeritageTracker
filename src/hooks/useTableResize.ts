import { useState, useEffect, useCallback } from "react";

/**
 * Hook to manage resizable table width
 * Handles mouse events for drag-to-resize functionality
 *
 * @param initialWidth - Initial table width in pixels (default: 480)
 * @param minWidth - Minimum table width in pixels (default: 480)
 * @param maxWidth - Maximum table width in pixels (default: 1100)
 * @returns Table width state and resize handlers
 */
export function useTableResize(
  initialWidth: number = 480,
  minWidth: number = 480,
  maxWidth: number = 1100
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
    if (tableWidth >= 650)
      columns.push("dateDestroyedIslamic");
    if (tableWidth >= 800)
      columns.push("yearBuilt");
    if (tableWidth >= 950)
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
