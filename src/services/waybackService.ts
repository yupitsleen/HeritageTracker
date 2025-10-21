/**
 * Wayback Service
 * Fetches and manages ESRI Wayback satellite imagery metadata
 * API Documentation: https://github.com/vannizhang/wayback
 */

export interface WaybackItem {
  itemID: string;
  itemTitle: string;
  itemURL: string;
  metadataLayerUrl: string;
  metadataLayerItemID: string;
  layerIdentifier: string;
}

export interface WaybackRelease {
  releaseNum: number;
  releaseDate: string; // ISO date string
  label: string;
  tileUrl: string;
  maxZoom: number;
}

// ESRI Wayback API endpoint
const WAYBACK_API_URL = "https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json";

/**
 * Fetches all available Wayback imagery releases from ESRI
 * Returns sorted array from oldest to newest
 */
export async function fetchWaybackReleases(): Promise<WaybackRelease[]> {
  try {
    const response = await fetch(WAYBACK_API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch Wayback releases: ${response.statusText}`);
    }

    // API returns object keyed by releaseNum, not an array
    const data = await response.json() as Record<string, WaybackItem>;

    // Transform API data to our format
    const releases: WaybackRelease[] = Object.entries(data).map(([releaseNum, item]) => {
      // Extract date from title (format: "World Imagery (Wayback 2025-09-25)")
      const dateMatch = item.itemTitle.match(/(\d{4}-\d{2}-\d{2})/);
      const releaseDate = dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0];

      // Convert {level}/{row}/{col} to {z}/{y}/{x} for Leaflet
      const tileUrl = item.itemURL.replace('{level}', '{z}').replace('{row}', '{y}').replace('{col}', '{x}');

      return {
        releaseNum: Number(releaseNum),
        releaseDate,
        label: dateMatch ? dateMatch[1] : releaseNum,
        tileUrl,
        maxZoom: 19, // ESRI World Imagery max zoom
      };
    });

    // Sort by date (oldest first)
    releases.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

    return releases;
  } catch (error) {
    console.error("Error fetching Wayback releases:", error);
    // Return fallback data with our current 3 periods
    return [
      {
        releaseNum: 10,
        releaseDate: "2014-02-20",
        label: "2014-02-20",
        tileUrl: "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}",
        maxZoom: 17,
      },
      {
        releaseNum: 64776,
        releaseDate: "2023-08-31",
        label: "2023-08-31",
        tileUrl: "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/64776/{z}/{y}/{x}",
        maxZoom: 18,
      },
      {
        releaseNum: 99999,
        releaseDate: new Date().toISOString().split("T")[0],
        label: "Current",
        tileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        maxZoom: 19,
      },
    ];
  }
}

/**
 * Gets the Wayback release closest to a specific date
 */
export function getClosestRelease(releases: WaybackRelease[], targetDate: Date): WaybackRelease {
  const targetTime = targetDate.getTime();

  let closest = releases[0];
  let minDiff = Math.abs(new Date(releases[0].releaseDate).getTime() - targetTime);

  for (const release of releases) {
    const releaseTime = new Date(release.releaseDate).getTime();
    const diff = Math.abs(releaseTime - targetTime);

    if (diff < minDiff) {
      minDiff = diff;
      closest = release;
    }
  }

  return closest;
}

/**
 * Filters releases to only those within a date range
 */
export function filterReleasesByDateRange(
  releases: WaybackRelease[],
  startDate: Date,
  endDate: Date
): WaybackRelease[] {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  return releases.filter((release) => {
    const releaseTime = new Date(release.releaseDate).getTime();
    return releaseTime >= startTime && releaseTime <= endTime;
  });
}
