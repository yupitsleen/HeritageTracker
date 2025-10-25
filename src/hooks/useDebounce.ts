/**
 * useDebounce Hook - Delays updating a value until user stops changing it
 *
 * Useful for:
 * - Search inputs (avoid API calls on every keystroke)
 * - Filter changes (reduce re-renders)
 * - Window resize handlers
 *
 * @param value The value to debounce
 * @param delay Delay in milliseconds (default: 300ms)
 * @returns Debounced value that updates after delay
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * // Only fires API call 300ms after user stops typing
 * const { sites } = useSites({ search: debouncedSearch });
 * ```
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout if value changes before delay completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
