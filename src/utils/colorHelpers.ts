import type { GazaSite } from "../types";

/**
 * Get Tailwind CSS class for status color
 * Using Palestine-inspired palette
 *
 * @param status - Site status
 * @param variant - Color variant (background or text)
 */
export function getStatusColor(
  status: GazaSite["status"],
  variant: "bg" | "text" = "bg"
): string {
  const statusMap = {
    destroyed: variant === "bg" ? "bg-[#b91c1c]" : "text-[#b91c1c]",
    "heavily-damaged": variant === "bg" ? "bg-[#d97706]" : "text-[#d97706]",
    damaged: variant === "bg" ? "bg-[#ca8a04]" : "text-[#ca8a04]",
  };

  return statusMap[status];
}

/**
 * Get hex color for D3/SVG/Canvas rendering based on status
 * Using Palestine-inspired palette
 *
 * @param status - Site status
 */
export function getStatusHexColor(status: GazaSite["status"]): string {
  const colorMap = {
    destroyed: "#b91c1c",        // Deep Palestine red
    "heavily-damaged": "#d97706", // Warm amber
    damaged: "#ca8a04",           // Muted gold
  };
  return colorMap[status];
}
