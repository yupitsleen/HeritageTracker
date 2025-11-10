/**
 * MapMarkersWithClustering - Renders heritage site markers with clustering support
 *
 * Uses leaflet.markercluster for grouping nearby markers at low zoom levels.
 * Automatically switches between clustering (50+ sites) and regular markers (< 50 sites).
 */

import { useEffect, useMemo, memo } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { GazaSite } from '../../types';
import { createMarkerIcon } from '../../utils/mapHelpers';
import { getStatusHexColor } from '../../utils/colorHelpers';
import { getEffectiveDestructionDate } from '../../utils/format';
import { renderToStaticMarkup } from 'react-dom/server';
import { SitePopup } from './SitePopup';

// Import marker cluster CSS
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface MapMarkersWithClusteringProps {
  sites: GazaSite[];
  highlightedSiteId?: string | null;
  onSiteClick?: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  currentTimestamp?: Date;
}

const CLUSTERING_THRESHOLD = 50;

/**
 * Create marker cluster group with custom styling
 */
function createClusterGroup(): L.MarkerClusterGroup {
  return L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div class="cluster-marker">${count}</div>`,
        className: 'marker-cluster-custom',
        iconSize: L.point(40, 40),
      });
    },
  });
}

/**
 * Create a single marker for a site
 */
function createSiteMarker(
  site: GazaSite,
  isHighlighted: boolean,
  isDestroyed: boolean
): L.Marker | L.CircleMarker {
  if (isHighlighted) {
    // Highlighted sites use teardrop icon
    return L.marker(site.coordinates, {
      icon: createMarkerIcon(site.status, true),
    });
  }

  // Regular sites use circle marker
  const fillColor = getStatusHexColor(site.status);
  return L.circleMarker(site.coordinates, {
    radius: isDestroyed ? 2 : 3,
    fillColor: isDestroyed ? '#000000' : fillColor,
    fillOpacity: isDestroyed ? 1 : 0.8,
    color: '#000000',
    weight: 1,
  });
}

/**
 * Add popup to marker
 */
function addPopupToMarker(
  marker: L.Marker | L.CircleMarker,
  site: GazaSite,
  onViewMore: (() => void) | undefined
): void {
  const popupContent = renderToStaticMarkup(
    <SitePopup site={site} onViewMore={onViewMore || (() => {})} />
  );

  marker.bindPopup(popupContent, {
    maxWidth: 320,
    maxHeight: 400,
    className: 'heritage-popup',
  });
}

/**
 * MapMarkersWithClustering - Clusters markers for better performance with large datasets
 *
 * Features:
 * - Automatic clustering for 50+ sites
 * - Custom cluster icon with site count
 * - Palestinian flag color scheme
 * - Spiderfy on zoom for overlapping markers
 *
 * PERFORMANCE:
 * - Memoized destroyed sites Set (O(1) lookups)
 * - React.memo to prevent unnecessary re-renders
 * - Extracted helper functions for better testability
 */
export const MapMarkersWithClustering = memo(function MapMarkersWithClustering({
  sites,
  highlightedSiteId,
  onSiteClick,
  onSiteHighlight,
  currentTimestamp,
}: MapMarkersWithClusteringProps) {
  const map = useMap();

  /**
   * Pre-compute destroyed site IDs as a Set for O(1) lookup
   */
  const destroyedSiteIds = useMemo(() => {
    if (!currentTimestamp) return new Set<string>();

    return new Set(
      sites
        .filter((site) => {
          const effectiveDestructionDate = getEffectiveDestructionDate(site);
          return effectiveDestructionDate && currentTimestamp >= new Date(effectiveDestructionDate);
        })
        .map((site) => site.id)
    );
  }, [sites, currentTimestamp]);

  const shouldCluster = sites.length > CLUSTERING_THRESHOLD;

  useEffect(() => {
    if (!map) return;

    // Create marker group (clustered or regular)
    const markerGroup = shouldCluster ? createClusterGroup() : L.layerGroup();

    // Add markers for each site
    sites.forEach((site) => {
      const isHighlighted = site.id === highlightedSiteId;
      const isDestroyed = destroyedSiteIds.has(site.id);

      // Create marker
      const marker = createSiteMarker(site, isHighlighted, isDestroyed);

      // Add popup
      addPopupToMarker(marker, site, () => onSiteClick?.(site));

      // Add click handler for highlighting
      marker.on('click', () => {
        onSiteHighlight?.(site.id);
      });

      markerGroup.addLayer(marker);
    });

    // Add to map
    map.addLayer(markerGroup);

    // Cleanup on unmount
    return () => {
      map.removeLayer(markerGroup);
    };
  }, [map, sites, highlightedSiteId, onSiteClick, onSiteHighlight, destroyedSiteIds, shouldCluster]);

  return null; // This component doesn't render React elements, only Leaflet layers
});
