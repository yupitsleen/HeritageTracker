import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Button content */
  children: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon to show before text (optional) */
  icon?: ReactNode;
}

/**
 * Reusable Button component with theme-aware styling
 *
 * Centralizes all button styling logic to maintain consistency
 * and eliminate duplication across the application.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Apply Filters
 * </Button>
 *
 * <Button variant="danger" disabled={isDisabled} icon={<TrashIcon />}>
 *   Delete
 * </Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const { isDark } = useTheme();

  // Size classes - increased padding for more substantial feel
  const sizeClasses = {
    xs: 'px-4 py-1.5 text-xs uppercase tracking-wide',
    sm: 'px-5 py-2 text-xs uppercase tracking-wide',
    md: 'px-6 py-2.5 text-sm uppercase tracking-wide',
    lg: 'px-8 py-3 text-base uppercase tracking-wide',
  }[size];

  // Base classes (always applied) - sharp corners, subtle default, vibrant hover
  const baseClasses = `
    rounded-sm font-semibold border
    transition-all duration-200
    inline-flex items-center justify-center gap-2
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses}
  `.trim().replace(/\s+/g, ' ');

  // Disabled state (overrides all variants)
  if (disabled) {
    return (
      <button
        disabled
        className={`${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed shadow-none ${className}`}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }

  // Variant-specific classes - subtle default, vibrant hover
  const variantClasses = {
    primary: isDark
      ? 'bg-transparent text-gray-300 border-gray-600 hover:bg-[#009639] hover:text-white hover:border-[#009639] hover:shadow-lg active:opacity-80'
      : 'bg-transparent text-gray-600 border-gray-400 hover:bg-[#009639] hover:text-white hover:border-[#009639] hover:shadow-lg active:opacity-80',

    secondary: isDark
      ? 'bg-transparent text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-500 hover:shadow-lg active:opacity-80'
      : 'bg-transparent text-gray-600 border-gray-400 hover:bg-gray-700 hover:text-white hover:border-gray-700 hover:shadow-lg active:opacity-80',

    danger: isDark
      ? 'bg-transparent text-gray-300 border-gray-600 hover:bg-[#ed3039] hover:text-white hover:border-[#ed3039] hover:shadow-lg active:opacity-80'
      : 'bg-transparent text-gray-600 border-gray-400 hover:bg-[#ed3039] hover:text-white hover:border-[#ed3039] hover:shadow-lg active:opacity-80',

    ghost: isDark
      ? 'bg-transparent hover:bg-gray-700 text-gray-300 border-gray-600 hover:opacity-90'
      : 'bg-transparent hover:bg-gray-100 text-gray-600 border-gray-300 hover:opacity-90',
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
