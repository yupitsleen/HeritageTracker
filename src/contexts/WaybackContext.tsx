import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { fetchWaybackReleases, type WaybackRelease } from "../services/waybackService";

/**
 * Wayback imagery state management
 * Manages manual navigation through 150+ satellite imagery versions
 * Auto-play removed due to tile loading performance issues
 */

interface WaybackContextValue {
  // All available Wayback releases (150+)
  releases: WaybackRelease[];
  // Currently selected release index
  currentIndex: number;
  // Currently selected release
  currentRelease: WaybackRelease | null;
  // Loading state
  isLoading: boolean;
  // Error state
  error: string | null;

  // Actions
  reset: () => void;
  setIndex: (index: number) => void;
  next: () => void;
  previous: () => void;
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

  const value: WaybackContextValue = {
    releases,
    currentIndex,
    currentRelease,
    isLoading,
    error,
    reset,
    setIndex,
    next,
    previous,
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
