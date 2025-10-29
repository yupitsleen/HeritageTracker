import { InfoIcon } from "./InfoIcon";
import { Tooltip } from "../Tooltip";

interface InfoIconWithTooltipProps {
  /** Tooltip text to display on hover */
  tooltip: string;
  /** Additional CSS classes for the icon */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

/**
 * InfoIconWithTooltip - Light grey info icon with tooltip on hover
 *
 * A reusable component that displays a small information icon in light grey color.
 * When hovered, it shows a tooltip with explanatory text.
 *
 * @example
 * ```tsx
 * <InfoIconWithTooltip tooltip="Click and drag the timeline to navigate through time" />
 * ```
 */
export function InfoIconWithTooltip({
  tooltip,
  className = "w-4 h-4",
  'aria-label': ariaLabel
}: InfoIconWithTooltipProps) {
  return (
    <Tooltip content={tooltip}>
      <InfoIcon
        className={`${className} text-gray-400 hover:text-gray-500 transition-colors cursor-help`}
        aria-label={ariaLabel || tooltip}
      />
    </Tooltip>
  );
}
