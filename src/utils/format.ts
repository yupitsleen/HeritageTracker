/**
 * Formatting utility functions
 */

/**
 * Formats kebab-case or snake_case strings to Title Case
 * @example formatLabel("heavily-damaged") => "Heavily Damaged"
 * @example formatLabel("all") => "All"
 */
export const formatLabel = (value: string): string => {
  return value
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Formats a date string to compact format (short month, day, 2-digit year)
 * @example formatDateCompact("2023-12-07") => "Dec 7, 23"
 * @example formatDateCompact(null) => "N/A"
 */
export const formatDateCompact = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

/**
 * Formats a date string to standard format (short month, day, full year)
 * @example formatDateStandard("2023-12-07") => "Dec 7, 2023"
 * @example formatDateStandard(null) => "N/A"
 */
export const formatDateStandard = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Formats a date string to long format (full month name, day, full year)
 * @example formatDateLong("2023-12-07") => "December 7, 2023"
 * @example formatDateLong(null) => "N/A"
 */
export const formatDateLong = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
