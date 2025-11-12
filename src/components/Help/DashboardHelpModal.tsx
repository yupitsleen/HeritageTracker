import { useThemeClasses } from "../../hooks/useThemeClasses";

/**
 * DashboardHelpModal
 * Help content for the Dashboard page
 * Explains how to use the interactive map, timeline, site table, and filtering features
 */
export function DashboardHelpModal() {
  const t = useThemeClasses();

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>How to Use Heritage Tracker</h2>

      <div className={`space-y-4 ${t.text.body}`}>
        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Overview</h3>
          <p className="text-sm">
            Heritage Tracker documents 70 cultural heritage sites in Gaza (representing 140-160 buildings) that have been damaged or destroyed.
            Explore the interactive map, timeline, and table to learn about these historically significant locations.
          </p>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Site Table (Left)</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Click on a site name to view detailed information</li>
            <li>Click on a row to highlight the site on the map</li>
            <li>Use the expand button to see all columns and export to CSV</li>
            <li>Drag the resize handle to adjust table width</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Maps (Center & Right)</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Heritage Map (center):</strong> Interactive map with all sites. Toggle between street and satellite views</li>
            <li><strong>Site Detail View (right):</strong> Zooms to selected site. Use the time toggle (2014/Aug 2023/Current) to view historical satellite imagery</li>
            <li>Click on map markers to highlight sites</li>
            <li>Colored dots indicate site status: red (destroyed), orange (heavily damaged), yellow (damaged)</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Timeline (Bottom)</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Red dots represent destruction events</li>
            <li>Click a dot to highlight the corresponding site</li>
            <li>Use play/pause to animate through the timeline</li>
            <li>Adjust playback speed (0.5x, 1x, 2x, 4x)</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Filtering</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Use the search bar to find sites by name</li>
            <li>Use the filter dropdowns to filter by type, status, destruction date, or year built</li>
            <li>Clear all filters with the "Clear" button</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Timeline Page</h3>
          <p className="text-sm">
            Click "Timeline" in the header to view a specialized page with 186 historical satellite imagery versions
            from ESRI Wayback (2014-2025), showing how the landscape has changed over time with side-by-side comparison mode.
          </p>
        </section>
      </div>
    </div>
  );
}
