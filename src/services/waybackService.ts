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
      if (!dateMatch) {
        console.warn(`Failed to parse date from title: "${item.itemTitle}". Using current date as fallback.`);
      }
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
    // Re-throw error to allow UI to handle it properly with error state
    throw new Error(
      "Unable to load Wayback satellite imagery. Please check your internet connection and try again."
    );
  }
}

/**
 * Finds the index of the Wayback release closest to a specific date
 * Returns the index in the releases array
 */
export function findClosestReleaseIndex(
  releases: WaybackRelease[],
  targetDate: string | Date
): number {
  const targetTime = new Date(targetDate).getTime();
  let closestIndex = 0;
  let minDiff = Math.abs(new Date(releases[0].releaseDate).getTime() - targetTime);

  for (let i = 1; i < releases.length; i++) {
    const releaseTime = new Date(releases[i].releaseDate).getTime();
    const diff = Math.abs(releaseTime - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}

/**
 * Gets the Wayback release closest to a specific date
 */
export function getClosestRelease(releases: WaybackRelease[], targetDate: Date): WaybackRelease {
  return releases[findClosestReleaseIndex(releases, targetDate)];
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
