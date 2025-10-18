import { components, cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: "default" | "small";
}

/**
 * Styled select component with consistent theming
 * Supports small variant for compact layouts
 * Supports dark mode
 */
export function Select({ size = "default", className, children, ...props }: SelectProps) {
  const t = useThemeClasses();

  const baseClasses = cn(
    size === "default" ? components.select.base : components.select.small,
    t.input.base,
    className
  );

  return (
    <select className={baseClasses} {...props}>
      {children}
    </select>
  );
}
