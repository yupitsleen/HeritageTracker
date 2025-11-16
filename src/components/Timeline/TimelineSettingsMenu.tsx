import { useState, useEffect } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  FloatingPortal,
} from "@floating-ui/react";
import { Button } from "../Button";
import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { Z_INDEX } from "../../constants/layout";
import type { AnimationSpeed } from "../../contexts/AnimationContext";
import { getSpeedValues } from "../../config/animation";
import { TimelineToggleButton } from "./TimelineToggleButton";

interface TimelineSettingsMenuProps {
  /** Toggle button states */
  toggles: {
    zoomToSite?: boolean;
    mapMarkers?: boolean;
    syncMap?: boolean;
    showUnknownDates?: boolean;
  };
  /** Toggle button handlers */
  onToggle: {
    zoomToSite?: () => void;
    mapMarkers?: () => void;
    syncMap?: () => void;
    showUnknownDates?: () => void;
  };
  /** Optional speed control configuration */
  speedControl?: {
    speed: AnimationSpeed;
    onChange: (speed: AnimationSpeed) => void;
  };
}

/**
 * Dropdown menu for timeline settings (responsive design)
 *
 * Uses Floating UI for intelligent positioning that prevents overflow
 * Automatically repositions on scroll/resize and flips when needed
 */
export function TimelineSettingsMenu({
  toggles,
  onToggle,
  speedControl,
}: TimelineSettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const translate = useTranslation();
  const t = useThemeClasses();
  const speedOptions: AnimationSpeed[] = getSpeedValues();

  // Floating UI positioning - handles all edge cases automatically
  const { x, y, strategy, refs } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end", // Prefer opening below button, aligned to right
    middleware: [
      offset(4), // 4px gap from button
      flip({
        fallbackPlacements: ["top-end", "bottom-start", "top-start"], // Try these if no space
      }),
      shift({ padding: 8 }), // Stay 8px away from viewport edges
    ],
    whileElementsMounted: autoUpdate, // Auto-reposition on scroll/resize
  });

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const floating = refs.floating.current;
      const reference = refs.reference.current;

      if (
        floating &&
        !floating.contains(target) &&
        reference &&
        reference instanceof HTMLElement &&
        !reference.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, refs]);

  return (
    <>
      {/* Settings button */}
      <div ref={refs.setReference}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="secondary"
          size="xs"
          icon={<Cog6ToothIcon className="w-3 h-3" />}
          aria-label="Timeline settings"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          title="Timeline settings"
        >
          {/* Icon only on mobile, text on larger screens */}
          <span className="hidden lg:inline">Settings</span>
        </Button>
      </div>

      {/* Dropdown menu - rendered via Portal to avoid clipping */}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className={`min-w-[200px] max-w-[90vw] rounded shadow-lg border ${t.border.primary} ${t.bg.primary}`}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: Z_INDEX.DROPDOWN,
            }}
            role="menu"
          >
            <div className="py-1">
            {/* Speed control - only show if provided */}
            {speedControl && (
              <>
                <div className="px-4 py-2 flex items-center justify-between">
                  <label htmlFor="speed-control-menu" className={`text-sm ${t.text.body}`}>
                    {translate("timeline.speed")}:
                  </label>
                  <select
                    id="speed-control-menu"
                    value={speedControl.speed}
                    onChange={(e) => {
                      speedControl.onChange(Number(e.target.value) as AnimationSpeed);
                    }}
                    className={`ml-2 ${t.timeline.speedSelect} ${t.input.base}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {speedOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}x
                      </option>
                    ))}
                  </select>
                </div>
                {/* Divider after speed control */}
                <div className={`border-t my-1 ${t.border.primary}`}></div>
              </>
            )}

            {/* Sync Map option (if available) */}
            {onToggle.syncMap && (
              <TimelineToggleButton
                label="timeline.syncMap"
                isActive={toggles.syncMap ?? false}
                onClick={onToggle.syncMap}
                variant="menu-item"
                onMenuClose={() => setIsOpen(false)}
              />
            )}

            {/* Show Unknown Dates option (if available) */}
            {onToggle.showUnknownDates && (
              <TimelineToggleButton
                label="timeline.showUnknownDates"
                isActive={toggles.showUnknownDates ?? false}
                onClick={onToggle.showUnknownDates}
                variant="menu-item"
                onMenuClose={() => setIsOpen(false)}
              />
            )}

            {/* Zoom to Site option - only show if handler provided */}
            {onToggle.zoomToSite && (
              <TimelineToggleButton
                label="timeline.zoomToSite"
                isActive={toggles.zoomToSite ?? false}
                onClick={onToggle.zoomToSite}
                variant="menu-item"
                onMenuClose={() => setIsOpen(false)}
              />
            )}

            {/* Show Map Markers option - only show if handler provided */}
            {onToggle.mapMarkers && (
              <TimelineToggleButton
                label="timeline.showMapMarkers"
                isActive={toggles.mapMarkers ?? false}
                onClick={onToggle.mapMarkers}
                variant="menu-item"
                onMenuClose={() => setIsOpen(false)}
              />
            )}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
