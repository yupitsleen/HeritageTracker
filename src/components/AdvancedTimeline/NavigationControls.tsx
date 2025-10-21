import { ArrowPathIcon, PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { Button } from "../Button";
import { useWayback } from "../../contexts/WaybackContext";

/**
 * NavigationControls - Navigation for Wayback timeline
 *
 * Includes Play button that jumps through year markers (2014, 2015, etc.)
 * instead of rendering every map version. This provides:
 * - Better performance (12 jumps vs 150+ renders)
 * - Clearer temporal progression
 * - Time for tiles to load between jumps (1 second interval)
 */
export function NavigationControls() {
  const { currentIndex, releases, reset, next, previous, isPlaying, play, pause } = useWayback();

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === releases.length - 1;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Reset to first */}
      <Button
        onClick={reset}
        disabled={isAtStart || isPlaying}
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
        disabled={isAtStart || isPlaying}
        variant="secondary"
        size="sm"
        aria-label="Previous version"
        title="Go to previous version (or press Left Arrow)"
      >
        ⏮ Previous
      </Button>

      {/* Play/Pause */}
      {!isPlaying ? (
        <Button
          onClick={play}
          disabled={isAtEnd}
          variant="primary"
          size="sm"
          icon={<PlayIcon className="w-4 h-4" />}
          aria-label="Play through years"
          title="Auto-play through year markers (1 year every 2 seconds)"
        >
          Play
        </Button>
      ) : (
        <Button
          onClick={pause}
          variant="primary"
          size="sm"
          icon={<PauseIcon className="w-4 h-4" />}
          aria-label="Pause playback"
          title="Pause auto-play"
        >
          Pause
        </Button>
      )}

      {/* Next */}
      <Button
        onClick={next}
        disabled={isAtEnd || isPlaying}
        variant="secondary"
        size="sm"
        aria-label="Next version"
        title="Go to next version (or press Right Arrow)"
      >
        Next ⏭
      </Button>
    </div>
  );
}
