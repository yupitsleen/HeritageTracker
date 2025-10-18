import { components, cn } from "../../styles/theme";
import { useTheme } from "../../contexts/ThemeContext";

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: "default" | "small";
}

/**
 * Styled select component with consistent theming
 * Supports small variant for compact layouts
 * Supports dark mode
 */
export function Select({ size = "default", className, children, ...props }: SelectProps) {
  const { isDark } = useTheme();

  const baseClasses = cn(
    size === "default" ? components.select.base : components.select.small,
    isDark && "bg-gray-700 border-gray-600 text-gray-100",
    className
  );

  return (
    <select className={baseClasses} {...props}>
      {children}
    </select>
  );
}
