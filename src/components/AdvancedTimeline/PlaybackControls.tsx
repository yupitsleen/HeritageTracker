import { PlayIcon, PauseIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { Button } from "../Button";
import { useWayback, type WaybackSpeed } from "../../contexts/WaybackContext";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * PlaybackControls - Transport controls for Wayback animation
 * Reuses Button component and patterns from TimelineScrubber
 */
export function PlaybackControls() {
  const { isPlaying, speed, currentIndex, releases, play, pause, reset, setSpeed, next, previous } = useWayback();
  const { isDark } = useTheme();

  const speedOptions: WaybackSpeed[] = [0.25, 0.5, 1, 2, 4, 8];
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === releases.length - 1;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Play/Pause */}
      {!isPlaying ? (
        <Button
          onClick={play}
          variant="primary"
          size="sm"
          icon={<PlayIcon className="w-4 h-4" />}
          aria-label="Play animation through all releases"
        >
          Play
        </Button>
      ) : (
        <Button
          onClick={pause}
          variant="danger"
          size="sm"
          icon={<PauseIcon className="w-4 h-4" />}
          aria-label="Pause animation"
        >
          Pause
        </Button>
      )}

      {/* Reset */}
      <Button
        onClick={reset}
        disabled={isAtStart}
        variant="secondary"
        size="sm"
        icon={<ArrowPathIcon className="w-4 h-4" />}
        aria-label="Reset to first release"
      >
        Reset
      </Button>

      {/* Previous/Next */}
      <div className="flex items-center gap-2">
        <Button
          onClick={previous}
          disabled={isAtStart}
          variant="secondary"
          size="sm"
          aria-label="Previous release"
        >
          ⏮
        </Button>
        <Button
          onClick={next}
          disabled={isAtEnd}
          variant="secondary"
          size="sm"
          aria-label="Next release"
        >
          ⏭
        </Button>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-2">
        <label htmlFor="wayback-speed-control" className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>
          Speed:
        </label>
        <select
          id="wayback-speed-control"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value) as WaybackSpeed)}
          className={`px-2 py-1 rounded text-sm border-2 ${
            isDark
              ? "bg-gray-800 text-white border-white"
              : "bg-white text-black border-black"
          }`}
          aria-label="Animation playback speed"
        >
          {speedOptions.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
      </div>

      {/* Status indicator */}
      <div className={`text-xs ml-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {isPlaying && (
          <>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            Playing at {speed}x speed
          </>
        )}
      </div>
    </div>
  );
}
