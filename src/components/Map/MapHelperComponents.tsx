import React, { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { GazaSite } from "../../types";

/**
 * MapUpdater - Updates map view (center and zoom) with smooth animation
 * Used when map needs to programmatically change position
 */
export function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [map, center, zoom]);

  return null;
}

/**
 * MapCenterHandler - Handles map centering when a site is highlighted
 * Smoothly pans to the highlighted site
 */
export function MapCenterHandler({
  sites,
  highlightedSiteId,
}: {
  sites: GazaSite[];
  highlightedSiteId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (highlightedSiteId) {
      const site = sites.find((s) => s.id === highlightedSiteId);
      if (site) {
        // Close any open popups
        map.closePopup();

        // Smoothly pan to the site without scrolling the page
        map.flyTo(site.coordinates, map.getZoom(), {
          duration: 0.8,
          easeLinearity: 0.25,
        });
      }
    }
  }, [highlightedSiteId, sites, map]);

  return null;
}

/**
 * ZoomLogger - Logs zoom level changes (for debugging in development mode only)
 */
export function ZoomLogger() {
  const map = useMap();

  useEffect(() => {
    // Only log in development mode
    if (!import.meta.env.DEV) return;

    const logZoom = () => {
      console.log('🔍 Current Zoom Level:', map.getZoom());
    };

    // Log initial zoom
    logZoom();

    // Log on zoom changes
    map.on('zoomend', logZoom);

    return () => {
      map.off('zoomend', logZoom);
    };
  }, [map]);

  return null;
}

/**
 * ScrollWheelHandler - Handles Ctrl+Scroll zoom behavior
 * Only zooms when Ctrl (or Cmd on Mac) is pressed, otherwise allows page scroll
 */
export function ScrollWheelHandler() {
  const map = useMapEvents({});

  React.useEffect(() => {
    const container = map.getContainer();

    const handleWheel = (e: WheelEvent) => {
      // Only zoom if Ctrl (or Cmd on Mac) is pressed
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Prevent browser zoom
        e.stopPropagation(); // Stop event from bubbling

        const delta = e.deltaY;
        const currentZoom = map.getZoom();

        // Use a smaller increment for smoother zooming
        if (delta < 0) {
          // Scroll up = zoom in
          map.setZoom(currentZoom + 1);
        } else if (delta > 0) {
          // Scroll down = zoom out
          map.setZoom(currentZoom - 1);
        }
      }
      // If Ctrl/Cmd not pressed, do nothing (allow normal page scroll)
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
}
