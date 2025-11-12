import { useThemeClasses } from "../../hooks/useThemeClasses";

/**
 * TimelineHelpModal
 * Help content for the Satellite Timeline page
 * Explains how to use Wayback imagery, comparison mode, and timeline scrubber
 */
export function TimelineHelpModal() {
  const t = useThemeClasses();

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>How to Use Satellite Timeline</h2>

      <div className={`space-y-4 ${t.text.body}`}>
        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Overview</h3>
          <p className="text-sm">
            The Satellite Timeline provides access to 186 historical satellite imagery versions from
            ESRI Wayback (2014-2025). This specialized view lets you see how the landscape has changed over time,
            with precise timestamps for each satellite image capture.
          </p>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Satellite Map</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Full-screen satellite view showing the entire region</li>
            <li>Click on site markers to view detailed information</li>
            <li>Markers update to match the currently selected satellite imagery date</li>
            <li>Red markers indicate sites that were destroyed before or on the displayed date</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Wayback Timeline Slider</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Year Markers:</strong> Vertical labels (2014-2025) mark each calendar year</li>
            <li><strong>Gray Lines:</strong> Each line represents one satellite imagery capture date (186 total)</li>
            <li><strong>Red Dots:</strong> Show when sites were destroyed (vertically stacked for visibility)</li>
            <li><strong>Green Scrubber:</strong> Drag to view different dates, tooltip shows current date</li>
            <li>Click anywhere on the timeline to jump to that date</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Comparison Mode</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Toggle:</strong> Click "Comparison Mode" button above the timeline to enable side-by-side view</li>
            <li><strong>Two Maps:</strong> View "before" imagery (left) and "after" imagery (right) simultaneously</li>
            <li><strong>Yellow Scrubber:</strong> Controls the "before" date (appears below timeline with yellow tooltip)</li>
            <li><strong>Green Scrubber:</strong> Controls the "after" date (above timeline with green tooltip)</li>
            <li><strong>Click Timeline:</strong> Moves the closest scrubber to that date</li>
            <li><strong>Auto-Sync:</strong> When clicking site dots with sync enabled, automatically sets before/after imagery around the destruction date</li>
            <li>Perfect for comparing satellite imagery before and after destruction events</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Navigation Controls</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Reset:</strong> Return to the first imagery version (2014)</li>
            <li><strong>Previous (⏮):</strong> Go to the previous year marker</li>
            <li><strong>Play/Pause (▶/⏸):</strong> Automatically advance through time</li>
            <li><strong>Next (⏭):</strong> Jump to the next year marker</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Site Timeline (Bottom)</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Shows destruction events for all heritage sites</li>
            <li>Click a red dot to highlight the site on the map</li>
            <li>Highlighted sites show with a black dot and enlarged marker</li>
            <li>Use the "Sync map on dot click" toggle to automatically jump to the destruction date in Wayback imagery</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Tips</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Compare satellite imagery before and after destruction events</li>
            <li>Watch seasonal changes in the landscape over the years</li>
            <li>Notice the density of gray lines - ESRI updates imagery more frequently in recent years</li>
            <li>Use the footer links to access Statistics, About, and donation information</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
