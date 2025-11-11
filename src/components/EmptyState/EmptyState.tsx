/**
 * EmptyState Component - Reusable empty state display
 *
 * Displays a consistent empty state message with optional icon and action button.
 * Used for "no data", "no results", "no imagery", etc.
 */

import { useThemeClasses } from "../../hooks/useThemeClasses";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  /**
   * Title of the empty state (e.g., "No imagery releases available")
   */
  title: string;
  /**
   * Optional description text
   */
  description?: string;
  /**
   * Optional icon to display (uses default if not provided)
   */
  icon?: React.ReactNode;
  /**
   * Optional action button
   */
  action?: React.ReactNode;
  /**
   * Size variant (default: 'md')
   */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    container: "p-4",
    icon: "w-8 h-8",
    title: "text-sm",
    description: "text-xs mt-1",
  },
  md: {
    container: "p-8",
    icon: "w-12 h-12",
    title: "text-base",
    description: "text-sm mt-2",
  },
  lg: {
    container: "p-12",
    icon: "w-16 h-16",
    title: "text-lg",
    description: "text-base mt-3",
  },
};

/**
 * EmptyState component
 *
 * @example
 * ```tsx
 * <EmptyState title="No sites found" />
 *
 * <EmptyState
 *   title="No imagery releases available"
 *   description="Please try again later"
 * />
 *
 * <EmptyState
 *   title="No results"
 *   description="Try adjusting your filters"
 *   action={<Button onClick={handleReset}>Clear Filters</Button>}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  size = "md",
}: EmptyStateProps) {
  const t = useThemeClasses();
  const classes = sizeClasses[size];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${classes.container}`}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      {(icon !== undefined || icon === null) ? (
        icon && <div className={`mb-3 ${t.text.muted}`}>{icon}</div>
      ) : (
        <ExclamationCircleIcon
          className={`${classes.icon} ${t.text.muted} mb-3`}
          aria-hidden="true"
        />
      )}

      {/* Title */}
      <h3 className={`font-medium ${t.text.heading} ${classes.title}`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`${t.text.muted} ${classes.description} max-w-md`}>
          {description}
        </p>
      )}

      {/* Action button */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
