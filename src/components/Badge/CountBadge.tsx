import { COLORS } from "../../config/colorThemes";

interface CountBadgeProps {
  /** Number to display in badge */
  count: number;
  /** Visual style variant */
  variant?: "primary" | "danger" | "success";
  /** Additional CSS classes */
  className?: string;
}

/**
 * CountBadge - Reusable badge component for displaying count indicators
 *
 * Used for showing active filter counts, notification counts, etc.
 * Supports themed color variants matching Palestinian flag colors.
 *
 * @example
 * ```tsx
 * <CountBadge count={5} variant="primary" />
 * <CountBadge count={2} variant="danger" />
 * ```
 */
export function CountBadge({ count, variant = "primary", className = "" }: CountBadgeProps) {
  const bgColor = {
    primary: COLORS.FLAG_GREEN,
    danger: COLORS.FLAG_RED,
    success: COLORS.FLAG_GREEN,
  }[variant];

  return (
    <span
      className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-white text-xs font-bold ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {count}
    </span>
  );
}
