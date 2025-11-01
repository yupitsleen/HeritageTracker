import type { GazaSite } from "../../types";
import { SiteDetailView } from "./SiteDetailView";
import { Button } from "../Button";
import { useTranslation } from "../../contexts/LocaleContext";

interface ComparisonMapViewProps {
  sites: GazaSite[];
  highlightedSiteId: string | null;
  beforeTileUrl: string;
  afterTileUrl: string;
  beforeMaxZoom: number;
  afterMaxZoom: number;
  onSiteClick?: (site: GazaSite) => void;
  comparisonModeEnabled: boolean;
  onComparisonModeToggle: () => void;
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
  comparisonModeEnabled,
  onComparisonModeToggle,
}: ComparisonMapViewProps) {
  const translate = useTranslation();

  return (
    <div className="relative h-full">
      {/* Comparison Mode Toggle - Top right corner overlay */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Button
          variant="secondary"
          size="xs"
          active={comparisonModeEnabled}
          onClick={onComparisonModeToggle}
          aria-label={translate("timeline.comparisonMode")}
          title={translate("timeline.comparisonMode")}
          className="shadow-lg"
        >
          {comparisonModeEnabled ? "✓ " : ""}
          {translate("timeline.comparisonMode")}
        </Button>
      </div>

      {/* Side-by-side map layout */}
      <div className="flex h-full">
        {/* Left Map - Earlier imagery (yellow scrubber) */}
        <div className="w-1/2 h-full border-r border-gray-300">
          <SiteDetailView
            sites={sites}
            highlightedSiteId={highlightedSiteId}
            customTileUrl={beforeTileUrl}
            customMaxZoom={beforeMaxZoom}
            onSiteClick={onSiteClick}
          />
        </div>

        {/* Right Map - Later imagery (green scrubber) */}
        <div className="w-1/2 h-full">
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
