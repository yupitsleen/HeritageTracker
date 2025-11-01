import { useTranslation } from "../../contexts/LocaleContext";
import { Button } from "../Button";

interface TimelineNavigationProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
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
}: TimelineNavigationProps) {
  const translate = useTranslation();

  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5" dir="ltr">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        variant="secondary"
        size="xs"
        aria-label={translate("timeline.previousAriaLabel")}
        title={translate("timeline.previousTitle")}
      >
        ⏮ {translate("timeline.previous")}
      </Button>
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        variant="secondary"
        size="xs"
        aria-label={translate("timeline.nextAriaLabel")}
        title={translate("timeline.nextTitle")}
      >
        {translate("timeline.next")} ⏭
      </Button>
    </div>
  );
}
