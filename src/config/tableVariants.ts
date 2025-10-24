/**
 * Table Variant Configuration Registry
 *
 * Central registry for table variant configurations.
 * Defines which columns are visible and display options for different contexts.
 *
 * @example
 * ```typescript
 * // Get compact variant columns
 * const compactConfig = getTableVariantConfig("compact");
 * const columns = compactConfig?.visibleColumns; // ["type", "name", "status", "dateDestroyed"]
 *
 * // Register custom variant
 * registerTableVariantConfig({
 *   id: "minimal",
 *   label: "Minimal View",
 *   visibleColumns: ["name", "status"],
 *   enableSort: true,
 *   enableExport: false,
 *   defaultSortColumn: "name",
 *   defaultSortDirection: "asc",
 * });
 * ```
 */

import type {
  TableVariantConfig,
  TableVariantRegistry,
  TableColumn,
} from "../types/tableVariantTypes";

/**
 * Global table variant configuration registry
 */
export const TABLE_VARIANT_REGISTRY: TableVariantRegistry = {
  compact: {
    id: "compact",
    label: "Compact Sidebar",
    labelArabic: "الشريط الجانبي المدمج",
    isDefault: true,
    visibleColumns: ["type", "name", "status", "dateDestroyed"],
    enableSort: true,
    enableExport: false,
    defaultSortColumn: "dateDestroyed",
    defaultSortDirection: "desc",
    maxHeight: "calc(100vh - 200px)",
    enableVirtualization: false,
    description:
      "Compact table for desktop sidebar with essential columns only",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes:
        "Shows Type (icon), Name, Status, and Destruction Date. Optimized for narrow sidebar.",
    },
  },
  expanded: {
    id: "expanded",
    label: "Expanded Modal",
    labelArabic: "النافذة المنبثقة الموسعة",
    visibleColumns: [
      "type",
      "name",
      "status",
      "dateDestroyed",
      "dateDestroyedIslamic",
      "yearBuilt",
      "yearBuiltIslamic",
    ],
    enableSort: true,
    enableExport: true,
    defaultSortColumn: "dateDestroyed",
    defaultSortDirection: "desc",
    maxHeight: "70vh",
    enableVirtualization: false,
    description: "Full table for modal view with all available columns",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes:
        "Shows all columns including Islamic calendar dates and year built. Includes CSV export.",
    },
  },
  mobile: {
    id: "mobile",
    label: "Mobile Accordion",
    labelArabic: "الأكورديون المحمول",
    visibleColumns: ["name", "status", "dateDestroyed"],
    enableSort: true,
    enableExport: false,
    defaultSortColumn: "dateDestroyed",
    defaultSortDirection: "desc",
    enableVirtualization: false,
    description:
      "Mobile accordion view with collapsible rows for screens < 768px",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes:
        "Type column hidden (shown via colored name). Tap rows to expand for full details.",
    },
  },
};

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Register a new table variant configuration
 *
 * @param config - The table variant configuration to register
 *
 * @example
 * ```typescript
 * registerTableVariantConfig({
 *   id: "minimal",
 *   label: "Minimal View",
 *   visibleColumns: ["name", "status"],
 *   enableSort: true,
 *   enableExport: false,
 *   defaultSortColumn: "name",
 *   defaultSortDirection: "asc",
 * });
 * ```
 */
export function registerTableVariantConfig(
  config: TableVariantConfig
): void {
  TABLE_VARIANT_REGISTRY[config.id] = config;
}

/**
 * Get all table variant configurations
 *
 * @returns Array of all registered table variant configurations
 *
 * @example
 * ```typescript
 * const configs = getAllTableVariantConfigs();
 * console.log(`Found ${configs.length} table variants`);
 * ```
 */
export function getAllTableVariantConfigs(): TableVariantConfig[] {
  return Object.values(TABLE_VARIANT_REGISTRY);
}

/**
 * Get a table variant configuration by ID
 *
 * @param id - Variant ID
 * @returns The table variant configuration, or undefined if not found
 *
 * @example
 * ```typescript
 * const config = getTableVariantConfig("compact");
 * if (config) {
 *   console.log(`Visible columns: ${config.visibleColumns.join(", ")}`);
 * }
 * ```
 */
export function getTableVariantConfig(
  id: string
): TableVariantConfig | undefined {
  return TABLE_VARIANT_REGISTRY[id];
}

/**
 * Get the default table variant configuration
 *
 * @returns The default table variant configuration
 *
 * @example
 * ```typescript
 * const defaultConfig = getDefaultTableVariantConfig();
 * const columns = defaultConfig.visibleColumns;
 * ```
 */
export function getDefaultTableVariantConfig(): TableVariantConfig {
  const defaultConfig = Object.values(TABLE_VARIANT_REGISTRY).find(
    (config) => config.isDefault
  );

  // Fallback to first config if no default is set
  return defaultConfig || Object.values(TABLE_VARIANT_REGISTRY)[0];
}

/**
 * Update an existing table variant configuration
 *
 * @param id - Variant ID
 * @param updates - Partial configuration to merge with existing
 * @throws Error if configuration not found
 *
 * @example
 * ```typescript
 * updateTableVariantConfig("compact", {
 *   visibleColumns: ["name", "status", "dateDestroyed"],
 * });
 * ```
 */
export function updateTableVariantConfig(
  id: string,
  updates: Partial<TableVariantConfig>
): void {
  if (!TABLE_VARIANT_REGISTRY[id]) {
    throw new Error(`Table variant configuration '${id}' not found in registry`);
  }
  TABLE_VARIANT_REGISTRY[id] = { ...TABLE_VARIANT_REGISTRY[id], ...updates };
}

/**
 * Remove a table variant configuration from the registry
 *
 * @param id - Variant ID to remove
 *
 * @example
 * ```typescript
 * removeTableVariantConfig("custom-variant");
 * ```
 */
export function removeTableVariantConfig(id: string): void {
  delete TABLE_VARIANT_REGISTRY[id];
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all table variant configuration IDs
 *
 * @returns Array of all variant IDs
 *
 * @example
 * ```typescript
 * const ids = getTableVariantConfigIds();
 * console.log(`Available variants: ${ids.join(", ")}`);
 * ```
 */
export function getTableVariantConfigIds(): string[] {
  return Object.keys(TABLE_VARIANT_REGISTRY);
}

/**
 * Check if a table variant configuration ID exists in the registry
 *
 * @param id - Variant ID to check
 * @returns True if variant exists, false otherwise
 *
 * @example
 * ```typescript
 * if (isValidTableVariantConfig("compact")) {
 *   console.log("Variant exists");
 * }
 * ```
 */
export function isValidTableVariantConfig(id: string): boolean {
  return id in TABLE_VARIANT_REGISTRY;
}

/**
 * Get table variant configuration label in specified language
 *
 * @param id - Variant ID
 * @param locale - Language code ('en' or 'ar')
 * @returns The label in the requested language, or English fallback, or the ID
 *
 * @example
 * ```typescript
 * const label = getTableVariantConfigLabel("compact", "ar");
 * console.log(label); // "الشريط الجانبي المدمج"
 * ```
 */
export function getTableVariantConfigLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const config = TABLE_VARIANT_REGISTRY[id];
  if (!config) return id;

  if (locale === "ar" && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Get visible columns for a variant
 *
 * @param id - Variant ID (defaults to default variant)
 * @returns Array of visible column names
 *
 * @example
 * ```typescript
 * const columns = getVisibleColumns("compact");
 * // ["type", "name", "status", "dateDestroyed"]
 * ```
 */
export function getVisibleColumns(id?: string): TableColumn[] {
  const config = id
    ? getTableVariantConfig(id)
    : getDefaultTableVariantConfig();
  return config?.visibleColumns || [];
}

/**
 * Check if a column is visible in a variant
 *
 * @param columnName - Column name to check
 * @param id - Variant ID (defaults to default variant)
 * @returns True if column is visible, false otherwise
 *
 * @example
 * ```typescript
 * const isVisible = isColumnVisible("yearBuiltIslamic", "compact");
 * // false (not in compact variant)
 * ```
 */
export function isColumnVisible(columnName: TableColumn, id?: string): boolean {
  const columns = getVisibleColumns(id);
  return columns.includes(columnName);
}

/**
 * Get default sort configuration for a variant
 *
 * @param id - Variant ID (defaults to default variant)
 * @returns Object with sortColumn and sortDirection
 *
 * @example
 * ```typescript
 * const sortConfig = getDefaultSort("compact");
 * // { sortColumn: "dateDestroyed", sortDirection: "desc" }
 * ```
 */
export function getDefaultSort(id?: string): {
  sortColumn: TableColumn;
  sortDirection: "asc" | "desc";
} {
  const config = id
    ? getTableVariantConfig(id)
    : getDefaultTableVariantConfig();
  return {
    sortColumn: config?.defaultSortColumn || "dateDestroyed",
    sortDirection: config?.defaultSortDirection || "desc",
  };
}

// ============================================================================
// Backward Compatibility
// ============================================================================

/**
 * @deprecated Use getDefaultTableVariantConfig() instead
 * Exported for backward compatibility with existing code
 */
export const DEFAULT_TABLE_VARIANT_CONFIG = getDefaultTableVariantConfig();

/**
 * Legacy column visibility check for compact variant
 * @deprecated Use isColumnVisible(column, "compact") instead
 */
export const COMPACT_VISIBLE_COLUMNS = getVisibleColumns("compact");

/**
 * Legacy column visibility check for expanded variant
 * @deprecated Use isColumnVisible(column, "expanded") instead
 */
export const EXPANDED_VISIBLE_COLUMNS = getVisibleColumns("expanded");

/**
 * Legacy column visibility check for mobile variant
 * @deprecated Use isColumnVisible(column, "mobile") instead
 */
export const MOBILE_VISIBLE_COLUMNS = getVisibleColumns("mobile");
