import type { Site } from "../types";

/**
 * Get Tailwind CSS class for status color
 * Using Palestine-inspired palette
 *
 * @param status - Site status
 * @param variant - Color variant (background or text)
 */
export function getStatusColor(
  status: Site["status"],
  variant: "bg" | "text" = "bg"
): string {
  const statusMap = {
    destroyed: variant === "bg" ? "bg-[#b91c1c]" : "text-[#b91c1c]",
    "heavily-damaged": variant === "bg" ? "bg-[#d97706]" : "text-[#d97706]",
    looted: variant === "bg" ? "bg-[#9333ea]" : "text-[#9333ea]",
    damaged: variant === "bg" ? "bg-[#ca8a04]" : "text-[#ca8a04]",
    abandoned: variant === "bg" ? "bg-[#6b7280]" : "text-[#6b7280]",
    unknown: variant === "bg" ? "bg-[#d1d5db]" : "text-[#d1d5db]",
    unharmed: variant === "bg" ? "bg-[#16a34a]" : "text-[#16a34a]",
  };

  return statusMap[status as keyof typeof statusMap];
}

/**
 * Get hex color for D3/SVG/Canvas rendering based on status
 * Using Palestine-inspired palette
 *
 * @param status - Site status
 */
export function getStatusHexColor(status: Site["status"]): string {
  const colorMap = {
    destroyed: "#b91c1c",        // Deep Palestine red
    "heavily-damaged": "#d97706", // Warm amber
    looted: "#9333ea",            // Purple
    damaged: "#ca8a04",           // Muted gold
    abandoned: "#6b7280",         // Gray
    unknown: "#d1d5db",           // Light gray
    unharmed: "#16a34a",          // Green
  };
  return colorMap[status as keyof typeof colorMap];
}
