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
 * @param dateString - ISO date string or null/undefined
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'ar-EG'). Defaults to 'en-US'
 * @example formatDateCompact("2023-12-07") => "Dec 7, 23"
 * @example formatDateCompact("2023-12-07", "ar-EG") => "٧ ديسمبر ٢٣"
 * @example formatDateCompact(null) => "N/A"
 */
export const formatDateCompact = (
  dateString: string | null | undefined,
  locale: string = "en-US"
): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

/**
 * Formats a date string to standard format (short month, day, full year)
 * @param dateString - ISO date string or null/undefined
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'ar-EG'). Defaults to 'en-US'
 * @example formatDateStandard("2023-12-07") => "Dec 7, 2023"
 * @example formatDateStandard("2023-12-07", "ar-EG") => "٧ ديسمبر ٢٠٢٣"
 * @example formatDateStandard(null) => "N/A"
 */
export const formatDateStandard = (
  dateString: string | null | undefined,
  locale: string = "en-US"
): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Formats a date string to long format (full month name, day, full year)
 * @param dateString - ISO date string or null/undefined
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'ar-EG'). Defaults to 'en-US'
 * @example formatDateLong("2023-12-07") => "December 7, 2023"
 * @example formatDateLong("2023-12-07", "ar-EG") => "٧ ديسمبر ٢٠٢٣"
 * @example formatDateLong(null) => "N/A"
 */
export const formatDateLong = (
  dateString: string | null | undefined,
  locale: string = "en-US"
): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
