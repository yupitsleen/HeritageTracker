import { components, cn } from "../../styles/theme";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "text" | "number" | "date";
}

/**
 * Styled input component with consistent theming
 * Automatically applies focus ring and proper sizing
 */
export function Input({ variant = "text", className, ...props }: InputProps) {
  const baseClasses = cn(
    components.input.base,
    components.input.focus,
    variant === "number" && components.input.number,
    variant === "date" && components.input.date,
    className
  );

  return <input type={variant} className={baseClasses} {...props} />;
}
