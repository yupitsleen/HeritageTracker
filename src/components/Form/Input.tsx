import { components, cn } from "../../styles/theme";
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
    components.input.base,
    components.input.focus,
    variant === "number" && components.input.number,
    variant === "date" && components.input.date,
    t.input.base,
    className
  );

  return <input type={variant} className={baseClasses} {...props} />;
}
