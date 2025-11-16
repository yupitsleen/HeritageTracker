import { Button } from "../Button";
import { useTranslation } from "../../contexts/LocaleContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import type { TranslationKey } from "../../types/i18n";

interface TimelineToggleButtonProps {
  label: TranslationKey;
  isActive: boolean;
  onClick: () => void;
  variant: 'button' | 'menu-item';
  onMenuClose?: () => void;
  tooltip?: TranslationKey; // Optional tooltip (title attribute)
}

/**
 * Reusable toggle button for timeline controls
 *
 * Renders as either a Button (desktop) or menu item (mobile dropdown).
 * Handles active state with checkmarks and proper styling.
 *
 * @param label - Translation key for the toggle label
 * @param isActive - Whether the toggle is currently active
 * @param onClick - Callback when toggle is clicked
 * @param variant - 'button' for desktop, 'menu-item' for mobile menu
 * @param onMenuClose - Optional callback to close menu (menu-item variant only)
 */
export function TimelineToggleButton({
  label,
  isActive,
  onClick,
  variant,
  onMenuClose,
  tooltip,
}: TimelineToggleButtonProps) {
  const translate = useTranslation();
  const t = useThemeClasses();
  const translatedLabel = translate(label);
  const translatedTooltip = tooltip ? translate(tooltip) : translatedLabel;

  const handleClick = () => {
    onClick();
    if (variant === 'menu-item' && onMenuClose) {
      onMenuClose();
    }
  };

  if (variant === 'menu-item') {
    return (
      <button
        onClick={handleClick}
        className={`w-full text-left px-4 py-2 text-sm ${t.text.body} ${t.bg.hover} flex items-center justify-between`}
        title={translatedTooltip}
      >
        <span>{translatedLabel}</span>
        {isActive && <span className="text-green-600">✓</span>}
      </button>
    );
  }

  // Button variant (desktop)
  return (
    <Button
      onClick={handleClick}
      variant="secondary"
      active={isActive}
      size="xs"
      aria-label={translatedLabel}
      title={translatedTooltip}
    >
      {isActive ? "✓" : ""} {translatedLabel}
    </Button>
  );
}
