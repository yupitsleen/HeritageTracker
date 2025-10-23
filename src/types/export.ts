/**
 * Export system types for Heritage Tracker
 *
 * Defines interfaces for extensible export functionality supporting
 * multiple formats (CSV, JSON, GeoJSON, etc.)
 */

import type { GazaSite } from "./index";

/**
 * Export format identifier
 */
export type ExportFormatId = string;

/**
 * Configuration for an export format
 */
export interface ExportConfig {
  /** Unique identifier (e.g., 'csv', 'geojson', 'json') */
  id: ExportFormatId;

  /** Display name for UI (e.g., 'CSV', 'GeoJSON', 'JSON') */
  label: string;

  /** Arabic label for internationalization */
  labelArabic?: string;

  /** File extension without dot (e.g., 'csv', 'json', 'geojson') */
  fileExtension: string;

  /** MIME type for download (e.g., 'text/csv', 'application/geo+json') */
  mimeType: string;

  /** Human-readable description */
  description?: string;

  /** Icon name or emoji for UI */
  icon?: string;

  /** Whether this format is recommended for specific use cases */
  recommended?: {
    /** Recommended for GIS/mapping tools */
    gis?: boolean;
    /** Recommended for data analysis */
    analysis?: boolean;
    /** Recommended for API integration */
    api?: boolean;
  };
}

/**
 * Export function signature
 * Takes array of sites and returns formatted string data
 */
export type ExportFunction = (sites: GazaSite[]) => string;

/**
 * Complete exporter definition combining config and implementation
 */
export interface Exporter {
  config: ExportConfig;
  export: ExportFunction;
}

/**
 * Options for export operations
 */
export interface ExportOptions {
  /** Format to export as */
  format: ExportFormatId;

  /** Optional filename prefix (timestamp will be appended) */
  filename?: string;

  /** Sites to export */
  sites: GazaSite[];

  /** Include metadata in export (date, source, etc.) */
  includeMetadata?: boolean;
}

/**
 * Result of an export operation
 */
export interface ExportResult {
  /** Whether export was successful */
  success: boolean;

  /** Format used */
  format: ExportFormatId;

  /** Generated filename */
  filename: string;

  /** Number of sites exported */
  siteCount: number;

  /** Error message if failed */
  error?: string;
}
