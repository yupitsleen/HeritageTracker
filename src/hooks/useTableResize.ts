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
    const columns = ["name", "status", "dateDestroyed", "actions"];
    if (tableWidth >= 650) columns.splice(1, 0, "type"); // Add Type after Name
    if (tableWidth >= 800)
      columns.splice(columns.length - 1, 0, "dateDestroyedIslamic"); // Add before Actions
    if (tableWidth >= 950)
      columns.splice(columns.length - 1, 0, "yearBuilt");
    if (tableWidth >= 1100)
      columns.splice(columns.length - 1, 0, "yearBuiltIslamic");
    return columns;
  }, [tableWidth]);

  return {
    tableWidth,
    isResizing,
    handleResizeStart,
    getVisibleColumns,
  };
}
