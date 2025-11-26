import { useThemeClasses } from "../../hooks/useThemeClasses";

/**
 * DataPageHelpModal
 * Help content for the Data page
 * Explains how to use the data table, filtering, sorting, and export features
 */
export function DataPageHelpModal() {
  const t = useThemeClasses();

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>How to Use the Data Page</h2>

      <div className={`space-y-4 ${t.text.body}`}>
        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Overview</h3>
          <p className="text-sm">
            The Data page provides a comprehensive table view of all 70 cultural heritage sites in Gaza
            (representing 140-160 buildings). Use the filters, search, and sorting features to explore and
            analyze the complete dataset.
          </p>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Search & Filter</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Search:</strong> Type in the search box to find sites by name (English or Arabic)</li>
            <li><strong>Type Filter:</strong> Click the Type dropdown to filter by site type (mosque, church, archaeological site, etc.)</li>
            <li><strong>Status Filter:</strong> Click the Status dropdown to filter by damage status (destroyed, heavily damaged, etc.)</li>
            <li><strong>Clear Filters:</strong> Click the "Clear All" button to reset all filters and see the complete dataset</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Table Features</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Sort Columns:</strong> Click on any column header to sort by that field (click again to reverse order)</li>
            <li><strong>View Site Details:</strong> Click on any row to open a detailed view with full information, sources, and images</li>
            <li><strong>Scroll:</strong> The table supports smooth scrolling with virtual rendering for fast performance</li>
            <li><strong>Column Information:</strong> Each column shows key data including name, type, status, year built, destruction date, location, and verification sources</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Export Data</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>CSV:</strong> Export the filtered dataset to CSV format for use in spreadsheets (Excel, Google Sheets)</li>
            <li><strong>JSON:</strong> Export to JSON format for developers and data analysis tools</li>
            <li><strong>GeoJSON:</strong> Export with geographic coordinates for use in mapping applications (QGIS, ArcGIS)</li>
            <li>Note: The export includes only the currently filtered sites, so apply filters before exporting if needed</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Tips</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Filter by site type to focus on specific categories (e.g., all mosques or archaeological sites)</li>
            <li>Use the search to quickly locate a specific site by name</li>
            <li>Sort by destruction date to see the chronological progression of damage</li>
            <li>Export filtered results to share specific subsets of data with others</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
