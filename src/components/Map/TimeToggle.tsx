import type { TimePeriod } from "../../constants/map";
import { useAnimation } from "../../contexts/AnimationContext";

interface TimeToggleProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

/**
 * Toggle control for switching between historical satellite imagery time periods
 * Shows 3 options: 2014 Baseline, Aug 2023 (Pre-conflict), and Current
 * Manual period selection disables timeline sync temporarily (until timeline reset)
 */
export function TimeToggle({ selectedPeriod, onPeriodChange }: TimeToggleProps) {
  const { setSyncActive } = useAnimation();
  const periods: Array<{ value: TimePeriod; label: string; shortLabel: string }> = [
    { value: "BASELINE_2014", label: "2014 Baseline", shortLabel: "2014" },
    { value: "PRE_CONFLICT_2023", label: "Aug 2023 (Pre-conflict)", shortLabel: "Aug 2023" },
    { value: "CURRENT", label: "Current", shortLabel: "Current" },
  ];

  return (
    <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
      <div className="flex">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => {
              // Disable sync when user manually selects a period
              setSyncActive(false);
              onPeriodChange(period.value);
            }}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors border-r border-gray-200 last:border-r-0 ${
              selectedPeriod === period.value
                ? "bg-[#009639] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title={period.label}
            aria-label={`Switch to ${period.label} satellite imagery`}
          >
            {period.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
