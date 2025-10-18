/**
 * Component-level style configurations
 * Reusable Tailwind class combinations for common UI patterns
 */

export const components = {
  // Card styles
  card: {
    base: "bg-[#fefefe] rounded-lg shadow-md overflow-hidden border border-[#f5f5f5]",
    padding: "p-6",
    hover: "hover:shadow-lg hover:border-[#a3a3a3] transition-all",
  },

  // Button styles
  button: {
    base: "px-4 py-2 rounded-lg font-semibold transition-colors",
    primary: "bg-[#009639] text-[#fefefe] hover:bg-[#007b2f]",        // Palestine flag green
    secondary: "bg-[#f5f5f5] text-[#404040] hover:bg-[#e5e5e5]",      // Palestine grays
    reset: "px-4 py-2 bg-[#ed3039] text-[#fefefe] rounded-md hover:bg-[#d4202a] transition-colors text-sm",  // Palestine flag red
    toggle: "px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors",
  },

  // Form styles
  input: {
    base: "px-3 py-2 border border-[#000000] rounded-lg text-sm text-gray-900 bg-white transition-all duration-200 placeholder:text-gray-400",
    focus: "focus:outline-none focus:ring-2 focus:ring-[#009639] focus:border-transparent",
    number: "w-20",
    date: "",
  },

  select: {
    base: "w-full px-4 py-2 border border-[#000000] rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-[#009639] focus:border-[#009639]",  // Palestine flag green focus
    small: "px-2 py-2 border border-[#000000] rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#009639] focus:border-[#009639]",
  },

  label: {
    base: "block text-sm font-medium text-[#525252] mb-2",  // Palestine dark gray
    filter: "text-xs font-medium text-gray-600",
  },

  // Tag/Chip styles (for removable filter tags)
  tag: {
    base: "inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded",
    default: "bg-gray-500 hover:bg-gray-600 text-white font-medium border border-gray-600 transition-colors duration-200",
    removeButton: "ml-0.5 text-gray-200 hover:text-[#ed3039] transition-colors text-sm font-bold leading-none",  // Palestine flag red
  },

  // Badge styles
  badge: {
    base: "inline-block px-2 py-1 rounded text-xs font-medium",
    primary: "bg-[#dcfce9] text-[#006226]",     // Palestine flag light/dark green
    success: "bg-[#dcfce9] text-[#006226]",     // Palestine flag greens
    warning: "bg-[#fef3f4] text-[#b01822]",     // Palestine flag light/dark red
    danger: "bg-[#fde6e8] text-[#d4202a]",      // Palestine flag reds
  },

  // Container styles
  container: {
    base: "container mx-auto px-4",
    section: "py-8",
  },

  // Header styles
  header: {
    base: "bg-[#000000] text-[#fefefe] shadow-lg border-b-2 border-[#009639]",  // Palestine flag black with green accent
    title: "text-3xl font-bold text-center",
    subtitle: "text-[#f5f5f5] mt-2 text-center",  // Light gray text
  },

  // Footer styles
  footer: {
    base: "bg-[#000000] text-[#a3a3a3] mt-16 border-t-2 border-[#009639]",  // Palestine flag black with green accent
    text: "text-sm text-center",
  },

  // Map styles
  map: {
    container: "h-[600px] w-full rounded-lg shadow-md border border-[#e5e5e5]",
  },

  // Table styles
  table: {
    base: "w-full text-sm text-left",
    header: "bg-[#000000] text-[#fefefe] sticky top-0 z-10",  // Palestine flag black and white
    th: "px-4 py-3 font-semibold",
    row: "border-b border-[#e5e5e5] hover:bg-[#fafafa] cursor-pointer transition-all",
    td: "px-4 py-3",
  },

  // Filter styles
  filter: {
    group: "flex flex-col gap-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50/50",
    labelContainer: "flex items-center gap-1 justify-center",
    inputContainer: "flex items-center gap-2",
    rangeSeparator: "text-xs text-gray-500",
    count: "mt-2 text-sm text-gray-600 text-center",
    countNumber: "font-semibold text-gray-900",
  },
} as const;
