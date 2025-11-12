/**
 * Export Format Registry for Heritage Tracker
 *
 * Central registry for all export formats with extensibility support.
 * Follows the same pattern as Site Type and Status registries.
 *
 * @example
 * ```typescript
 * // Get all available formats
 * const formats = getExportFormats();
 *
 * // Register a custom format
 * registerExportFormat({
 *   config: KML_CONFIG,
 *   export: exportKML
 * });
 *
 * // Export sites
 * const result = exportSites(sites, 'geojson');
 * ```
 */

import type { Site } from "../types";
import type {
  ExportConfig,
  ExportFormatId,
  Exporter,
  ExportOptions,
  ExportResult,
} from "../types/export";

// Import built-in exporters
import { CSV_CONFIG, exportCSV } from "../utils/exporters/csv";
import { JSON_CONFIG, exportJSON } from "../utils/exporters/json";
import { GEOJSON_CONFIG, exportGeoJSON } from "../utils/exporters/geojson";

/**
 * Central registry of all export formats
 * Default formats: CSV, JSON, GeoJSON
 */
const EXPORT_REGISTRY: Record<ExportFormatId, Exporter> = {
  csv: {
    config: CSV_CONFIG,
    export: exportCSV,
  },
  json: {
    config: JSON_CONFIG,
    export: exportJSON,
  },
  geojson: {
    config: GEOJSON_CONFIG,
    export: exportGeoJSON,
  },
};

/**
 * Register a new export format
 *
 * @param exporter - Exporter configuration and implementation
 *
 * @example
 * ```typescript
 * registerExportFormat({
 *   config: {
 *     id: 'kml',
 *     label: 'KML',
 *     fileExtension: 'kml',
 *     mimeType: 'application/vnd.google-earth.kml+xml',
 *     description: 'Google Earth format'
 *   },
 *   export: (sites) => convertToKML(sites)
 * });
 * ```
 */
export function registerExportFormat(exporter: Exporter): void {
  EXPORT_REGISTRY[exporter.config.id] = exporter;
}

/**
 * Get all registered export formats
 *
 * @returns Array of all registered exporters
 */
export function getExportFormats(): Exporter[] {
  return Object.values(EXPORT_REGISTRY);
}

/**
 * Get export configurations only (without export functions)
 * Useful for UI rendering
 *
 * @returns Array of export configurations
 */
export function getExportConfigs(): ExportConfig[] {
  return getExportFormats().map((exporter) => exporter.config);
}

/**
 * Get a specific export configuration by ID
 *
 * @param formatId - Export format identifier
 * @returns Export configuration or undefined if not found
 */
export function getExportConfig(formatId: ExportFormatId): ExportConfig | undefined {
  return EXPORT_REGISTRY[formatId]?.config;
}

/**
 * Get a specific exporter by ID
 *
 * @param formatId - Export format identifier
 * @returns Exporter or undefined if not found
 */
export function getExporter(formatId: ExportFormatId): Exporter | undefined {
  return EXPORT_REGISTRY[formatId];
}

/**
 * Check if a format is registered
 *
 * @param formatId - Export format identifier
 * @returns True if format exists in registry
 */
export function isFormatRegistered(formatId: ExportFormatId): boolean {
  return formatId in EXPORT_REGISTRY;
}

/**
 * Export sites to specified format
 *
 * @param sites - Sites to export
 * @param formatId - Export format to use
 * @returns Formatted data string
 * @throws Error if format not found
 */
export function exportToFormat(sites: Site[], formatId: ExportFormatId): string {
  const exporter = getExporter(formatId);

  if (!exporter) {
    throw new Error(`Export format '${formatId}' not found in registry`);
  }

  return exporter.export(sites);
}

/**
 * Export sites and trigger browser download
 *
 * @param options - Export options
 * @returns Export result with metadata
 */
export function exportSites(options: ExportOptions): ExportResult {
  try {
    const { format, sites, filename } = options;

    // Get exporter
    const exporter = getExporter(format);
    if (!exporter) {
      return {
        success: false,
        format,
        filename: "",
        siteCount: 0,
        error: `Export format '${format}' not found`,
      };
    }

    // Generate data
    const data = exporter.export(sites);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const generatedFilename =
      filename || `heritage-tracker-sites-${timestamp}.${exporter.config.fileExtension}`;

    // Create download
    const blob = new Blob([data], { type: exporter.config.mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", generatedFilename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      format,
      filename: generatedFilename,
      siteCount: sites.length,
    };
  } catch (error) {
    return {
      success: false,
      format: options.format,
      filename: "",
      siteCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
