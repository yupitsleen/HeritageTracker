import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { TOOLTIP_POSITIONING } from "../constants/tooltip";
import { Z_INDEX } from "../constants/layout";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [shouldFlipBelow, setShouldFlipBelow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * Calculate and set tooltip position
   * Extracted into a function so it can be called from multiple places
   */
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Calculate base position (centered above trigger)
    const left = triggerRect.left + triggerRect.width / 2;
    let top = triggerRect.top;

    // Check top overflow - flip below if needed
    const shouldFlip = triggerRect.top - tooltipRect.height - 8 < TOOLTIP_POSITIONING.TOP_MARGIN_THRESHOLD;
    setShouldFlipBelow(shouldFlip);

    if (shouldFlip) {
      top = triggerRect.bottom + 8; // Position below
    } else {
      top = triggerRect.top - tooltipRect.height - 8; // Position above
    }

    setPosition({ top, left });

    // Check horizontal overflow and adjust
    let offset = 0;
    const tooltipLeft = left - tooltipRect.width / 2;
    const tooltipRight = left + tooltipRect.width / 2;

    if (tooltipLeft < TOOLTIP_POSITIONING.EDGE_PADDING) {
      // Tooltip going off left edge
      offset = TOOLTIP_POSITIONING.EDGE_PADDING - tooltipLeft;
    } else if (tooltipRight > viewportWidth - TOOLTIP_POSITIONING.EDGE_PADDING) {
      // Tooltip going off right edge
      offset = (viewportWidth - TOOLTIP_POSITIONING.EDGE_PADDING) - tooltipRight;
    }
    setHorizontalOffset(offset);

    // Mark as positioned so tooltip can be shown
    setIsPositioned(true);
  };

  /**
   * Intelligently position tooltip to stay within viewport boundaries
   *
   * - Positions tooltip relative to trigger element using fixed positioning
   * - Flips tooltip below element if too close to top edge
   * - Shifts tooltip horizontally if too close to left/right edges
   * - Recalculates position whenever visibility changes
   * - Uses ResizeObserver to detect when tooltip dimensions are ready
   */
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const tooltip = tooltipRef.current;

      // Use ResizeObserver to detect when the tooltip has been laid out
      // This fires when the element's dimensions change, which happens
      // after the browser completes layout with the actual content
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Only calculate position if the tooltip has non-zero dimensions
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            calculatePosition();
          }
        }
      });

      resizeObserver.observe(tooltip);

      // Also calculate immediately in case dimensions are already available
      // This handles the case where the tooltip was previously rendered
      if (tooltip.offsetWidth > 0 && tooltip.offsetHeight > 0) {
        calculatePosition();
      }

      return () => {
        resizeObserver.disconnect();
      };
    } else if (!isVisible) {
      // Reset positioned state when hiding tooltip
      setIsPositioned(false);
    }
  }, [isVisible]);

  // Render tooltip content
  const tooltipContent = isVisible && (
    <div
      ref={tooltipRef}
      className="px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg max-w-80 max-w-[calc(100vw-2rem)] whitespace-normal text-center"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: `translateX(calc(-50% + ${horizontalOffset}px))`,
        zIndex: Z_INDEX.NOTIFICATION,
        pointerEvents: 'none', // Allow mouse events to pass through
        visibility: isPositioned ? 'visible' : 'hidden', // Hide until positioned to prevent flash at (0,0)
        opacity: isPositioned ? 1 : 0, // Also fade in for smooth appearance
        transition: isPositioned ? 'opacity 150ms ease-in-out' : 'none', // Smooth fade-in after positioning
      }}
    >
      {content}
      <div
        className={`absolute left-1/2 border-4 border-transparent ${
          shouldFlipBelow
            ? 'bottom-full -mb-1 border-b-gray-900'
            : 'top-full -mt-1 border-t-gray-900'
        }`}
        style={{ transform: `translateX(calc(-50% - ${horizontalOffset}px))` }}
      />
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-block cursor-help"
      >
        {children}
      </div>
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
}
