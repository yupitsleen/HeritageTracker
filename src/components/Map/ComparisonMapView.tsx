import type { GazaSite } from "../../types";
import { SiteDetailView } from "./SiteDetailView";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface ComparisonMapViewProps {
  sites: GazaSite[];
  highlightedSiteId: string | null;
  beforeTileUrl: string;
  afterTileUrl: string;
  beforeMaxZoom: number;
  afterMaxZoom: number;
  beforeDateLabel?: string;
  afterDateLabel?: string;
  onSiteClick?: (site: GazaSite) => void;
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
  beforeTileUrl,
  afterTileUrl,
  beforeMaxZoom,
  afterMaxZoom,
  beforeDateLabel,
  afterDateLabel,
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
          {beforeDateLabel && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
              <div className="px-3 py-0.75 bg-[#F4D03F] text-black text-[15px] font-semibold rounded whitespace-nowrap shadow-lg opacity-70">
                {beforeDateLabel}
              </div>
            </div>
          )}
          <SiteDetailView
            sites={sites}
            highlightedSiteId={highlightedSiteId}
            customTileUrl={beforeTileUrl}
            customMaxZoom={beforeMaxZoom}
            onSiteClick={onSiteClick}
            comparisonModeActive={true}
          />
        </div>

        {/* Right Map - Later imagery (green scrubber) */}
        <div className={`w-1/2 h-full ${t.border.primary2} rounded shadow-xl overflow-hidden relative`}>
          {/* Date label - styled like wayback tooltip but 1.5x larger with 70% opacity */}
          {afterDateLabel && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
              <div className="px-3 py-0.75 bg-[#009639] text-white text-[15px] font-semibold rounded whitespace-nowrap shadow-lg opacity-70">
                {afterDateLabel}
              </div>
            </div>
          )}
          <SiteDetailView
            sites={sites}
            highlightedSiteId={highlightedSiteId}
            customTileUrl={afterTileUrl}
            customMaxZoom={afterMaxZoom}
            onSiteClick={onSiteClick}
            comparisonModeActive={true}
          />
        </div>
      </div>
    </div>
  );
}
