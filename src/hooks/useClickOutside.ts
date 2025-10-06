import { useEffect, RefObject } from "react";

/**
 * Custom hook to detect clicks outside of specified elements
 * Useful for dropdowns, modals, and popovers
 *
 * @param refs - Array of refs to elements that should not trigger the handler
 * @param handler - Function to call when click occurs outside
 * @param enabled - Whether the hook is active (default: true)
 *
 * @example
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * const dropdownRef = useRef<HTMLDivElement>(null);
 * useClickOutside([buttonRef, dropdownRef], () => setIsOpen(false), isOpen);
 */
export const useClickOutside = (
  refs: RefObject<HTMLElement>[],
  handler: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside ALL refs
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(target)
      );

      if (isOutside) {
        handler();
      }
    };

    // Add a small delay to avoid closing immediately on open
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, handler, enabled]);
};
