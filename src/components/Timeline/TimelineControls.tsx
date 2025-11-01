import { PlayIcon, PauseIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import type { AnimationSpeed } from "../../contexts/AnimationContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { Button } from "../Button";
import { getSpeedValues } from "../../config/animation";

interface TimelineControlsProps {
  isPlaying: boolean;
  isAtStart: boolean;
  speed: AnimationSpeed;
  zoomToSiteEnabled: boolean;
  advancedMode: boolean;
  syncMapOnDotClick?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: AnimationSpeed) => void;
  onZoomToSiteToggle: () => void;
  onSyncMapToggle?: () => void;
}

/**
 * Timeline playback and control buttons
 *
 * Features:
 * - Play/Pause/Reset controls (hidden in advanced mode)
 * - Speed control dropdown
 * - Zoom to Site toggle
 * - Sync Map toggle (advanced mode only)
 *
 * Responsibilities:
 * - Render control UI
 * - Forward user interactions to parent
 */
export function TimelineControls({
  isPlaying,
  isAtStart,
  speed,
  zoomToSiteEnabled,
  advancedMode,
  syncMapOnDotClick,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onZoomToSiteToggle,
  onSyncMapToggle,
}: TimelineControlsProps) {
  const translate = useTranslation();
  const t = useThemeClasses();
  const speedOptions: AnimationSpeed[] = getSpeedValues();

  return (
    <div className="flex items-center gap-1.5">
      {/* Play/Pause buttons - hidden in advanced mode */}
      {!advancedMode && (
        <>
          {!isPlaying ? (
            <Button
              onClick={onPlay}
              variant="primary"
              size="xs"
              icon={<PlayIcon className="w-3 h-3" />}
              aria-label={translate("timeline.play")}
            >
              {translate("timeline.play")}
            </Button>
          ) : (
            <Button
              onClick={onPause}
              variant="danger"
              size="xs"
              icon={<PauseIcon className="w-3 h-3" />}
              aria-label={translate("timeline.pause")}
            >
              {translate("timeline.pause")}
            </Button>
          )}
        </>
      )}

      {/* Reset button */}
      <Button
        onClick={onReset}
        disabled={isAtStart}
        variant="secondary"
        size="xs"
        icon={<ArrowPathIcon className="w-3 h-3" />}
        aria-label={translate("common.reset")}
      >
        {translate("common.reset")}
      </Button>

      {/* Sync Map toggle - only show in advanced mode */}
      {advancedMode && onSyncMapToggle && (
        <Button
          onClick={onSyncMapToggle}
          variant="secondary"
          active={syncMapOnDotClick}
          size="xs"
          aria-label={translate("timeline.syncMap")}
          title={translate("timeline.syncMap")}
        >
          {syncMapOnDotClick ? "✓" : ""} {translate("timeline.syncMap")}
        </Button>
      )}

      {/* Zoom to Site toggle */}
      <Button
        onClick={onZoomToSiteToggle}
        variant="secondary"
        active={zoomToSiteEnabled}
        size="xs"
        aria-label={translate("timeline.zoomToSite")}
        title={translate("timeline.zoomToSite")}
      >
        {zoomToSiteEnabled ? "✓" : ""} {translate("timeline.zoomToSite")}
      </Button>

      {/* Speed control - hidden in advanced mode */}
      {!advancedMode && (
        <div className="flex items-center gap-1.5">
          <label htmlFor="speed-control" className={`text-xs font-medium ${t.text.body}`}>
            {translate("timeline.speed")}:
          </label>
          <select
            id="speed-control"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value) as AnimationSpeed)}
            className={`${t.timeline.speedSelect} ${t.input.base}`}
            aria-label="Animation speed control"
          >
            {speedOptions.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
