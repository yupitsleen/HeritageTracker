interface ChevronIconProps {
  /** Additional CSS classes */
  className?: string;
  /** Direction of chevron: up, down, left, right */
  direction?: "up" | "down" | "left" | "right";
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

/**
 * ChevronIcon - Chevron/arrow icon for dropdowns, navigation, and expandable sections
 *
 * A directional chevron icon that can point in four directions.
 * Commonly used in dropdowns, accordions, pagination, and navigation.
 *
 * @example
 * ```tsx
 * import { ChevronIcon } from '@/components/Icons/ChevronIcon';
 *
 * // Dropdown indicator
 * <button>
 *   Options
 *   <ChevronIcon direction="down" className="w-4 h-4 ml-2" />
 * </button>
 *
 * // Collapsible section
 * <ChevronIcon
 *   direction={isOpen ? "up" : "down"}
 *   className="w-5 h-5 transition-transform"
 * />
 * ```
 */
export function ChevronIcon({
  className = "w-4 h-4",
  direction = "down",
  'aria-label': ariaLabel,
}: ChevronIconProps) {
  // Rotation based on direction (base is "down")
  const rotationClass = {
    up: "rotate-180",
    down: "",
    left: "rotate-90",
    right: "-rotate-90",
  }[direction];

  return (
    <svg
      className={`${className} ${rotationClass}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-label={ariaLabel}
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
