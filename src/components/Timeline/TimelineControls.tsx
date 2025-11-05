import { PlayIcon, PauseIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import type { AnimationSpeed } from "../../contexts/AnimationContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { Button } from "../Button";
import { getSpeedValues } from "../../config/animation";
import { TimelineSettingsMenu } from "./TimelineSettingsMenu";

interface TimelineControlsProps {
  isPlaying: boolean;
  isAtStart: boolean;
  speed: AnimationSpeed;
  zoomToSiteEnabled: boolean;
  mapMarkersVisible: boolean;
  advancedMode: boolean;
  hidePlayControls?: boolean;
  syncMapOnDotClick?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: AnimationSpeed) => void;
  onZoomToSiteToggle: () => void;
  onMapMarkersToggle: () => void;
  onSyncMapToggle?: () => void;
}

/**
 * Timeline playback and control buttons
 *
 * Features:
 * - Play/Pause/Reset controls (hidden when hidePlayControls is true)
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
  mapMarkersVisible,
  advancedMode,
  hidePlayControls = false,
  syncMapOnDotClick,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onZoomToSiteToggle,
  onMapMarkersToggle,
  onSyncMapToggle,
}: TimelineControlsProps) {
  const translate = useTranslation();
  const t = useThemeClasses();
  const speedOptions: AnimationSpeed[] = getSpeedValues();

  return (
    <div className="flex items-center gap-1.5">
      {/* Play/Pause buttons - hidden when hidePlayControls is true */}
      {!hidePlayControls && (
        <>
          {!isPlaying ? (
            <Button
              onClick={onPlay}
              variant="primary"
              size="xs"
              icon={<PlayIcon className="w-3 h-3" />}
              aria-label={translate("timeline.play")}
            >
              {/* Keep text until 1280px, then icon-only */}
              <span className="hidden xl:inline">{translate("timeline.play")}</span>
            </Button>
          ) : (
            <Button
              onClick={onPause}
              variant="danger"
              size="xs"
              icon={<PauseIcon className="w-3 h-3" />}
              aria-label={translate("timeline.pause")}
            >
              {/* Keep text until 1280px, then icon-only */}
              <span className="hidden xl:inline">{translate("timeline.pause")}</span>
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
        {/* Keep text until 1280px, then icon-only */}
        <span className="hidden xl:inline">{translate("common.reset")}</span>
      </Button>

      {/* Desktop: Individual toggle buttons (lg and up) */}
      <div className="hidden lg:flex lg:items-center lg:gap-1.5">
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

        {/* Show Map Markers toggle */}
        <Button
          onClick={onMapMarkersToggle}
          variant="secondary"
          active={mapMarkersVisible}
          size="xs"
          aria-label={translate("timeline.showMapMarkers")}
          title={translate("timeline.showMapMarkers")}
        >
          {mapMarkersVisible ? "✓" : ""} {translate("timeline.showMapMarkers")}
        </Button>
      </div>

      {/* Mobile/Tablet: Settings dropdown menu (below lg) */}
      <div className="lg:hidden">
        <TimelineSettingsMenu
          zoomToSiteEnabled={zoomToSiteEnabled}
          mapMarkersVisible={mapMarkersVisible}
          syncMapOnDotClick={syncMapOnDotClick}
          onZoomToSiteToggle={onZoomToSiteToggle}
          onMapMarkersToggle={onMapMarkersToggle}
          onSyncMapToggle={onSyncMapToggle}
        />
      </div>

      {/* Speed control - hidden when hidePlayControls is true */}
      {!hidePlayControls && (
        <div className="flex items-center gap-1.5">
          {/* Hide "Speed:" label below 1280px */}
          <label htmlFor="speed-control" className={`hidden xl:inline text-xs font-medium ${t.text.body}`}>
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
