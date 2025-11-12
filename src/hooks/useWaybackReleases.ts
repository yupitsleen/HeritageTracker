import { useState, useEffect } from "react";
import { fetchWaybackReleases, type WaybackRelease } from "../services/waybackService";
import { logger } from "../utils/logger";

/**
 * Simple hook to fetch Wayback releases
 * Returns loading state, error, and releases array
 * No complex state management - just data fetching
 */
export function useWaybackReleases() {
  const [releases, setReleases] = useState<WaybackRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReleases() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWaybackReleases();
        setReleases(data);
      } catch (err) {
        const userMessage =
          "Unable to load satellite imagery archive. Please check your connection and try again.";
        setError(userMessage);
        logger.error("Failed to load Wayback releases:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReleases();
  }, []);

  return { releases, isLoading, error };
}
