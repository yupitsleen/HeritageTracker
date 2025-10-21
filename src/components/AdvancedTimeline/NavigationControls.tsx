import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Button } from "../Button";
import { useWayback } from "../../contexts/WaybackContext";

/**
 * NavigationControls - Manual navigation for Wayback timeline
 *
 * Auto-play removed due to tile loading performance issues:
 * - High-resolution satellite tiles load too slowly for smooth playback
 * - White flashes between tile loads create jarring experience
 * - Tiles don't load at all when zoomed in during auto-play
 *
 * Solution: Manual navigation allows users to explore at their own pace,
 * waiting for tiles to fully load before advancing. This matches the UX
 * pattern of Google Earth's historical imagery slider.
 */
export function NavigationControls() {
  const { currentIndex, releases, reset, next, previous } = useWayback();

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === releases.length - 1;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Reset to first */}
      <Button
        onClick={reset}
        disabled={isAtStart}
        variant="secondary"
        size="sm"
        icon={<ArrowPathIcon className="w-4 h-4" />}
        aria-label="Reset to first version"
        title="Go back to the first version (2014)"
      >
        Reset
      </Button>

      {/* Previous */}
      <Button
        onClick={previous}
        disabled={isAtStart}
        variant="secondary"
        size="sm"
        aria-label="Previous version"
        title="Go to previous version (or press Left Arrow)"
      >
        ⏮ Previous
      </Button>

      {/* Next */}
      <Button
        onClick={next}
        disabled={isAtEnd}
        variant="primary"
        size="sm"
        aria-label="Next version"
        title="Go to next version (or press Right Arrow)"
      >
        Next ⏭
      </Button>
    </div>
  );
}
