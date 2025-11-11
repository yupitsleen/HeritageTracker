/**
 * Icon Registry - Dynamic Hero Icons Import
 *
 * Provides dynamic access to Hero Icons without manual mapping.
 * Eliminates the need to update icon imports when adding new site types.
 */

import * as HeroIconsSolid from "@heroicons/react/24/solid";
import * as HeroIconsOutline from "@heroicons/react/24/outline";

/**
 * Icon variant types
 */
export type IconVariant = "solid" | "outline";

/**
 * Hero Icon component type
 */
export type HeroIconComponent = React.ComponentType<{
  className?: string;
  "aria-label"?: string;
  role?: string;
}>;

/**
 * Get a Hero Icon component by name
 *
 * Dynamically retrieves icons from the @heroicons/react package without
 * requiring manual imports or mappings. Supports both solid and outline variants.
 *
 * @param iconName - Name of the Hero Icon (e.g., "BuildingLibraryIcon")
 * @param variant - Icon variant: "solid" (default) or "outline"
 * @returns The icon component, or null if not found
 *
 * @example
 * ```typescript
 * const MosqueIcon = getHeroIcon("BuildingLibraryIcon");
 * if (MosqueIcon) {
 *   return <MosqueIcon className="w-5 h-5" />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Use outline variant
 * const InfoIcon = getHeroIcon("InformationCircleIcon", "outline");
 * ```
 */
export function getHeroIcon(
  iconName: string,
  variant: IconVariant = "solid"
): HeroIconComponent | null {
  // Select the appropriate icon set
  const iconSet = variant === "outline" ? HeroIconsOutline : HeroIconsSolid;

  // Access icon dynamically
  const icon = (iconSet as Record<string, unknown>)[iconName];

  // Validate it's a React component (function or object with $$typeof for forwardRef)
  if (typeof icon === "function" || typeof icon === "object") {
    return icon as HeroIconComponent;
  }

  // Icon not found
  if (import.meta.env.DEV) {
    console.warn(
      `Hero Icon "${iconName}" not found in ${variant} variant. ` +
        `Available icons: https://heroicons.com/`
    );
  }

  return null;
}

/**
 * Check if a Hero Icon exists
 *
 * @param iconName - Name of the Hero Icon
 * @param variant - Icon variant: "solid" or "outline"
 * @returns True if the icon exists
 *
 * @example
 * ```typescript
 * if (hasHeroIcon("BuildingLibraryIcon")) {
 *   // Safe to use getHeroIcon()
 * }
 * ```
 */
export function hasHeroIcon(
  iconName: string,
  variant: IconVariant = "solid"
): boolean {
  return getHeroIcon(iconName, variant) !== null;
}

/**
 * Get all available Hero Icon names
 *
 * Useful for debugging or autocomplete features.
 *
 * @param variant - Icon variant: "solid" or "outline"
 * @returns Array of icon names
 *
 * @example
 * ```typescript
 * const solidIcons = getAllHeroIconNames("solid");
 * console.log(`Available icons: ${solidIcons.length}`);
 * ```
 */
export function getAllHeroIconNames(variant: IconVariant = "solid"): string[] {
  const iconSet = variant === "outline" ? HeroIconsOutline : HeroIconsSolid;
  return Object.keys(iconSet).filter((key) => key.endsWith("Icon"));
}
