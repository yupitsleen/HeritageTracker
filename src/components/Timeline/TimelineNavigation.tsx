import { useTranslation } from "../../contexts/LocaleContext";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip";

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
    <div className="flex items-center gap-3" dir="ltr">
      <Tooltip content={translate("timeline.previousTitle")}>
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="secondary"
          size="xs"
          aria-label={translate("timeline.previousAriaLabel")}
        >
          {/* Icon only below xl, full text at xl+ */}
          <span className="xl:hidden">⏮</span>
          <span className="hidden xl:inline">⏮ {translate("timeline.previous")}</span>
        </Button>
      </Tooltip>
      <Tooltip content={translate("timeline.nextTitle")}>
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          variant="secondary"
          size="xs"
          aria-label={translate("timeline.nextAriaLabel")}
        >
          {/* Icon only below xl, full text at xl+ */}
          <span className="xl:hidden">⏭</span>
          <span className="hidden xl:inline">{translate("timeline.next")} ⏭</span>
        </Button>
      </Tooltip>
    </div>
  );
}
