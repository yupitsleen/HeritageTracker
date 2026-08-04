import { Button } from "../Button";
import { COLORS } from "../../config/colorThemes";
import { TOOLTIPS } from "../../config/tooltips";

export interface WaybackNavProps {
  /** Which scrubber this pair drives — also picks the outline colour */
  variant: "before" | "after";
  index: number;
  releaseCount: number;
  onIndexChange: (index: number) => void;
}

/**
 * WaybackNav - prev/next pair for one Wayback scrubber
 *
 * Rendered as an overlay inside the map it drives (see ComparisonMapView);
 * the caller owns positioning.
 */
export function WaybackNav({ variant, index, releaseCount, onIndexChange }: WaybackNavProps) {
  const color = variant === "before" ? COLORS.COMPARE_BEFORE : COLORS.COMPARE_AFTER;
  const step = (delta: number) => {
    const next = Math.max(0, Math.min(index + delta, releaseCount - 1));
    if (next !== index) onIndexChange(next);
  };

  // Inline, not classes: these sit on satellite imagery, so the fill has to win
  // over the variant's `bg-transparent` in both themes.
  const buttonStyle = (isDisabled: boolean) => ({
    backgroundColor: "#ffffff",
    color: isDisabled ? "#9ca3af" : "#111827",
    borderColor: color,
    borderWidth: 3,
  });

  return (
    // dir="ltr" keeps temporal controls left-to-right regardless of language
    <div className="flex items-center gap-2" dir="ltr">
      <Button
        onClick={() => step(-1)}
        disabled={index === 0}
        variant="secondary"
        size="xs"
        className="shadow-md hover:opacity-80"
        style={buttonStyle(index === 0)}
        aria-label={`Go to previous ${variant} imagery release`}
        title={TOOLTIPS.WAYBACK.PREV_RELEASE}
        data-testid={`wayback-${variant}-prev`}
      >
        ⏮
      </Button>

      <Button
        onClick={() => step(1)}
        disabled={index === releaseCount - 1}
        variant="secondary"
        size="xs"
        className="shadow-md hover:opacity-80"
        style={buttonStyle(index === releaseCount - 1)}
        aria-label={`Go to next ${variant} imagery release`}
        title={TOOLTIPS.WAYBACK.NEXT_RELEASE}
        data-testid={`wayback-${variant}-next`}
      >
        ⏭
      </Button>
    </div>
  );
}
