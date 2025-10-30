import { useState, useRef, useEffect, type ReactNode } from "react";
import { Z_INDEX } from "../../constants/layout";

export interface BaseDropdownProps {
  /** Content to display as the dropdown trigger button */
  trigger: ReactNode;
  /** Content to display inside the dropdown menu */
  children: ReactNode;
  /** Whether the dropdown is currently open (controlled mode) */
  isOpen?: boolean;
  /** Callback when dropdown open state changes (controlled mode) */
  onToggle?: (isOpen: boolean) => void;
  /** Override z-index for dropdown menu (e.g., when inside a modal) */
  zIndex?: number;
  /** Alignment of dropdown menu relative to trigger */
  align?: "left" | "right";
  /** Additional className for the dropdown container */
  className?: string;
  /** Additional className for the dropdown menu */
  menuClassName?: string;
}

/**
 * BaseDropdown - Reusable dropdown component with click-outside detection
 *
 * Handles common dropdown patterns:
 * - Click outside to close
 * - Open/close state management
 * - Chevron icon rotation
 * - Z-index management
 * - Alignment options
 *
 * Can be used in controlled or uncontrolled mode.
 *
 * @example Uncontrolled
 * ```tsx
 * <BaseDropdown trigger={<button>Click me</button>}>
 *   <div>Dropdown content</div>
 * </BaseDropdown>
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <BaseDropdown
 *   trigger={<button>Click me</button>}
 *   isOpen={isOpen}
 *   onToggle={setIsOpen}
 * >
 *   <div>Dropdown content</div>
 * </BaseDropdown>
 * ```
 */
export function BaseDropdown({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  zIndex,
  align = "left",
  className = "",
  menuClassName = "",
}: BaseDropdownProps) {
  // Uncontrolled state (only used if isOpen/onToggle not provided)
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if controlled or uncontrolled
  const isControlled = controlledIsOpen !== undefined && onToggle !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  const setIsOpen = isControlled ? onToggle : setUncontrolledIsOpen;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger - wrap in div to add onClick */}
      <div onClick={toggle} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && toggle()}>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute mt-1 ${align === "right" ? "right-0" : "left-0"} ${menuClassName}`}
          style={{
            zIndex: zIndex ?? Z_INDEX.DROPDOWN,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * ChevronIcon - Reusable chevron icon for dropdowns
 * Rotates 180deg when isOpen is true
 */
export function ChevronIcon({ isOpen, className = "" }: { isOpen: boolean; className?: string }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""} ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
