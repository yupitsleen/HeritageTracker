import type { Site } from "../types";

/**
 * Escape CSV field according to RFC 4180
 * - Wrap in quotes if contains comma, newline, or quote
 * - Escape internal quotes by doubling them
 */
export function escapeCSV(value: string | undefined | null): string {
  if (!value) return "";

  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Convert sites array to CSV format
 * Includes all site fields with proper escaping
 */
export function sitesToCSV(sites: Site[]): string {
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
}

/**
 * Trigger CSV download in browser
 * Generates timestamped filename: heritage-tracker-sites-YYYY-MM-DD.csv
 */
export function downloadCSV(sites: Site[], filename?: string) {
  const csv = sitesToCSV(sites);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const defaultFilename = `heritage-tracker-sites-${new Date().toISOString().split("T")[0]}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", filename || defaultFilename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
