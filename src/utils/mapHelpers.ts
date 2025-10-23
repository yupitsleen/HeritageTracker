import { Icon } from "leaflet";
import { getMarkerColor as getMarkerColorFromRegistry } from "../config/siteStatus";
import {
  MARKER_ICON_BASE_URL,
  MARKER_SHADOW_URL,
  MARKER_CONFIG,
} from "../constants/map";

/**
 * Get marker color based on site damage status
 * Now uses STATUS_REGISTRY for extensibility
 * Colors match leaflet-color-markers library
 */
export const getMarkerColor = (status: string): string => {
  return getMarkerColorFromRegistry(status);
};

/**
 * Create a Leaflet marker icon based on status and highlight state
 */
export const createMarkerIcon = (
  status: string,
  isHighlighted: boolean
): Icon => {
  const color = getMarkerColor(status);

  const iconSize = isHighlighted
    ? MARKER_CONFIG.highlightedIconSize
    : MARKER_CONFIG.iconSize;
  const iconAnchor = isHighlighted
    ? MARKER_CONFIG.highlightedIconAnchor
    : MARKER_CONFIG.iconAnchor;
  const popupAnchor = isHighlighted
    ? MARKER_CONFIG.highlightedPopupAnchor
    : MARKER_CONFIG.popupAnchor;

  return new Icon({
    iconUrl: `${MARKER_ICON_BASE_URL}/marker-icon-2x-${color}.png`,
    shadowUrl: MARKER_SHADOW_URL,
    iconSize,
    iconAnchor,
    popupAnchor,
    shadowSize: MARKER_CONFIG.shadowSize,
    className: isHighlighted ? "highlighted-marker" : "",
  });
};
