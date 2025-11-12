import { useState, useMemo } from "react";
import { exportSites, getExportConfigs } from "../config/exportFormats";
import type { ExportFormatId } from "../types/export";
import type { Site } from "../types";

/**
 * Hook for table export functionality
 * Manages export format selection and export handler
 *
 * @param sites - Array of sites to export
 * @returns Export format state, configs, and export handler
 *
 * @example
 * ```tsx
 * const { selectedExportFormat, setSelectedExportFormat, exportConfigs, handleExport } =
 *   useTableExport(sortedSites);
 * ```
 */
export function useTableExport(sites: Site[]) {
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormatId>("csv");

  const exportConfigs = useMemo(() => getExportConfigs(), []);

  const handleExport = () => {
    exportSites({
      format: selectedExportFormat,
      sites,
    });
  };

  return {
    selectedExportFormat,
    setSelectedExportFormat,
    exportConfigs,
    handleExport,
  };
}
