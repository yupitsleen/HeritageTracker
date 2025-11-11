/**
 * Icon Registry - Tree-Shakable Hero Icons
 *
 * Provides access to Hero Icons with optimal bundle size.
 * Only imports icons that are actually used in the application.
 *
 * To add new icons:
 * 1. Import from @heroicons/react/24/solid or outline
 * 2. Add to ICON_REGISTRY_SOLID or ICON_REGISTRY_OUTLINE
 */

// Import only the icons we use (tree-shakable)
import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  HomeModernIcon,
  FlagIcon,
  ArchiveBoxIcon,
  MoonIcon,
  PlusIcon,
  HeartIcon,
  HomeIcon as HomeIconSolid,
} from "@heroicons/react/24/solid";

import {
  HomeIcon as HomeIconOutline,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

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
 * Registry of solid icons
 */
const ICON_REGISTRY_SOLID: Record<string, HeroIconComponent> = {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  HomeModernIcon,
  FlagIcon,
  ArchiveBoxIcon,
  MoonIcon,
  PlusIcon,
  HeartIcon,
  HomeIcon: HomeIconSolid,
};

/**
 * Registry of outline icons
 */
const ICON_REGISTRY_OUTLINE: Record<string, HeroIconComponent> = {
  HomeIcon: HomeIconOutline,
  InformationCircleIcon,
  ExclamationCircleIcon,
};

/**
 * Get a Hero Icon component by name
 *
 * Retrieves icons from the registry with tree-shaking support.
 * Only icons that are imported will be included in the bundle.
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
  // Select the appropriate icon registry
  const registry = variant === "outline" ? ICON_REGISTRY_OUTLINE : ICON_REGISTRY_SOLID;

  // Look up icon
  const icon = registry[iconName];

  if (icon) {
    return icon;
  }

  // Icon not found
  if (import.meta.env.DEV) {
    console.warn(
      `Hero Icon "${iconName}" not found in ${variant} variant. ` +
        `Available icons: ${Object.keys(registry).join(", ")}`
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
 * Returns only the icons that are registered (not all 200+ icons).
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
  const registry = variant === "outline" ? ICON_REGISTRY_OUTLINE : ICON_REGISTRY_SOLID;
  return Object.keys(registry);
}
