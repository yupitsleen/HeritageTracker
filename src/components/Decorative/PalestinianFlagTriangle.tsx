import { useTheme } from "../../contexts/ThemeContext";
import { COLORS } from "../../config/colorThemes";
import { Z_INDEX } from "../../constants/layout";
import { OPACITY } from "../../constants/opacity";

interface PalestinianFlagTriangleProps {
  /**
   * Width of the triangle in pixels
   * @default 800
   */
  width?: number;
  /**
   * Opacity value (0-100)
   * @default OPACITY.HOVER_STATE (50)
   */
  opacity?: number;
  /**
   * Z-index value for layering control
   * @default Z_INDEX.BACKGROUND_DECORATION
   */
  zIndex?: number;
}

/**
 * Palestinian Flag Red Triangle - Decorative Background Element
 *
 * Renders a fixed-position triangle on the left side of the screen,
 * using colors from the Palestinian flag. The triangle adapts to
 * theme (light/dark) and supports customizable width and opacity.
 *
 * Visual effect: Creates a distinctive left-aligned triangle that
 * extends from top-left to middle-right, staying behind content.
 *
 * @example
 * ```tsx
 * // Default usage (800px width, 50% opacity)
 * <PalestinianFlagTriangle />
 *
 * // Custom width (e.g., responsive to table width)
 * <PalestinianFlagTriangle width={tableWidth + 600} />
 *
 * // Custom opacity
 * <PalestinianFlagTriangle opacity={30} />
 * ```
 */
export function PalestinianFlagTriangle({
  width = 800,
  opacity = OPACITY.HOVER_STATE,
  zIndex = Z_INDEX.BACKGROUND_DECORATION,
}: PalestinianFlagTriangleProps) {
  const { isDark } = useTheme();

  // Convert opacity from 0-100 to 0-1 decimal for inline styles
  const opacityDecimal = opacity / 100;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none transition-colors duration-200"
      style={{
        width: `${width}px`,
        height: '100vh',
        background: isDark ? COLORS.FLAG_RED_DARK : COLORS.FLAG_RED,
        clipPath: `polygon(0 0, 0 100%, ${width}px 50%)`,
        opacity: opacityDecimal,
        zIndex,
      }}
      aria-hidden="true"
    />
  );
}
