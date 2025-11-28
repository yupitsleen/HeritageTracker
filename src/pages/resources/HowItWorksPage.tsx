import { ResourcePageLayout } from "../../components/Resources/ResourcePageLayout";
import { ResourceSection } from "../../components/Resources/ResourceSection";
import { useThemeClasses } from "../../hooks/useThemeClasses";

/**
 * HowItWorksPage - Guide to using Heritage Tracker's interactive features
 *
 * Provides comprehensive instructions for:
 * - Dashboard and map navigation
 * - Data table filtering and export
 * - Timeline comparison mode
 * - Search and filtering
 */
export function HowItWorksPage() {
  const t = useThemeClasses();

  return (
    <ResourcePageLayout
      title="How to Use Heritage Tracker"
      description="Guide to exploring the interactive map, timeline, and data visualization tools"
    >
      {/* Dashboard Overview */}
      <ResourceSection title="Interactive Dashboard">
        <div className={`space-y-4 ${t.text.body}`}>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Map View</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li><strong>Click markers</strong> to view detailed site information</li>
              <li><strong>Toggle layers</strong> to switch between street view and satellite imagery</li>
              <li><strong>Zoom in</strong> on clustered markers to reveal individual sites</li>
              <li><strong>Color coding:</strong> Red (destroyed), Orange (heavily damaged), Yellow (damaged)</li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Timeline Scrubber</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li><strong>Drag the slider</strong> to see sites destroyed over time</li>
              <li><strong>Play button</strong> automatically advances through the timeline</li>
              <li><strong>Speed controls</strong> adjust animation speed (0.5x, 1x, 2x, 4x)</li>
              <li><strong>Date range</strong> spans from ancient times (BCE) to present</li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Site Details</h3>
            <p className="text-sm md:text-base">
              Click on any site to view comprehensive information including historical significance,
              destruction details, verification sources, and satellite imagery comparisons.
            </p>
          </div>
        </div>
      </ResourceSection>

      {/* Data Table */}
      <ResourceSection title="Data Table (Data Page)">
        <div className={`space-y-4 ${t.text.body}`}>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Navigation</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li><strong>Scroll</strong> to browse all 70+ documented sites</li>
              <li><strong>Click rows</strong> to open detailed site information</li>
              <li><strong>Sort columns</strong> by clicking column headers</li>
              <li><strong>Resize columns</strong> by dragging column borders</li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Export Options</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li><strong>CSV</strong> - Spreadsheet format for Excel, Google Sheets</li>
              <li><strong>JSON</strong> - Structured data format for developers</li>
              <li><strong>GeoJSON</strong> - Geographic data for GIS applications (QGIS, ArcGIS)</li>
              <li><strong>Filtered exports</strong> - Export only sites matching your current filters</li>
            </ul>
          </div>
        </div>
      </ResourceSection>

      {/* Timeline Comparison */}
      <ResourceSection title="Timeline Comparison Mode">
        <div className={`space-y-4 ${t.text.body}`}>
          <p className="text-sm md:text-base">
            Compare satellite imagery from before and after destruction events using historical imagery
            from ESRI's World Imagery Wayback archive.
          </p>

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Using the Comparison View</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li><strong>Select a site</strong> from the dropdown menu</li>
              <li><strong>Left panel</strong> shows historical imagery (before destruction)</li>
              <li><strong>Right panel</strong> shows recent imagery (after destruction)</li>
              <li><strong>Dual scrubbers</strong> allow independent date selection for each view</li>
              <li><strong>186 Wayback releases</strong> available spanning 2014-2025</li>
            </ul>
          </div>

          <div className={`${t.bg.tertiary} p-4 rounded-lg mt-4`}>
            <p className="text-sm md:text-base font-medium">
              <strong>Navigation buttons:</strong> Use NEXT/PREV to cycle through destruction events,
              or RESET to return to the first site.
            </p>
          </div>
        </div>
      </ResourceSection>

      {/* Filtering */}
      <ResourceSection title="Filtering & Search">
        <div className={`space-y-4 ${t.text.body}`}>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Filter Options</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li><strong>Site Type</strong> - Mosque, Church, Museum, Archaeological Site, Library, Monument</li>
              <li><strong>Status</strong> - Destroyed, Heavily Damaged, Damaged, Looted, Threatened</li>
              <li><strong>Historical Period</strong> - Ancient (BCE), Byzantine, Islamic, Ottoman, Modern</li>
              <li><strong>Destruction Date</strong> - Filter by specific date ranges</li>
              <li><strong>Multi-select</strong> - Combine multiple filters for precise searches</li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Search</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li>Search works across site names, locations, and descriptions</li>
              <li>Results update in real-time as you type (300ms debouncing)</li>
              <li>Use Arabic or English names interchangeably</li>
              <li>Combine search with filters for precise results</li>
            </ul>
          </div>

          <div className={`${t.bg.tertiary} p-4 rounded-lg mt-4`}>
            <p className="text-sm md:text-base">
              <strong>Tip:</strong> Filters update smoothly with 300ms debouncing to ensure optimal
              performance even with complex queries.
            </p>
          </div>
        </div>
      </ResourceSection>

      {/* Mobile & Accessibility */}
      <ResourceSection title="Mobile & Accessibility">
        <div className={`space-y-4 ${t.text.body}`}>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Mobile Support</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li><strong>Responsive design</strong> adapts to your screen size</li>
              <li><strong>Touch-friendly</strong> controls for mobile devices</li>
              <li><strong>Mobile navigation:</strong> Hamburger menu provides compact access to all pages</li>
              <li><strong>Data page</strong> serves as mobile home (Dashboard is desktop-only)</li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Keyboard Navigation</h3>
            <div className={`${t.bg.tertiary} p-4 rounded-lg`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold mb-2 text-sm">Navigation</p>
                  <ul className="space-y-1 text-sm">
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">←→</kbd> Navigate timeline</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Space</kbd> Play/pause timeline</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Esc</kbd> Close modals</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2 text-sm">Actions</p>
                  <ul className="space-y-1 text-sm">
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Tab</kbd> Navigate between elements</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Enter</kbd> Activate buttons/links</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">?</kbd> Show page help</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Accessibility Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
              <li><strong>WCAG 2.1 AA compliant</strong> color contrast ratios</li>
              <li><strong>Screen reader support</strong> with proper ARIA labels</li>
              <li><strong>Keyboard navigation</strong> for all interactive elements</li>
              <li><strong>Focus indicators</strong> clearly show current element</li>
            </ul>
          </div>
        </div>
      </ResourceSection>

      {/* Bilingual Support */}
      <ResourceSection title="Languages & Internationalization">
        <div className={`space-y-4 ${t.text.body}`}>
          <p className="text-sm md:text-base">
            Heritage Tracker supports both English and Arabic to serve researchers and advocates
            working in multiple languages.
          </p>

          <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
            <li><strong>Language toggle</strong> in header switches entire interface</li>
            <li><strong>Bilingual site names</strong> - Arabic names displayed where available</li>
            <li><strong>RTL support</strong> for Arabic text rendering</li>
            <li><strong>Calendar systems</strong> - Gregorian and Islamic (Hijri) dates</li>
            <li><strong>Exports include both languages</strong> where available</li>
          </ul>
        </div>
      </ResourceSection>

      {/* Technical Information */}
      <ResourceSection title="Technical Information">
        <div className={`space-y-4 ${t.text.body}`}>
          <p className="text-sm md:text-base">
            Heritage Tracker is built with modern web technologies for optimal performance and reliability:
          </p>

          <div className={`${t.bg.tertiary} p-4 rounded-lg`}>
            <ul className="space-y-2 text-sm md:text-base">
              <li><strong>React 19</strong> with TypeScript for type safety and reliability</li>
              <li><strong>Leaflet</strong> for interactive mapping with OpenStreetMap tiles</li>
              <li><strong>D3.js</strong> for timeline visualization and data graphics</li>
              <li><strong>Virtual scrolling</strong> handles 100+ sites at 60 FPS</li>
              <li><strong>Progressive loading</strong> ensures fast initial page load (&lt;2s)</li>
              <li><strong>Lazy loading</strong> for images and heavy components</li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-sm md:text-base">
              <strong>Data Sources:</strong> All heritage destruction data is verified by UNESCO,
              Forensic Architecture, and Heritage for Peace. Casualty statistics from Gaza Ministry
              of Health, verified by UN OCHA and UNRWA.
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm md:text-base">
              For technical documentation and source code, visit the{' '}
              <a
                href="https://github.com/yupitsleen/HeritageTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#009639] hover:underline font-medium"
              >
                GitHub repository
              </a>
            </p>
          </div>
        </div>
      </ResourceSection>

      {/* Tips & Best Practices */}
      <ResourceSection title="Tips & Best Practices">
        <div className={`${t.bg.tertiary} p-4 rounded-lg space-y-3`}>
          <div>
            <h3 className={`text-base font-semibold mb-2 ${t.text.subheading}`}>For Researchers</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use GeoJSON export for spatial analysis in QGIS or ArcGIS</li>
              <li>Filter by site type to focus on specific categories (e.g., all UNESCO-listed sites)</li>
              <li>Compare satellite imagery dates to document destruction timeline</li>
              <li>Export filtered results to share specific subsets of data</li>
            </ul>
          </div>

          <div>
            <h3 className={`text-base font-semibold mb-2 ${t.text.subheading}`}>For Advocates</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use Timeline page to create compelling before/after comparisons</li>
              <li>Share direct links to specific sites for targeted campaigns</li>
              <li>Export to CSV for reports and presentations</li>
              <li>Cite sources directly from each site's detail view</li>
            </ul>
          </div>

          <div>
            <h3 className={`text-base font-semibold mb-2 ${t.text.subheading}`}>For Educators</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use map view to show geographic distribution of sites</li>
              <li>Timeline mode demonstrates scale and timeline of destruction</li>
              <li>Stats page provides context on broader humanitarian impact</li>
              <li>About page explains verification methodology and legal frameworks</li>
            </ul>
          </div>
        </div>
      </ResourceSection>
    </ResourcePageLayout>
  );
}
