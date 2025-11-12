/**
 * JSON exporter for Heritage Tracker
 *
 * Exports site data in simple JSON format for:
 * - API integration
 * - Database imports
 * - Web applications
 * - Data exchange
 */

import type { Site } from "../../types";
import type { ExportConfig, ExportFunction } from "../../types/export";

/**
 * JSON export wrapper with metadata
 */
interface JSONExport {
  metadata: {
    title: string;
    description: string;
    generated: string;
    source: string;
    license: string;
    siteCount: number;
    version: string;
  };
  sites: Site[];
}

/**
 * Export sites as JSON
 *
 * @param sites - Array of sites to export
 * @returns JSON string with metadata wrapper
 */
export const exportJSON: ExportFunction = (sites: Site[]): string => {
  const jsonExport: JSONExport = {
    metadata: {
      title: "Gaza Heritage Sites",
      description: "Cultural heritage sites damaged or destroyed in Gaza",
      generated: new Date().toISOString(),
      source: "Heritage Tracker (https://yupitsleen.github.io/HeritageTracker/)",
      license: "Educational Fair Use - Attribution Required",
      siteCount: sites.length,
      version: "1.0",
    },
    sites,
  };

  // Pretty-print with 2-space indentation for readability
  return JSON.stringify(jsonExport, null, 2);
};

/**
 * JSON export configuration
 */
export const JSON_CONFIG: ExportConfig = {
  id: "json",
  label: "JSON",
  labelArabic: "جيسون",
  fileExtension: "json",
  mimeType: "application/json",
  description: "Standard JSON format for API integration and data exchange",
  icon: "📄",
  recommended: {
    gis: false,
    analysis: false,
    api: true,
  },
};
