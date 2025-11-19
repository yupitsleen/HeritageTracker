import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon element to display */
  icon: ReactNode;
  /** Accessible label for screen readers */
  ariaLabel: string;
  /** Tooltip text shown on hover (native browser tooltip) */
  title?: string;
}

/**
 * IconButton - Consistent icon-only button component
 *
 * Used for Help and Dark Mode toggle buttons across the application.
 * Provides a consistent subtle-to-bold hover aesthetic.
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<QuestionMarkCircleIcon className="w-4 h-4" />}
 *   onClick={handleHelp}
 *   ariaLabel="How to use this page"
 *   title="How to use this page"
 * />
 * ```
 */
export function IconButton({
  icon,
  ariaLabel,
  title,
  onClick,
  className = '',
  ...props
}: IconButtonProps) {
  const { isDark } = useTheme();

  const buttonClasses = `p-2 rounded-sm border transition-all duration-200 hover:shadow-lg active:opacity-80 ${
    isDark
      ? "bg-transparent text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
      : "bg-transparent text-white border-gray-400 hover:bg-gray-700 hover:text-white hover:border-gray-700"
  } ${className}`;

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      {icon}
    </button>
  );
}
