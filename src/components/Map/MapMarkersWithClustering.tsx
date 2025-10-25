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
        .filter((site) => site.dateDestroyed && currentTimestamp >= new Date(site.dateDestroyed))
        .map((site) => site.id)
    );
  }, [sites, currentTimestamp]);

  const shouldCluster = sites.length > CLUSTERING_THRESHOLD;

  useEffect(() => {
    if (!map) return;

    // Create marker cluster group if clustering is enabled
    const markers = shouldCluster
      ? L.markerClusterGroup({
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
        })
      : L.layerGroup();

    // Add markers
    sites.forEach((site) => {
      const isHighlighted = site.id === highlightedSiteId;
      const fillColor = getStatusHexColor(site.status);
      const destroyed = destroyedSiteIds.has(site.id);

      let marker: L.Marker | L.CircleMarker;

      if (isHighlighted) {
        // Highlighted sites use teardrop icon
        marker = L.marker(site.coordinates, {
          icon: createMarkerIcon(site.status, true),
        });
      } else {
        // Regular sites use circle marker
        marker = L.circleMarker(site.coordinates, {
          radius: destroyed ? 2 : 3,
          fillColor: destroyed ? '#000000' : fillColor,
          fillOpacity: destroyed ? 1 : 0.8,
          color: '#000000',
          weight: 1,
        });
      }

      // Add popup
      const popupContent = renderToStaticMarkup(
        <SitePopup site={site} onViewMore={() => onSiteClick?.(site)} />
      );

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        maxHeight: 400,
        className: 'heritage-popup',
      });

      // Add click handler
      marker.on('click', () => {
        onSiteHighlight?.(site.id);
      });

      markers.addLayer(marker);
    });

    // Add markers to map
    map.addLayer(markers);

    // Cleanup on unmount
    return () => {
      map.removeLayer(markers);
    };
  }, [map, sites, highlightedSiteId, onSiteClick, onSiteHighlight, destroyedSiteIds, shouldCluster]);

  return null; // This component doesn't render React elements, only Leaflet layers
});
