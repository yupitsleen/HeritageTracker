import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from "react";
import type { GazaSite } from "../types";

/**
 * Timeline animation state management
 * Coordinates playback across TimelineScrubber, Map, and Table components
 */

export type AnimationSpeed = 0.5 | 1 | 2 | 4;

interface AnimationContextValue {
  // Current timestamp in the timeline
  currentTimestamp: Date;
  // Is the timeline currently playing?
  isPlaying: boolean;
  // Animation speed multiplier
  speed: AnimationSpeed;
  // Timeline date range (calculated from site data)
  startDate: Date;
  endDate: Date;
  // Map sync toggle - user's preference for syncing satellite imagery with timeline
  syncMapEnabled: boolean;
  // Map sync active state - whether sync is currently active (can be temporarily disabled by manual override)
  syncActive: boolean;

  // Actions
  play: () => void;
  pause: () => void;
  reset: () => void;
  setTimestamp: (timestamp: Date) => void;
  setSpeed: (speed: AnimationSpeed) => void;
  setSyncMapEnabled: (enabled: boolean) => void;
  setSyncActive: (active: boolean) => void;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);

// Default timeline constants (fallback if no sites provided)
const DEFAULT_TIMELINE_START = new Date("2023-10-07"); // Oct 7, 2023
const DEFAULT_TIMELINE_END = new Date(); // Current date

interface AnimationProviderProps {
  children: ReactNode;
  sites?: GazaSite[];
}

export function AnimationProvider({ children, sites = [] }: AnimationProviderProps) {
  // Calculate timeline start and end dates from site data
  const { startDate, endDate } = useMemo(() => {
    if (sites.length === 0) {
      return { startDate: DEFAULT_TIMELINE_START, endDate: DEFAULT_TIMELINE_END };
    }

    // Get all destruction dates
    const destructionDates = sites
      .filter((site) => site.dateDestroyed)
      .map((site) => new Date(site.dateDestroyed!).getTime());

    if (destructionDates.length === 0) {
      return { startDate: DEFAULT_TIMELINE_START, endDate: DEFAULT_TIMELINE_END };
    }

    // Find earliest and latest destruction dates
    const earliestDate = new Date(Math.min(...destructionDates));
    const latestDate = new Date(Math.max(...destructionDates));

    return { startDate: earliestDate, endDate: latestDate };
  }, [sites]);

  const [currentTimestamp, setCurrentTimestamp] = useState<Date>(startDate);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<AnimationSpeed>(1);
  const [syncMapEnabled, setSyncMapEnabled] = useState(false); // Default: OFF
  const [syncActive, setSyncActive] = useState(false); // Tracks if sync is currently active

  // Ref to store animation frame ID for cleanup
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const pauseTimeoutRef = useRef<number | null>(null);

  // Utility to clear pause timeout (DRY principle - used in multiple places)
  const clearPauseTimeout = useCallback(() => {
    if (pauseTimeoutRef.current !== null) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    // Activate sync if user has enabled it
    if (syncMapEnabled && !syncActive) {
      setSyncActive(true);
    }

    // If sync is enabled and we're at the start, show 2014 baseline for 1 second
    if (syncMapEnabled && currentTimestamp.getTime() === startDate.getTime()) {
      // Temporarily set timestamp to 2014 baseline (just for map sync visual)
      const baseline2014Date = new Date("2014-02-20");
      setCurrentTimestamp(baseline2014Date);

      // Wait 1 second, then reset to actual startDate and start playing
      pauseTimeoutRef.current = window.setTimeout(() => {
        setCurrentTimestamp(startDate); // Reset to actual timeline start
        setIsPlaying(true);
        clearPauseTimeout();
      }, 1000);
    } else {
      setIsPlaying(true);
    }
  }, [syncMapEnabled, syncActive, currentTimestamp, startDate, clearPauseTimeout]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearPauseTimeout();
  }, [clearPauseTimeout]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentTimestamp(startDate);
    // Restore sync state to user's preference when resetting
    setSyncActive(syncMapEnabled);
  }, [startDate, syncMapEnabled]);

  const setTimestamp = useCallback((timestamp: Date) => {
    // Clamp timestamp to valid range
    const clampedTimestamp = new Date(
      Math.max(
        startDate.getTime(),
        Math.min(endDate.getTime(), timestamp.getTime())
      )
    );
    setCurrentTimestamp(clampedTimestamp);
  }, [startDate, endDate]);

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) {
      // Cancel any ongoing animation when paused
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      // Calculate time elapsed since last frame (throttle to ~60fps)
      if (timestamp - lastFrameTimeRef.current < 16.67) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameTimeRef.current = timestamp;

      setCurrentTimestamp((prevTimestamp) => {
        // Advance by 1 day per frame, scaled by speed multiplier
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const advancement = millisecondsPerDay * speed;
        const nextTimestamp = new Date(prevTimestamp.getTime() + advancement);

        // If we've reached the end, pause
        if (nextTimestamp >= endDate) {
          setIsPlaying(false);
          return endDate;
        }

        return nextTimestamp;
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
      clearPauseTimeout();
    };
  }, [isPlaying, speed, endDate, clearPauseTimeout]);

  // Reset current timestamp if start date changes
  useEffect(() => {
    setCurrentTimestamp(startDate);
  }, [startDate]);

  // Sync syncActive with syncMapEnabled when user toggles
  // BUT don't activate immediately - only activate when playing or resetting
  useEffect(() => {
    if (!syncMapEnabled) {
      // If user disables sync, immediately deactivate
      setSyncActive(false);
    }
    // If enabling sync, don't activate until play() is called
  }, [syncMapEnabled]);

  const value: AnimationContextValue = {
    currentTimestamp,
    isPlaying,
    speed,
    startDate,
    endDate,
    syncMapEnabled,
    syncActive,
    play,
    pause,
    reset,
    setTimestamp,
    setSpeed,
    setSyncMapEnabled,
    setSyncActive,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

/**
 * Hook to access animation context
 * Throws error if used outside AnimationProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAnimation(): AnimationContextValue {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within AnimationProvider");
  }
  return context;
}
