/**
 * CSV exporter for Heritage Tracker
 *
 * Exports site data in CSV format (RFC 4180) for:
 * - Excel and spreadsheet applications
 * - Data analysis tools
 * - Database imports
 *
 * Now supports customizable column selection via CSV_COLUMN_REGISTRY.
 */

import type { GazaSite } from "../../types";
import type { ExportConfig, ExportFunction } from "../../types/export";
import type { CSVColumnId, CSVExportOptions } from "../../types/csvColumns";
import { getDefaultCSVColumns, getCSVColumnsByIds, getColumnIds } from "../../config/csvColumns";

/**
 * Escape CSV field according to RFC 4180
 * - Wrap in quotes if contains comma, newline, or quote
 * - Escape internal quotes by doubling them
 */
function escapeCSV(value: string | undefined | null): string {
  if (!value) return "";

  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Export sites as CSV (basic version - uses default columns)
 *
 * @param sites - Array of sites to export
 * @returns CSV string (RFC 4180 compliant)
 */
export const exportCSV: ExportFunction = (sites: GazaSite[]): string => {
  return exportCSVWithOptions(sites, {});
};

/**
 * Export sites as CSV with custom column selection
 *
 * @param sites - Array of sites to export
 * @param options - Export options (column selection, headers)
 * @returns CSV string (RFC 4180 compliant)
 */
export function exportCSVWithOptions(sites: GazaSite[], options: CSVExportOptions = {}): string {
  const { columns: columnIds, includeHeaders = true } = options;

  // Get column configurations (default or custom)
  const columns = columnIds ? getCSVColumnsByIds(columnIds) : getDefaultCSVColumns();

  // Generate headers
  const headers = columns.map((col) => col.label);

  // Generate rows
  const rows = sites.map((site) =>
    columns.map((col) => {
      const value = col.getValue(site);
      return escapeCSV(value);
    })
  );

  // Combine headers and rows
  const lines: string[] = [];
  if (includeHeaders) {
    lines.push(headers.join(","));
  }
  lines.push(...rows.map((row) => row.join(",")));

  return lines.join("\n");
}

/**
 * Get default column IDs for CSV export
 *
 * @returns Array of default column IDs
 */
export function getDefaultCSVColumnIds(): CSVColumnId[] {
  return getColumnIds(getDefaultCSVColumns());
}

/**
 * CSV export configuration
 */
export const CSV_CONFIG: ExportConfig = {
  id: "csv",
  label: "CSV",
  labelArabic: "سي إس في",
  fileExtension: "csv",
  mimeType: "text/csv",
  description: "Comma-separated values for Excel and spreadsheet applications",
  icon: "📊",
  recommended: {
    gis: false,
    analysis: true,
    api: false,
  },
};
