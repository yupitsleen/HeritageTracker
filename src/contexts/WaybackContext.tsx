import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { fetchWaybackReleases, type WaybackRelease } from "../services/waybackService";

/**
 * Wayback imagery animation state management
 * Coordinates playback across WaybackSlider and WaybackMap components
 * Pattern copied from AnimationContext.tsx
 */

export type WaybackSpeed = 0.25 | 0.5 | 1 | 2 | 4 | 8;

interface WaybackContextValue {
  // All available Wayback releases (150+)
  releases: WaybackRelease[];
  // Currently selected release index
  currentIndex: number;
  // Currently selected release
  currentRelease: WaybackRelease | null;
  // Is the timeline currently playing?
  isPlaying: boolean;
  // Animation speed multiplier
  speed: WaybackSpeed;
  // Loading state
  isLoading: boolean;
  // Error state
  error: string | null;

  // Actions
  play: () => void;
  pause: () => void;
  reset: () => void;
  setIndex: (index: number) => void;
  setSpeed: (speed: WaybackSpeed) => void;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<WaybackSpeed>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref to store animation frame ID for cleanup
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

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

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
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

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying || releases.length === 0) {
      // Cancel any ongoing animation when paused
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      // Calculate time elapsed since last frame
      // Base frame rate: ~500ms per version at 1x speed
      const baseFrameTime = 500; // ms
      const frameTime = baseFrameTime / speed;

      if (timestamp - lastFrameTimeRef.current < frameTime) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameTimeRef.current = timestamp;

      setCurrentIndex((prevIndex) => {
        // Advance to next release
        const nextIndex = prevIndex + 1;

        // If we've reached the end, pause
        if (nextIndex >= releases.length) {
          setIsPlaying(false);
          return releases.length - 1;
        }

        return nextIndex;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount or when playing state changes
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, speed, releases.length]);

  const value: WaybackContextValue = {
    releases,
    currentIndex,
    currentRelease,
    isPlaying,
    speed,
    isLoading,
    error,
    play,
    pause,
    reset,
    setIndex,
    setSpeed,
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
