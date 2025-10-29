import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldFlipBelow, setShouldFlipBelow] = useState(false);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if tooltip would overflow edges and adjust position
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Check top overflow - flip below if needed (with 16px margin)
      if (tooltipRect.top < 16) {
        setShouldFlipBelow(true);
      } else {
        setShouldFlipBelow(false);
      }

      // Check horizontal overflow and adjust
      let offset = 0;
      if (tooltipRect.left < 8) {
        // Tooltip going off left edge
        offset = 8 - tooltipRect.left;
      } else if (tooltipRect.right > viewportWidth - 8) {
        // Tooltip going off right edge
        offset = (viewportWidth - 8) - tooltipRect.right;
      }
      setHorizontalOffset(offset);
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block" ref={containerRef}>
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
          className={`absolute z-[10000] left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg w-80 max-w-[calc(100vw-2rem)] whitespace-normal ${
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
