import {
  BuildingLibraryIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import type { GazaSite } from "../../types";

interface SiteTypeIconProps {
  type: GazaSite["type"];
  className?: string;
}

/**
 * Professional SVG icon component for site types
 * Replaces emoji icons for consistent cross-browser rendering
 */
export function SiteTypeIcon({
  type,
  className = "w-5 h-5",
}: SiteTypeIconProps) {
  switch (type) {
    case "mosque":
      // Using BuildingLibraryIcon for mosque (dome-like structure)
      return (
        <BuildingLibraryIcon
          className={className}
          aria-label="Mosque"
          role="img"
        />
      );
    case "church":
      // Using BuildingLibraryIcon for church (religious building)
      return (
        <BuildingLibraryIcon
          className={className}
          aria-label="Church"
          role="img"
        />
      );
    case "archaeological":
      // Using BuildingLibraryIcon for archaeological site (classical building)
      return (
        <BuildingLibraryIcon
          className={className}
          aria-label="Archaeological site"
          role="img"
        />
      );
    case "museum":
      // Using BuildingLibraryIcon for museum (institutional building)
      return (
        <BuildingLibraryIcon
          className={className}
          aria-label="Museum"
          role="img"
        />
      );
    case "historic-building":
      // Using HomeModernIcon for historic building
      return (
        <BuildingOffice2Icon
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