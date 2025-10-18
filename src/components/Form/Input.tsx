import { components, cn } from "../../styles/theme";
import { useTheme } from "../../contexts/ThemeContext";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "text" | "number" | "date";
}

/**
 * Styled input component with consistent theming
 * Automatically applies focus ring and proper sizing
 * Supports dark mode
 */
export function Input({ variant = "text", className, ...props }: InputProps) {
  const { isDark } = useTheme();

  const baseClasses = cn(
    components.input.base,
    components.input.focus,
    variant === "number" && components.input.number,
    variant === "date" && components.input.date,
    isDark && "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400",
    className
  );

  return <input type={variant} className={baseClasses} {...props} />;
}
