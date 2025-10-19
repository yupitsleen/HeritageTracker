import type { ReactNode } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useThemeClasses } from "../hooks/useThemeClasses";

interface LazySectionProps {
  children: ReactNode;
  fallbackHeight?: string;
}

/**
 * Lazy-loads section content when it comes into view
 * Reduces initial render cost for long scrollable pages
 */
export function LazySection({ children, fallbackHeight = "h-64" }: LazySectionProps) {
  const { ref, hasIntersected } = useIntersectionObserver({
    rootMargin: "100px", // Start loading 100px before entering viewport
    triggerOnce: true,
  });
  const t = useThemeClasses();

  return (
    <div ref={ref}>
      {hasIntersected ? (
        children
      ) : (
        <div className={`animate-pulse ${fallbackHeight} ${t.bg.tertiary} rounded-lg mb-6`} />
      )}
    </div>
  );
}
