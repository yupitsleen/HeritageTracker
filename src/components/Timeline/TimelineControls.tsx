import { PlayIcon, PauseIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import type { AnimationSpeed } from "../../contexts/AnimationContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { Button } from "../Button";
import { getSpeedValues } from "../../config/animation";
import { TimelineSettingsMenu } from "./TimelineSettingsMenu";
import { TimelineToggleButton } from "./TimelineToggleButton";
import { TOOLTIPS } from "../../config/tooltips";

interface TimelineControlsProps {
  isPlaying: boolean;
  isAtStart: boolean;
  speed: AnimationSpeed;
  zoomToSiteEnabled: boolean;
  mapMarkersVisible: boolean;
  advancedMode: boolean;
  hidePlayControls?: boolean;
  hideMapSettings?: boolean; // Hide Zoom to Site and Show Map Markers (moved to map)
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
  hideMapSettings = false,
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

  // Render speed control dropdown
  const renderSpeedControl = () => {
    if (hidePlayControls) return null;

    return (
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
    );
  };

  // Render desktop toggle buttons
  const renderDesktopToggles = () => (
    <>
      {/* Sync Map toggle - only show in advanced mode */}
      {advancedMode && onSyncMapToggle && (
        <TimelineToggleButton
          label="timeline.syncMap"
          isActive={syncMapOnDotClick ?? false}
          onClick={onSyncMapToggle}
          variant="button"
        />
      )}

      {/* Zoom to Site toggle - hide when hideMapSettings is true (moved to map) */}
      {!hideMapSettings && (
        <TimelineToggleButton
          label="timeline.zoomToSite"
          isActive={zoomToSiteEnabled}
          onClick={onZoomToSiteToggle}
          variant="button"
        />
      )}

      {/* Show Map Markers toggle - hide when hideMapSettings is true (moved to map) */}
      {!hideMapSettings && (
        <TimelineToggleButton
          label="timeline.showMapMarkers"
          isActive={mapMarkersVisible}
          onClick={onMapMarkersToggle}
          variant="button"
        />
      )}

      {/* Speed control */}
      {renderSpeedControl()}
    </>
  );

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
              title={translate("timeline.playTooltip")}
            >
              {/* Icon only below xl, full text at xl+ */}
              <span className="hidden xl:inline">{translate("timeline.play")}</span>
            </Button>
          ) : (
            <Button
              onClick={onPause}
              variant="danger"
              size="xs"
              icon={<PauseIcon className="w-3 h-3" />}
              aria-label={translate("timeline.pause")}
              title={TOOLTIPS.TIMELINE.PAUSE}
            >
              {/* Icon only below xl, full text at xl+ */}
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
        title={TOOLTIPS.TIMELINE.RESET}
      >
        {/* Icon only below xl, full text at xl+ */}
        <span className="hidden xl:inline">{translate("common.reset")}</span>
      </Button>

      {/* Settings menu - only show on Timeline page (not Dashboard where map settings are hidden) */}
      {!hideMapSettings && (
        <div className="2xl:hidden">
          <TimelineSettingsMenu
            toggles={{
              zoomToSite: zoomToSiteEnabled,
              mapMarkers: mapMarkersVisible,
              syncMap: syncMapOnDotClick,
            }}
            onToggle={{
              zoomToSite: onZoomToSiteToggle,
              mapMarkers: onMapMarkersToggle,
              syncMap: onSyncMapToggle,
            }}
            speedControl={!hidePlayControls ? {
              speed,
              onChange: onSpeedChange,
            } : undefined}
          />
        </div>
      )}

      {/* Speed control - always visible when map settings are hidden (Dashboard) */}
      {hideMapSettings && renderSpeedControl()}

      {/* 2xl and up: Full controls visible */}
      <div className="hidden 2xl:flex 2xl:items-center 2xl:gap-1.5">
        {renderDesktopToggles()}
      </div>
    </div>
  );
}
