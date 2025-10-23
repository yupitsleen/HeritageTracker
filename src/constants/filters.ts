/**
 * Filter options constants
 * Centralized to ensure consistency across components
 */

import { getSiteTypes } from "../config/siteTypes";
import { getStatuses } from "../config/siteStatus";

/**
 * Available site types for filtering
 * Now dynamically generated from SITE_TYPE_REGISTRY
 */
export const getSiteTypeOptions = (): string[] => {
  return getSiteTypes().map(type => type.id);
};

// Backward compatibility: export as constant for existing code
export const SITE_TYPES: readonly string[] = getSiteTypeOptions();

/**
 * Available damage status options for filtering
 * Now dynamically generated from STATUS_REGISTRY
 */
export const getStatusOptions = (): string[] => {
  return getStatuses().map(status => status.id);
};

// Backward compatibility: export as constant for existing code
export const STATUS_OPTIONS: readonly string[] = getStatusOptions();
