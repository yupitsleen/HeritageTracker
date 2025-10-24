interface CloseIconProps {
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

/**
 * CloseIcon - X icon for closing modals, dialogs, and dismissible elements
 *
 * A simple X (cross) icon commonly used for close/dismiss actions.
 * Typically used in modal headers, alert dismissals, and removable tags.
 *
 * @example
 * ```tsx
 * import { CloseIcon } from '@/components/Icons/CloseIcon';
 *
 * <button onClick={onClose} aria-label="Close modal">
 *   <CloseIcon className="w-6 h-6" />
 * </button>
 * ```
 */
export function CloseIcon({ className = "w-6 h-6", 'aria-label': ariaLabel }: CloseIconProps) {
  return (
    <svg
      className={className}
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
