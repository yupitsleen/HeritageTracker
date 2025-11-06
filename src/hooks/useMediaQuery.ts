import { useState, useEffect } from "react";

/**
 * Hook to match CSS media queries in React
 * Leverages browser's native matchMedia API for better performance
 *
 * @param query - CSS media query string (e.g., "(max-width: 1023px)")
 * @returns boolean indicating if the media query matches
 *
 * @example
 * ```typescript
 * // Check if screen is mobile size
 * const isMobile = useMediaQuery('(max-width: 767px)');
 *
 * // Check if screen is tablet or larger
 * const isTablet = useMediaQuery('(min-width: 768px)');
 *
 * // Check for dark mode preference
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // Initialize state with current match value
  const [matches, setMatches] = useState(() => {
    // Server-side rendering compatibility
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Update state when media query match changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value (in case it changed between render and effect)
    setMatches(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener("change", handler);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
