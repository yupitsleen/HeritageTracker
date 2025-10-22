/**
 * Timeline data calculation utilities
 * Extracted from TimelineScrubber for better testability and maintainability
 */

interface TimelineEvent {
  date: Date;
  siteId: string;
}

/**
 * Calculate default date range from destruction events
 * Returns the earliest and latest destruction dates, or fallback dates if no events
 *
 * @param events - Array of timeline destruction events
 * @param fallbackStart - Fallback start date if no events
 * @param fallbackEnd - Fallback end date if no events
 * @returns Object with defaultStartDate and defaultEndDate
 */
export function calculateDefaultDateRange(
  events: TimelineEvent[],
  fallbackStart: Date,
  fallbackEnd: Date
): { defaultStartDate: Date; defaultEndDate: Date } {
  if (events.length === 0) {
    return { defaultStartDate: fallbackStart, defaultEndDate: fallbackEnd };
  }

  const timestamps = events.map((event) => event.date.getTime());
  return {
    defaultStartDate: new Date(Math.min(...timestamps)),
    defaultEndDate: new Date(Math.max(...timestamps)),
  };
}

/**
 * Filter destruction events by date range
 * Returns events that fall within the specified start and end dates
 *
 * @param events - Array of timeline destruction events
 * @param startDate - Optional start date filter (inclusive)
 * @param endDate - Optional end date filter (inclusive)
 * @returns Filtered array of events
 */
export function filterEventsByDateRange(
  events: TimelineEvent[],
  startDate: Date | null,
  endDate: Date | null
): TimelineEvent[] {
  // No filter applied - return all events
  if (!startDate && !endDate) {
    return events;
  }

  // Apply date range filter
  return events.filter((event) => {
    if (startDate && event.date < startDate) return false;
    if (endDate && event.date > endDate) return false;
    return true;
  });
}

/**
 * Calculate adjusted timeline range based on filtered events
 * Returns date range that matches the filtered events, or falls back to original range
 *
 * @param filteredEvents - Array of filtered timeline events
 * @param hasActiveFilter - Whether any date filter is active
 * @param fallbackStart - Fallback start date if no filtered events
 * @param fallbackEnd - Fallback end date if no filtered events
 * @returns Object with adjustedStartDate and adjustedEndDate
 */
export function calculateAdjustedDateRange(
  filteredEvents: TimelineEvent[],
  hasActiveFilter: boolean,
  fallbackStart: Date,
  fallbackEnd: Date
): { adjustedStartDate: Date; adjustedEndDate: Date } {
  // No filtered events - use fallback range
  if (filteredEvents.length === 0) {
    return { adjustedStartDate: fallbackStart, adjustedEndDate: fallbackEnd };
  }

  // No active filter - use full fallback range (not filtered event range)
  if (!hasActiveFilter) {
    return { adjustedStartDate: fallbackStart, adjustedEndDate: fallbackEnd };
  }

  // Active filter with events - use filtered event range
  const timestamps = filteredEvents.map((event) => event.date.getTime());
  return {
    adjustedStartDate: new Date(Math.min(...timestamps)),
    adjustedEndDate: new Date(Math.max(...timestamps)),
  };
}
