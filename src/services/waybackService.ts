/**
 * Wayback Service
 * Fetches and manages ESRI Wayback satellite imagery metadata
 * API Documentation: https://github.com/vannizhang/wayback
 */

export interface WaybackItem {
  releaseNum: number;
  releaseDateLabel: string;
  releaseDatetime: number; // Unix timestamp in milliseconds
  itemTitle: string;
  itemURL: string;
  metadataLayerUrl: string;
  metadataXMLUrl: string;
}

export interface WaybackRelease {
  releaseNum: number;
  releaseDate: string; // ISO date string
  label: string;
  tileUrl: string;
  maxZoom: number;
}

// ESRI Wayback API endpoint
const WAYBACK_API_URL = "https://s3-us-west-2.amazonaws.com/config.jsapi.arcgis.com/wayback-config.json";

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

    const data = await response.json() as WaybackItem[];

    // Transform API data to our format
    const releases: WaybackRelease[] = data.map((item) => ({
      releaseNum: item.releaseNum,
      releaseDate: new Date(item.releaseDatetime).toISOString().split("T")[0],
      label: item.releaseDateLabel,
      tileUrl: `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/${item.releaseNum}/{z}/{y}/{x}`,
      maxZoom: 19, // ESRI World Imagery max zoom
    }));

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
        label: "Feb 2014",
        tileUrl: "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}",
        maxZoom: 17,
      },
      {
        releaseNum: 64776,
        releaseDate: "2023-08-31",
        label: "Aug 2023",
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
