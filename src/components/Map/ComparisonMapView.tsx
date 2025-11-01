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
 * - No labels (dates shown via overlay - TBD)
 */
export function ComparisonMapView({
  sites,
  highlightedSiteId,
  beforeTileUrl,
  afterTileUrl,
  beforeMaxZoom,
  afterMaxZoom,
  onSiteClick,
}: ComparisonMapViewProps) {
  const t = useThemeClasses();

  return (
    <div className="relative h-full">
      {/* Side-by-side map layout with gap-2 to match Dashboard */}
      <div className="flex h-full gap-2">
        {/* Left Map - Earlier imagery (yellow scrubber) */}
        <div className={`w-1/2 h-full ${t.border.primary2} rounded shadow-xl overflow-hidden`}>
          <SiteDetailView
            sites={sites}
            highlightedSiteId={highlightedSiteId}
            customTileUrl={beforeTileUrl}
            customMaxZoom={beforeMaxZoom}
            onSiteClick={onSiteClick}
          />
        </div>

        {/* Right Map - Later imagery (green scrubber) */}
        <div className={`w-1/2 h-full ${t.border.primary2} rounded shadow-xl overflow-hidden`}>
          <SiteDetailView
            sites={sites}
            highlightedSiteId={highlightedSiteId}
            customTileUrl={afterTileUrl}
            customMaxZoom={afterMaxZoom}
            onSiteClick={onSiteClick}
          />
        </div>
      </div>
    </div>
  );
}
