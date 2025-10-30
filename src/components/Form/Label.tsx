import { cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Size variant for compact layouts
   */
  size?: "default" | "small";
  /**
   * Whether this label is for a required field
   */
  required?: boolean;
}

/**
 * Styled label component with consistent theming
 * Supports small variant, required indicator, and dark mode
 */
export function Label({
  size = "default",
  required = false,
  className,
  children,
  ...props
}: LabelProps) {
  const t = useThemeClasses();

  const sizeClasses = size === "small" ? "text-xs" : "text-sm";

  const labelClasses = cn(
    "font-medium select-none",
    sizeClasses,
    t.text.primary,
    className
  );

  return (
    <label className={labelClasses} {...props}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}
