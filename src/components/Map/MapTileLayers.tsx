import { TileLayer, LayersControl } from "react-leaflet";
import { useTileConfig } from "../../hooks/useTileConfig";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * MapTileLayers - Configures map tile layers with street/dark/satellite toggle
 * - Street Map: OpenStreetMap (Arabic or English based on browser language)
 * - Dark Map: CartoDB Dark Matter (optimized for data visualization)
 * - Satellite View: Esri World Imagery
 * - Automatically selects appropriate map based on theme
 */
export function MapTileLayers() {
  const tileConfig = useTileConfig();
  const { isDark } = useTheme();

  return (
    <LayersControl position="topright">
      {/* Street Map (Default in light mode) */}
      <LayersControl.BaseLayer checked={!isDark} name="Street Map">
        <TileLayer
          attribution={tileConfig.attribution}
          url={tileConfig.url}
          subdomains={tileConfig.subdomains}
        />
      </LayersControl.BaseLayer>

      {/* Dark Map (Default in dark mode) - CartoDB Dark Matter */}
      <LayersControl.BaseLayer checked={isDark} name="Dark Map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={19}
        />
      </LayersControl.BaseLayer>

      {/* Satellite View */}
      <LayersControl.BaseLayer name="Satellite">
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  );
}
