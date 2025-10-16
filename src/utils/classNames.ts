/**
 * Conditionally join class names
 * Similar to clsx/classnames but lightweight
 *
 * @example
 * cn("base-class", isActive && "active-class", isFocused && "focus-class")
 * // => "base-class active-class" (if isActive is true, isFocused is false)
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
