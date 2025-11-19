import { useMemo } from "react";
import { HISTORICAL_IMAGERY, type TimePeriod } from "../../constants/map";
import { useAnimation } from "../../contexts/AnimationContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { Z_INDEX } from "../../constants/layout";

interface TimeToggleProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

/**
 * Format date string to full format for tooltips (e.g., "Feb 20, 2014" or "Aug 31, 2023")
 * Uses UTC to avoid timezone offset issues
 */
function formatFullDate(dateStr: string): string {
  if (dateStr === "current") {
    // For "current", use today's date
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });
  }
  const date = new Date(dateStr + "T00:00:00Z"); // Parse as UTC
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}

/**
 * Extract year from date string (e.g., "2014" or "2025")
 */
function formatYear(dateStr: string): string {
  if (dateStr === "current") {
    // For "current", use current year
    return new Date().getUTCFullYear().toString();
  }
  const date = new Date(dateStr + "T00:00:00Z"); // Parse as UTC
  return date.getUTCFullYear().toString();
}

/**
 * Toggle control for switching between historical satellite imagery time periods
 * Shows year for each period (dynamically read from HISTORICAL_IMAGERY)
 * Tooltips display full dates on hover
 * Manual period selection disables timeline sync temporarily (until timeline reset)
 */
export function TimeToggle({ selectedPeriod, onPeriodChange }: TimeToggleProps) {
  const { setSyncActive } = useAnimation();
  const translate = useTranslation();
  const t = useThemeClasses();

  // Dynamically generate period buttons from HISTORICAL_IMAGERY constants
  const periods = useMemo(() => {
    return (Object.keys(HISTORICAL_IMAGERY) as TimePeriod[]).map((key) => {
      const period = HISTORICAL_IMAGERY[key];
      return {
        value: key,
        label: period.label,
        shortLabel: formatYear(period.date), // Just the year
        tooltip: formatFullDate(period.date), // Full date for tooltip
      };
    });
  }, []);

  return (
    <div
      className={`absolute top-2 right-2 ${t.containerBg.opaque} backdrop-blur-sm rounded-lg shadow-md overflow-hidden`}
      style={{ zIndex: Z_INDEX.MAP_CONTROLS }}
    >
      <div className="flex">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => {
              // Disable sync when user manually selects a period
              setSyncActive(false);
              onPeriodChange(period.value);
            }}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors border-r ${t.border.default} last:border-r-0 ${
              selectedPeriod === period.value
                ? `bg-[#009639] text-white`
                : `${t.bg.primary} ${t.text.body} ${t.bg.hover}`
            }`}
            title={period.tooltip}
            aria-label={`${translate("map.switchTo")} ${period.label} ${translate("map.satelliteImagery")}`}
          >
            {period.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
