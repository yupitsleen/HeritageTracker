import { TileLayer, LayersControl } from "react-leaflet";
import { useTileConfig } from "../../hooks/useTileConfig";

/**
 * MapTileLayers - Configures map tile layers with street/satellite toggle
 * - Street Map: OpenStreetMap (Arabic or English based on browser language)
 * - Satellite View: Esri World Imagery
 * - LayersControl for user switching
 */
export function MapTileLayers() {
  const tileConfig = useTileConfig();

  return (
    <LayersControl position="topright">
      {/* Street Map (Default) */}
      <LayersControl.BaseLayer checked name="Street Map">
        <TileLayer
          attribution={tileConfig.attribution}
          url={tileConfig.url}
          subdomains={tileConfig.subdomains}
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
