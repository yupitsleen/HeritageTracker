import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "../../contexts/LocaleContext";
import { Button } from "../Button";
import { TOOLTIPS } from "../../config/tooltips";

interface TimelineNavigationProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  /** When provided, Reset renders to the left of Previous instead of in TimelineControls */
  onReset?: () => void;
  resetDisabled?: boolean;
}

/**
 * Timeline event navigation (Advanced Timeline mode)
 *
 * Features:
 * - Previous/Next event buttons
 * - Centered absolute positioning
 * - LTR directional override (temporal navigation)
 *
 * Responsibilities:
 * - Render navigation buttons
 * - Forward user interactions to parent
 */
export function TimelineNavigation({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onReset,
  resetDisabled,
}: TimelineNavigationProps) {
  const translate = useTranslation();

  return (
    <div className="relative flex items-center gap-3" dir="ltr">
      {/* Reset sits ~1in left of Previous, absolutely positioned so Prev/Next stay centered */}
      {onReset && (
        <div className="absolute right-full mr-24">
          <Button
            onClick={onReset}
            disabled={resetDisabled}
            variant="secondary"
            size="xs"
            icon={<ArrowPathIcon className="w-3 h-3" />}
            aria-label={translate("common.reset")}
            title={TOOLTIPS.TIMELINE.RESET}
          >
            <span className="hidden xl:inline">{translate("common.reset")}</span>
          </Button>
        </div>
      )}
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        variant="secondary"
        size="xs"
        aria-label={translate("timeline.previousAriaLabel")}
        title={translate("timeline.previousTitle")}
      >
        {/* Icon only below xl, full text at xl+ */}
        <span className="xl:hidden">⏮</span>
        <span className="hidden xl:inline">⏮ {translate("timeline.previous")}</span>
      </Button>
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        variant="secondary"
        size="xs"
        aria-label={translate("timeline.nextAriaLabel")}
        title={translate("timeline.nextTitle")}
      >
        {/* Icon only below xl, full text at xl+ */}
        <span className="xl:hidden">⏭</span>
        <span className="hidden xl:inline">{translate("timeline.next")} ⏭</span>
      </Button>
    </div>
  );
}
