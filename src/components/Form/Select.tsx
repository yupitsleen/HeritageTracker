import { components, cn } from "../../styles/theme";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  size?: "default" | "small";
}

/**
 * Styled select component with consistent theming
 * Supports small variant for compact layouts
 */
export function Select({ size = "default", className, children, ...props }: SelectProps) {
  const baseClasses = cn(
    size === "default" ? components.select.base : components.select.small,
    className
  );

  return (
    <select className={baseClasses} {...props}>
      {children}
    </select>
  );
}
