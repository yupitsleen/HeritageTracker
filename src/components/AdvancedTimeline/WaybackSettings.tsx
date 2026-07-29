import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { IntervalSelector } from "./IntervalSelector";
import type { ComparisonInterval } from "../../types/waybackTimelineTypes";

interface WaybackSettingsProps {
  comparisonMode: boolean;
  onComparisonModeToggle: () => void;
  comparisonInterval: ComparisonInterval;
  onIntervalChange: (interval: ComparisonInterval) => void;
  syncMapVersion: boolean;
  onSyncMapVersionToggle: () => void;
}

/**
 * WaybackSettings - Comparison-mode controls for the Wayback imagery timeline.
 *
 * Lives in the filter sidebar's Settings tab so the slider header keeps only
 * temporal navigation.
 */
export function WaybackSettings({
  comparisonMode,
  onComparisonModeToggle,
  comparisonInterval,
  onIntervalChange,
  syncMapVersion,
  onSyncMapVersionToggle,
}: WaybackSettingsProps) {
  const translate = useTranslation();
  const t = useThemeClasses();

  // Same shape as the sidebar's "Show unknown dates" checkbox so settings read as filters.
  const checkbox = (
    label: string,
    checked: boolean,
    onChange: () => void,
    title: string
  ) => (
    <label className="flex items-center gap-3 cursor-pointer" title={title}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 rounded border-gray-300 text-[#009639] focus:ring-[#009639] cursor-pointer"
      />
      <span className={`text-sm ${t.text.body}`}>{label}</span>
    </label>
  );

  return (
    <div className="flex flex-col items-start gap-3">
      {checkbox(
        translate("timeline.comparisonMode"),
        comparisonMode,
        onComparisonModeToggle,
        translate("timeline.comparisonMode")
      )}

      {checkbox(
        translate("timeline.syncMapVersion"),
        syncMapVersion,
        onSyncMapVersionToggle,
        translate("timeline.syncMapVersionTooltip")
      )}

      <IntervalSelector
        value={comparisonInterval}
        onChange={onIntervalChange}
        comparisonModeEnabled={comparisonMode}
        syncMapVersion={syncMapVersion}
      />
    </div>
  );
}
