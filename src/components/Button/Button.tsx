import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

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

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  // Base classes (always applied)
  const baseClasses = `
    rounded-lg font-semibold border border-[#000000]
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

  // Variant-specific classes
  const variantClasses = {
    primary: isDark
      ? 'bg-[#2d5a38] hover:bg-[#244a2e] text-white shadow-md hover:shadow-lg active:scale-95'
      : 'bg-[#009639] hover:bg-[#007b2f] text-white shadow-md hover:shadow-lg active:scale-95',

    secondary: isDark
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 shadow-md hover:shadow-lg active:scale-95'
      : 'bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#404040] shadow-md hover:shadow-lg active:scale-95',

    danger: isDark
      ? 'bg-[#8b2a30] hover:bg-[#7a2429] text-white shadow-md hover:shadow-lg active:scale-95'
      : 'bg-[#ed3039] hover:bg-[#d4202a] text-[#fefefe] shadow-md hover:shadow-lg active:scale-95',

    ghost: isDark
      ? 'bg-transparent hover:bg-gray-700 text-gray-300 border-gray-600'
      : 'bg-transparent hover:bg-gray-100 text-gray-600 border-gray-300',
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
