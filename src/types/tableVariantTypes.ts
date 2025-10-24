/**
 * Table Variant Configuration Types
 *
 * Defines types for extensible table variant configuration.
 */

/**
 * Available table columns
 */
export type TableColumn =
  | "type"
  | "name"
  | "status"
  | "dateDestroyed"
  | "dateDestroyedIslamic"
  | "yearBuilt"
  | "yearBuiltIslamic";

/**
 * Table variant configuration
 *
 * Defines which columns are visible and other display options for different
 * table contexts (compact sidebar, expanded modal, mobile accordion).
 *
 * @property id - Unique identifier for this variant
 * @property label - Human-readable label
 * @property labelArabic - Optional Arabic label
 * @property isDefault - Whether this is the default variant for its context
 * @property visibleColumns - Array of columns to display (in order)
 * @property enableSort - Whether sorting is enabled
 * @property enableExport - Whether export functionality is shown
 * @property defaultSortColumn - Default column to sort by
 * @property defaultSortDirection - Default sort direction ("asc" or "desc")
 * @property maxHeight - Optional maximum table height (CSS value)
 * @property enableVirtualization - Whether to use virtual scrolling (for large datasets)
 * @property description - Optional description
 * @property metadata - Optional metadata (author, version, notes)
 *
 * @example
 * ```typescript
 * const compactVariant: TableVariantConfig = {
 *   id: "compact",
 *   label: "Compact Sidebar",
 *   visibleColumns: ["type", "name", "status", "dateDestroyed"],
 *   enableSort: true,
 *   enableExport: false,
 *   defaultSortColumn: "dateDestroyed",
 *   defaultSortDirection: "desc",
 *   maxHeight: "calc(100vh - 200px)",
 * };
 * ```
 */
export interface TableVariantConfig {
  id: string;
  label: string;
  labelArabic?: string;
  isDefault?: boolean;
  visibleColumns: TableColumn[];
  enableSort: boolean;
  enableExport: boolean;
  defaultSortColumn: TableColumn;
  defaultSortDirection: "asc" | "desc";
  maxHeight?: string;
  enableVirtualization?: boolean;
  description?: string;
  metadata?: {
    author?: string;
    version?: string;
    notes?: string;
  };
}

/**
 * Registry of table variant configurations
 * Maps variant ID to TableVariantConfig object
 */
export interface TableVariantRegistry {
  [id: string]: TableVariantConfig;
}
