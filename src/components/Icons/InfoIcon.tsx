interface InfoIconProps {
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** Native tooltip text */
  title?: string;
}

/**
 * InfoIcon - Information icon for tooltips and help text
 *
 * A circled 'i' icon commonly used to indicate additional information is available.
 * Typically wrapped in a Tooltip component to show explanatory text on hover.
 *
 * @example
 * ```tsx
 * import { InfoIcon } from '@/components/Icons/InfoIcon';
 * import { Tooltip } from '@/components/Tooltip';
 *
 * <Tooltip content="This field is required">
 *   <InfoIcon className="w-4 h-4 text-gray-500" />
 * </Tooltip>
 * ```
 */
export function InfoIcon({ className = "w-4 h-4", 'aria-label': ariaLabel, title }: InfoIconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-label={ariaLabel}
      role="img"
    >
      {title && <title>{title}</title>}
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
