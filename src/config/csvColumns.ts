import type { CSVColumnConfig, CSVColumnId } from "../types/csvColumns";

/**
 * CSV Column Registry
 *
 * Defines all available columns for CSV export with extensibility.
 */
export const CSV_COLUMN_REGISTRY: Record<CSVColumnId, CSVColumnConfig> = {
  name: {
    id: "name",
    label: "Name",
    labelArabic: "الاسم",
    getValue: (site) => site.name,
    defaultIncluded: true,
    order: 1,
    required: true,
    description: "Site name in English",
  },
  nameArabic: {
    id: "nameArabic",
    label: "Name (Arabic)",
    labelArabic: "الاسم (بالعربية)",
    getValue: (site) => site.nameArabic,
    defaultIncluded: true,
    order: 2,
    description: "Site name in Arabic",
  },
  type: {
    id: "type",
    label: "Type",
    labelArabic: "النوع",
    getValue: (site) => site.type,
    defaultIncluded: true,
    order: 3,
    description: "Site type (mosque, church, archaeological, etc.)",
  },
  status: {
    id: "status",
    label: "Status",
    labelArabic: "الحالة",
    getValue: (site) => site.status,
    defaultIncluded: true,
    order: 4,
    description: "Damage status (destroyed, heavily-damaged, damaged)",
  },
  yearBuilt: {
    id: "yearBuilt",
    label: "Year Built",
    labelArabic: "سنة البناء",
    getValue: (site) => site.yearBuilt,
    defaultIncluded: true,
    order: 5,
    description: "Year of construction (Gregorian calendar)",
  },
  yearBuiltIslamic: {
    id: "yearBuiltIslamic",
    label: "Year Built (Islamic)",
    labelArabic: "سنة البناء (هجري)",
    getValue: (site) => site.yearBuiltIslamic,
    defaultIncluded: false,
    order: 6,
    description: "Year of construction (Islamic calendar)",
  },
  dateDestroyed: {
    id: "dateDestroyed",
    label: "Destruction Date",
    labelArabic: "تاريخ التدمير",
    getValue: (site) => site.dateDestroyed,
    defaultIncluded: true,
    order: 7,
    description: "Date of destruction (Gregorian calendar)",
  },
  dateDestroyedIslamic: {
    id: "dateDestroyedIslamic",
    label: "Destruction Date (Islamic)",
    labelArabic: "تاريخ التدمير (هجري)",
    getValue: (site) => site.dateDestroyedIslamic,
    defaultIncluded: false,
    order: 8,
    description: "Date of destruction (Islamic calendar)",
  },
  description: {
    id: "description",
    label: "Description",
    labelArabic: "الوصف",
    getValue: (site) => site.description,
    defaultIncluded: false,
    order: 9,
    description: "Brief description of the site",
  },
  coordinates: {
    id: "coordinates",
    label: "Coordinates (Lat, Lng)",
    labelArabic: "الإحداثيات (خط العرض، خط الطول)",
    getValue: (site) => `${site.coordinates[0]}, ${site.coordinates[1]}`,
    defaultIncluded: true,
    order: 10,
    description: "Geographic coordinates",
  },
  verifiedBy: {
    id: "verifiedBy",
    label: "Verified By",
    labelArabic: "تم التحقق بواسطة",
    getValue: (site) => site.verifiedBy?.join("; "),
    defaultIncluded: true,
    order: 11,
    description: "Verification organizations",
  },
  historicalSignificance: {
    id: "historicalSignificance",
    label: "Historical Significance",
    labelArabic: "الأهمية التاريخية",
    getValue: (site) => site.historicalSignificance,
    defaultIncluded: false,
    order: 12,
    description: "Historical importance and context",
  },
  culturalValue: {
    id: "culturalValue",
    label: "Cultural Value",
    labelArabic: "القيمة الثقافية",
    getValue: (site) => site.culturalValue,
    defaultIncluded: false,
    order: 13,
    description: "Cultural and archaeological value",
  },
};

/**
 * Get CSV column configuration by ID
 *
 * @param columnId - Column identifier
 * @returns Column configuration or undefined
 */
export function getCSVColumn(columnId: CSVColumnId): CSVColumnConfig | undefined {
  return CSV_COLUMN_REGISTRY[columnId];
}

/**
 * Get all available CSV columns
 *
 * @returns Array of all column configurations
 */
export function getAllCSVColumns(): CSVColumnConfig[] {
  return Object.values(CSV_COLUMN_REGISTRY);
}

/**
 * Get default CSV columns (defaultIncluded = true)
 *
 * @returns Array of default column configurations, sorted by order
 */
export function getDefaultCSVColumns(): CSVColumnConfig[] {
  return getAllCSVColumns()
    .filter((col) => col.defaultIncluded)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get CSV columns by IDs
 *
 * @param columnIds - Array of column IDs
 * @returns Array of column configurations, sorted by order
 */
export function getCSVColumnsByIds(columnIds: CSVColumnId[]): CSVColumnConfig[] {
  return columnIds
    .map((id) => getCSVColumn(id))
    .filter((col): col is CSVColumnConfig => col !== undefined)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get required CSV columns (cannot be disabled)
 *
 * @returns Array of required column configurations
 */
export function getRequiredCSVColumns(): CSVColumnConfig[] {
  return getAllCSVColumns().filter((col) => col.required);
}

/**
 * Get column IDs from configurations
 *
 * @param columns - Array of column configurations
 * @returns Array of column IDs
 */
export function getColumnIds(columns: CSVColumnConfig[]): CSVColumnId[] {
  return columns.map((col) => col.id);
}

/**
 * Check if a column ID is valid
 *
 * @param columnId - Column ID to check
 * @returns True if column exists
 */
export function isValidCSVColumn(columnId: string): columnId is CSVColumnId {
  return columnId in CSV_COLUMN_REGISTRY;
}

/**
 * Get column label (with locale support)
 *
 * @param columnId - Column identifier
 * @param locale - Locale code (default: "en")
 * @returns Localized column label
 */
export function getCSVColumnLabel(columnId: CSVColumnId, locale: string = "en"): string {
  const column = getCSVColumn(columnId);
  if (!column) return columnId;

  if (locale === "ar" && column.labelArabic) {
    return column.labelArabic;
  }

  return column.label;
}
