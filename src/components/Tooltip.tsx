import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { TOOLTIP_POSITIONING, TOOLTIP_STYLING } from "../constants/tooltip";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldFlipBelow, setShouldFlipBelow] = useState(false);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * Intelligently position tooltip to stay within viewport boundaries
   *
   * - Flips tooltip below element if too close to top edge
   * - Shifts tooltip horizontally if too close to left/right edges
   * - Recalculates position whenever visibility changes
   */
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Check top overflow - flip below if needed
      if (tooltipRect.top < TOOLTIP_POSITIONING.TOP_MARGIN_THRESHOLD) {
        setShouldFlipBelow(true);
      } else {
        setShouldFlipBelow(false);
      }

      // Check horizontal overflow and adjust
      let offset = 0;
      if (tooltipRect.left < TOOLTIP_POSITIONING.EDGE_PADDING) {
        // Tooltip going off left edge
        offset = TOOLTIP_POSITIONING.EDGE_PADDING - tooltipRect.left;
      } else if (tooltipRect.right > viewportWidth - TOOLTIP_POSITIONING.EDGE_PADDING) {
        // Tooltip going off right edge
        offset = (viewportWidth - TOOLTIP_POSITIONING.EDGE_PADDING) - tooltipRect.right;
      }
      setHorizontalOffset(offset);
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-[${TOOLTIP_STYLING.Z_INDEX}] left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg w-80 max-w-[calc(100vw-${TOOLTIP_STYLING.MIN_VIEWPORT_MARGIN}rem)] whitespace-normal ${
            shouldFlipBelow ? 'top-full mt-2' : 'bottom-full mb-2'
          }`}
          style={{ transform: `translateX(calc(-50% + ${horizontalOffset}px))` }}
        >
          {content}
          <div className={`absolute left-1/2 border-4 border-transparent ${
            shouldFlipBelow
              ? 'bottom-full -mb-1 border-b-gray-900'
              : 'top-full -mt-1 border-t-gray-900'
          }`} style={{ transform: `translateX(calc(-50% - ${horizontalOffset}px))` }} />
        </div>
      )}
    </div>
  );
}
