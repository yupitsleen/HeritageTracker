import { useState, useMemo, useCallback } from "react";

export type SortDirection = "asc" | "desc";

/**
 * Generic table sorting hook
 * Provides sorting state management and sorted data
 *
 * @param data - Array of data to sort
 * @param initialField - Initial field to sort by
 * @param initialDirection - Initial sort direction
 *
 * @example
 * const { sortedData, sortField, sortDirection, handleSort, SortIcon } = useTableSort(
 *   sites,
 *   'dateDestroyed',
 *   'desc'
 * );
 */
export function useTableSort<T extends Record<string, unknown>>(
  data: T[],
  initialField: keyof T,
  initialDirection: SortDirection = "asc"
) {
  const [sortField, setSortField] = useState<keyof T>(initialField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);

  /**
   * Toggle sort field or direction
   */
  const handleSort = useCallback(
    (field: keyof T) => {
      if (sortField === field) {
        // Toggle direction if clicking same field
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        // Default to ascending for new field
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  /**
   * Sort data based on current field and direction
   */
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle Date objects
      if (aValue instanceof Date && bValue instanceof Date) {
        const diff = (aValue as Date).getTime() - (bValue as Date).getTime();
        return sortDirection === "asc" ? diff : -diff;
      }

      // Handle numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle strings (case-insensitive)
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  /**
   * Sort indicator icon component
   */
  const SortIcon = ({ field }: { field: keyof T }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return (
      <span className="text-[#009639] ml-1">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return {
    sortedData,
    sortField,
    sortDirection,
    handleSort,
    SortIcon,
  };
}
