import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  HomeModernIcon,
} from "@heroicons/react/24/solid";
import type { GazaSite } from "../../types";
import { getSiteTypeConfig } from "../../config/siteTypes";

interface SiteTypeIconProps {
  type: GazaSite["type"];
  className?: string;
}

/**
 * Unicode icon wrapper component for text-based symbols
 */
function UnicodeIcon({
  symbol,
  className,
  ...props
}: {
  symbol: string;
  className?: string;
  "aria-label"?: string;
  role?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontSize: '20px',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...props}
    >
      {symbol}
    </span>
  );
}

/**
 * Icon component for site types with distinct symbols
 *
 * Now uses SITE_TYPE_REGISTRY for extensibility.
 * Supports unicode symbols (default) and heroicon identifiers.
 */
export function SiteTypeIcon({
  type,
  className = "w-5 h-5",
}: SiteTypeIconProps) {
  const typeConfig = getSiteTypeConfig(type);

  // Support heroicon identifiers (for backward compatibility with existing types)
  // Format: "heroicon:BuildingLibraryIcon"
  if (typeConfig.icon.startsWith('heroicon:')) {
    const iconName = typeConfig.icon.replace('heroicon:', '');

    // Map known heroicons
    const iconMap: Record<string, React.ComponentType<{ className?: string; 'aria-label'?: string; role?: string }>> = {
      'BuildingLibraryIcon': BuildingLibraryIcon,
      'MagnifyingGlassIcon': MagnifyingGlassIcon,
      'HomeModernIcon': HomeModernIcon,
    };

    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return (
        <IconComponent
          className={className}
          aria-label={typeConfig.label}
          role="img"
        />
      );
    }
  }

  // Default: Unicode symbol
  return (
    <UnicodeIcon
      symbol={typeConfig.icon}
      className={className}
      aria-label={typeConfig.label}
      role="img"
    />
  );
};

/**
 * Get label text for site type
 *
 * Now uses SITE_TYPE_REGISTRY for extensibility.
 * Supports localization via locale parameter.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const getSiteTypeLabel = (type: string, locale: string = 'en'): string => {
  const typeConfig = getSiteTypeConfig(type);

  if (locale === 'ar' && typeConfig.labelArabic) {
    return typeConfig.labelArabic;
  }

  return typeConfig.label;
};