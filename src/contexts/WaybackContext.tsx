import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { fetchWaybackReleases, type WaybackRelease } from "../services/waybackService";
import { WAYBACK_TIMELINE } from "../constants/wayback";
import { useYearMarkers } from "../hooks/useYearMarkers";

/**
 * Wayback imagery state management
 * Manages manual navigation through historical satellite imagery versions
 * Auto-play removed due to tile loading performance issues
 */

interface WaybackContextValue {
  // All available Wayback releases (dynamically loaded from ESRI API)
  releases: WaybackRelease[];
  // Currently selected release index
  currentIndex: number;
  // Currently selected release
  currentRelease: WaybackRelease | null;
  // Loading state
  isLoading: boolean;
  // Error state
  error: string | null;
  // Playback state
  isPlaying: boolean;

  // Actions
  reset: () => void;
  setIndex: (index: number) => void;
  next: () => void;
  previous: () => void;
  play: () => void;
  pause: () => void;
}

const WaybackContext = createContext<WaybackContextValue | undefined>(undefined);

interface WaybackProviderProps {
  children: ReactNode;
}

export function WaybackProvider({ children }: WaybackProviderProps) {
  const [releases, setReleases] = useState<WaybackRelease[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate year markers from releases
  const yearMarkers = useYearMarkers(releases);

  // Fetch Wayback releases on mount
  useEffect(() => {
    async function loadReleases() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWaybackReleases();
        setReleases(data);
        setCurrentIndex(0); // Start at first release (oldest)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Wayback releases");
        console.error("Error loading Wayback releases:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadReleases();
  }, []);

  const currentRelease = releases.length > 0 ? releases[currentIndex] : null;

  const reset = useCallback(() => {
    setCurrentIndex(0); // Reset to first release
  }, []);

  const setIndex = useCallback((index: number) => {
    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(releases.length - 1, index));
    setCurrentIndex(clampedIndex);
  }, [releases.length]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(releases.length - 1, prev + 1));
  }, [releases.length]);

  const previous = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Auto-advance through year markers when playing
  useEffect(() => {
    if (!isPlaying || yearMarkers.length === 0) return;

    // Get year marker indices from the hook
    const yearMarkerIndices = yearMarkers.map(m => m.releaseIndex);

    // Find current position in year markers
    const currentYearMarkerIndex = yearMarkerIndices.findIndex(idx => idx >= currentIndex);
    const nextYearMarkerIndex = currentYearMarkerIndex + 1;

    // Stop if we're at the end
    if (nextYearMarkerIndex >= yearMarkerIndices.length) {
      setIsPlaying(false);
      return;
    }

    // Advance to next year marker after configured interval
    const timer = setTimeout(() => {
      setCurrentIndex(yearMarkerIndices[nextYearMarkerIndex]);
    }, WAYBACK_TIMELINE.YEAR_ADVANCE_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, yearMarkers]);

  const value: WaybackContextValue = {
    releases,
    currentIndex,
    currentRelease,
    isLoading,
    error,
    isPlaying,
    reset,
    setIndex,
    next,
    previous,
    play,
    pause,
  };

  return (
    <WaybackContext.Provider value={value}>
      {children}
    </WaybackContext.Provider>
  );
}

/**
 * Hook to access Wayback context
 * Throws error if used outside WaybackProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useWayback(): WaybackContextValue {
  const context = useContext(WaybackContext);
  if (context === undefined) {
    throw new Error("useWayback must be used within WaybackProvider");
  }
  return context;
}
