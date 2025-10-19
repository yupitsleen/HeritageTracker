import { cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "text" | "number" | "date";
}

/**
 * Styled input component with consistent theming
 * Automatically applies focus ring and proper sizing
 * Supports dark mode
 */
export function Input({ variant = "text", className, ...props }: InputProps) {
  const t = useThemeClasses();

  const baseClasses = cn(
    "px-3 py-2 border rounded-lg text-sm transition-all duration-200",
    t.input.base,
    t.input.focus,
    variant === "number" && t.input.number,
    className
  );

  return <input type={variant} className={baseClasses} {...props} />;
}
