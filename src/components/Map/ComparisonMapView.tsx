import type { Site } from "../../types";
import type { WaybackImagery } from "../../types/waybackTimelineTypes";
import { SiteDetailView } from "./SiteDetailView";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { DateLabel } from "../Timeline/DateLabel";

interface ComparisonMapViewProps {
  sites: Site[];
  highlightedSiteId: string | null;
  /** Earlier/before imagery configuration */
  before: WaybackImagery;
  /** Later/after imagery configuration */
  after: WaybackImagery;
  onSiteClick?: (site: Site) => void;
}

/**
 * Comparison Map View - Shows two satellite maps side-by-side
 *
 * Displays historical satellite imagery for "before" and "after" comparison.
 * Each map is a full SiteDetailView instance with its own tile layer.
 * Maps are synchronized for pan/zoom via Leaflet's built-in sync capabilities.
 *
 * Features:
 * - Side-by-side layout (50% width each)
 * - Comparison Mode toggle button
 * - Both maps respect "Sync Map" and "Zoom to Site" settings
 * - Date labels at the top of each map (1.5x size of wayback scrubber tooltip, 70% opacity)
 *   - Left map: Yellow label (matches yellow scrubber)
 *   - Right map: Green label (matches green scrubber)
 */
export function ComparisonMapView({
  sites,
  highlightedSiteId,
  before,
  after,
  onSiteClick,
}: ComparisonMapViewProps) {
  const t = useThemeClasses();

  return (
    <div className="relative h-full">
      {/* Side-by-side map layout with gap-2 to match Dashboard */}
      <div className="flex h-full gap-2">
        {/* Left Map - Earlier imagery (yellow scrubber) */}
        <div className={`w-1/2 h-full ${t.border.primary2} rounded shadow-xl overflow-hidden relative`}>
          {/* Date label - styled like wayback tooltip but 1.5x larger with 70% opacity */}
          {before.dateLabel && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
              <DateLabel date={before.dateLabel} variant="yellow" size="md" />
            </div>
          )}
          <SiteDetailView
            sites={sites}
            highlightedSiteId={highlightedSiteId}
            customTileUrl={before.tileUrl}
            customMaxZoom={before.maxZoom}
            onSiteClick={onSiteClick}
            comparisonModeActive={true}
          />
        </div>

        {/* Right Map - Later imagery (green scrubber) */}
        <div className={`w-1/2 h-full ${t.border.primary2} rounded shadow-xl overflow-hidden relative`}>
          {/* Date label - styled like wayback tooltip but 1.5x larger with 70% opacity */}
          {after.dateLabel && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
              <DateLabel date={after.dateLabel} variant="green" size="md" />
            </div>
          )}
          <SiteDetailView
            sites={sites}
            highlightedSiteId={highlightedSiteId}
            customTileUrl={after.tileUrl}
            customMaxZoom={after.maxZoom}
            onSiteClick={onSiteClick}
            comparisonModeActive={true}
          />
        </div>
      </div>
    </div>
  );
}
