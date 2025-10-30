import { useEffect, useRef, memo } from "react";
import { cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { CloseIcon } from "../Icons";
import { Z_INDEX } from "../../constants/layout";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  zIndex?: number;
}

/**
 * Accessible modal component with backdrop, escape key support, and focus trapping
 * Supports custom z-index for modal stacking (e.g., detail modal over table modal)
 * Supports dark mode
 *
 * Performance optimizations:
 * - Reduced backdrop blur intensity (backdrop-blur-[2px] instead of backdrop-blur-sm)
 * - Added will-change hint for smoother transforms
 * - Memoized component to prevent unnecessary re-renders
 */
export const Modal = memo(function Modal({ isOpen, onClose, children, title, zIndex = Z_INDEX.MODAL }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useThemeClasses();

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Focus trap - focus modal when opened
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop with lightweight blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto",
          "rounded-2xl shadow-2xl transform transition-all will-change-transform",
          t.card.base
        )}
        style={{ contain: 'layout style paint' }}
      >
        {/* Close button - positioned at top right of content */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-8 z-30 p-2 cursor-pointer",
            t.text.muted
          )}
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Modal Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
});
