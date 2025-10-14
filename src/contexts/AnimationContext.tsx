import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";

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
  // Timeline date range (Oct 7, 2023 → Present)
  startDate: Date;
  endDate: Date;

  // Actions
  play: () => void;
  pause: () => void;
  reset: () => void;
  setTimestamp: (timestamp: Date) => void;
  setSpeed: (speed: AnimationSpeed) => void;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);

// Timeline constants
const TIMELINE_START = new Date("2023-10-07"); // Oct 7, 2023
const TIMELINE_END = new Date(); // Current date

interface AnimationProviderProps {
  children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [currentTimestamp, setCurrentTimestamp] = useState<Date>(TIMELINE_START);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<AnimationSpeed>(1);

  // Ref to store animation frame ID for cleanup
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentTimestamp(TIMELINE_START);
  }, []);

  const setTimestamp = useCallback((timestamp: Date) => {
    // Clamp timestamp to valid range
    const clampedTimestamp = new Date(
      Math.max(
        TIMELINE_START.getTime(),
        Math.min(TIMELINE_END.getTime(), timestamp.getTime())
      )
    );
    setCurrentTimestamp(clampedTimestamp);
  }, []);

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
        if (nextTimestamp >= TIMELINE_END) {
          setIsPlaying(false);
          return TIMELINE_END;
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
    };
  }, [isPlaying, speed]);

  const value: AnimationContextValue = {
    currentTimestamp,
    isPlaying,
    speed,
    startDate: TIMELINE_START,
    endDate: TIMELINE_END,
    play,
    pause,
    reset,
    setTimestamp,
    setSpeed,
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
