import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  HomeModernIcon,
} from "@heroicons/react/24/solid";
import type { GazaSite } from "../../types";

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
 */
export function SiteTypeIcon({
  type,
  className = "w-5 h-5",
}: SiteTypeIconProps) {
  switch (type) {
    case "mosque":
      // Unicode Star and Crescent symbol (Islamic symbol)
      return (
        <UnicodeIcon
          symbol="☪"
          className={className}
          aria-label="Mosque"
          role="img"
        />
      );
    case "church":
      // Unicode Latin Cross symbol
      return (
        <UnicodeIcon
          symbol="✝"
          className={className}
          aria-label="Church"
          role="img"
        />
      );
    case "archaeological":
      // Magnifying glass (research/discovery)
      return (
        <MagnifyingGlassIcon
          className={className}
          aria-label="Archaeological site"
          role="img"
        />
      );
    case "museum":
      // Classical building with columns
      return (
        <BuildingLibraryIcon
          className={className}
          aria-label="Museum"
          role="img"
        />
      );
    case "historic-building":
      // Modern building icon (represents historic architecture)
      return (
        <HomeModernIcon
          className={className}
          aria-label="Historic building"
          role="img"
        />
      );
    default:
      return null;
  }
};

/**
 * Get label text for site type
 */
// eslint-disable-next-line react-refresh/only-export-components
export const getSiteTypeLabel = (type: GazaSite["type"]): string => {
  switch (type) {
    case "mosque":
      return "Mosque";
    case "church":
      return "Church";
    case "archaeological":
      return "Archaeological";
    case "museum":
      return "Museum";
    case "historic-building":
      return "Historic Building";
    default:
      return type;
  }
};