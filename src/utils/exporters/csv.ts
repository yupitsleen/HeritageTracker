/**
 * CSV exporter for Heritage Tracker
 *
 * Exports site data in CSV format (RFC 4180) for:
 * - Excel and spreadsheet applications
 * - Data analysis tools
 * - Database imports
 */

import type { GazaSite } from "../../types";
import type { ExportConfig, ExportFunction } from "../../types/export";

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
 * Export sites as CSV
 *
 * @param sites - Array of sites to export
 * @returns CSV string (RFC 4180 compliant)
 */
export const exportCSV: ExportFunction = (sites: GazaSite[]): string => {
  const headers = [
    "Name",
    "Name (Arabic)",
    "Type",
    "Status",
    "Year Built",
    "Year Built (Islamic)",
    "Destruction Date",
    "Destruction Date (Islamic)",
    "Description",
    "Coordinates (Lat, Lng)",
    "Verified By",
  ];

  const rows = sites.map((site) => [
    escapeCSV(site.name),
    escapeCSV(site.nameArabic),
    escapeCSV(site.type),
    escapeCSV(site.status),
    escapeCSV(site.yearBuilt),
    escapeCSV(site.yearBuiltIslamic),
    escapeCSV(site.dateDestroyed),
    escapeCSV(site.dateDestroyedIslamic),
    escapeCSV(site.description),
    `"${site.coordinates[0]}, ${site.coordinates[1]}"`,
    escapeCSV(site.verifiedBy?.join("; ")),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};

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
