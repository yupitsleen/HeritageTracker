import { useState, useMemo } from "react";
import type { GazaSite } from "../types";

export type SortField =
  | "name"
  | "type"
  | "status"
  | "dateDestroyed"
  | "dateDestroyedIslamic"
  | "yearBuilt"
  | "yearBuiltIslamic";

export type SortDirection = "asc" | "desc";

/**
 * Hook for table sorting logic
 * Manages sort state and returns sorted sites
 *
 * @param sites - Array of sites to sort
 * @param initialField - Initial sort field (default: "dateDestroyed")
 * @param initialDirection - Initial sort direction (default: "desc")
 * @returns Sort state, handler, and sorted sites
 *
 * @example
 * ```tsx
 * const { sortField, sortDirection, handleSort, sortedSites } = useTableSort(sites);
 * ```
 */
export function useTableSort(
  sites: GazaSite[],
  initialField: SortField = "dateDestroyed",
  initialDirection: SortDirection = "desc"
) {
  const [sortField, setSortField] = useState<SortField>(initialField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedSites = useMemo(() => {
    const sorted = [...sites].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "dateDestroyed":
          aValue = a.dateDestroyed ? new Date(a.dateDestroyed).getTime() : 0;
          bValue = b.dateDestroyed ? new Date(b.dateDestroyed).getTime() : 0;
          break;
        case "dateDestroyedIslamic":
          aValue = a.dateDestroyedIslamic || "zzz";
          bValue = b.dateDestroyedIslamic || "zzz";
          break;
        case "yearBuilt":
          aValue = a.yearBuilt || "zzz";
          bValue = b.yearBuilt || "zzz";
          break;
        case "yearBuiltIslamic":
          aValue = a.yearBuiltIslamic || "zzz";
          bValue = b.yearBuiltIslamic || "zzz";
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [sites, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedSites,
  };
}
