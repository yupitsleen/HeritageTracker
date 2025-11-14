import { COLORS } from "../../config/colorThemes";

interface DateLabelProps {
  /** The date string to display */
  date: string;
  /** Label color - 'yellow' for before/earlier, 'green' for after/later */
  variant: "yellow" | "green";
  /** Size variant - 'sm' for timeline tooltips (10px), 'md' for map labels (15px) */
  size?: "sm" | "md";
  /** Optional opacity override (default: 1.0 for tooltips, 0.7 for map labels) */
  opacity?: number;
}

/**
 * DateLabel - Reusable date label component for timeline and map views
 *
 * Provides consistent styling for date tooltips and labels across:
 * - WaybackSlider scrubber tooltips
 * - ComparisonMapView map labels
 * - SiteDetailView map labels
 *
 * Features:
 * - Yellow variant for "before" dates (Palestinian flag yellow)
 * - Green variant for "after" dates (Palestinian flag green)
 * - Two size variants (sm for tooltips, md for map labels)
 * - Configurable opacity
 */
export function DateLabel({
  date,
  variant,
  size = "sm",
  opacity = size === "sm" ? 1.0 : 0.7,
}: DateLabelProps) {
  const backgroundColor = variant === "yellow" ? COLORS.FLAG_YELLOW : COLORS.FLAG_GREEN;
  const textColor = variant === "yellow" ? "text-black" : "text-white";
  const fontSize = size === "sm" ? "text-[10px]" : "text-[15px]";

  return (
    <div
      className={`px-2 py-0.5 ${textColor} ${fontSize} font-semibold rounded whitespace-nowrap shadow-lg`}
      style={{ backgroundColor, opacity, outline: '1px solid black' }}
    >
      {date}
    </div>
  );
}
