/**
 * Design System Constants
 * Centralized styling constants for consistent UI across Heritage Tracker
 *
 * Usage:
 * import { buttonVariants, cardStyles } from '@/styles/designSystem'
 * className={buttonVariants.primary}
 */

// Button variants with modern styling
export const buttonVariants = {
  primary: `
    px-4 py-2 bg-[#009639] hover:bg-[#007b2f] text-white
    rounded-lg shadow-md hover:shadow-lg
    transition-all duration-200 font-semibold
    active:scale-95
  `,
  secondary: `
    px-4 py-2 border-2 border-[#009639] text-[#009639]
    hover:bg-[#009639] hover:text-white
    rounded-lg transition-all duration-200 font-semibold
  `,
  danger: `
    px-4 py-2 bg-[#ed3039] hover:bg-[#d4202a] text-white
    rounded-lg shadow-md hover:shadow-lg
    transition-all duration-200 font-semibold
    active:scale-95
  `,
  ghost: `
    px-4 py-2 text-gray-600 hover:bg-gray-100
    rounded-lg transition-colors duration-200 font-medium
  `,
} as const;

// Card styles for consistent container styling
export const cardStyles = {
  base: `
    bg-white rounded-xl shadow-md
    border border-gray-100 overflow-hidden
  `,
  hover: `
    bg-white rounded-xl shadow-md hover:shadow-lg
    transition-shadow duration-300
    border border-gray-100 overflow-hidden
  `,
  elevated: `
    bg-white rounded-xl shadow-lg
    border border-gray-100 overflow-hidden
  `,
} as const;

// Design system scale constants
export const designSystem = {
  // Spacing scale (Tailwind units for reference)
  spacing: {
    xs: '0.5',   // 2px - Tiny gaps
    sm: '1',     // 4px - Minimal spacing
    md: '2',     // 8px - Small spacing
    lg: '3',     // 12px - Default gap
    xl: '4',     // 16px - Standard padding
    '2xl': '6',  // 24px - Section spacing
    '3xl': '8',  // 32px - Large spacing
    '4xl': '12', // 48px - Major sections
  },

  // Border radius
  radius: {
    sm: 'rounded-sm',     // 2px - Subtle (tags, badges)
    md: 'rounded-md',     // 6px - Default (buttons, inputs)
    lg: 'rounded-lg',     // 8px - Cards, panels
    xl: 'rounded-xl',     // 12px - Large containers (maps)
    '2xl': 'rounded-2xl', // 16px - Modals, major sections
    full: 'rounded-full', // Pills, avatars
  },

  // Shadow system
  shadow: {
    sm: 'shadow-sm',       // Small elevation (cards, inputs)
    md: 'shadow-md',       // Medium elevation (dropdowns)
    lg: 'shadow-lg',       // Large elevation (maps, modals)
    xl: 'shadow-xl',       // Maximum elevation (overlays)
    '2xl': 'shadow-2xl',   // Hero elements
  },

  // Typography scale
  text: {
    xs: 'text-xs',         // 12px - Captions, labels
    sm: 'text-sm',         // 14px - Secondary text, table data
    base: 'text-base',     // 16px - Body text
    lg: 'text-lg',         // 18px - Subheadings
    xl: 'text-xl',         // 20px - Card titles
    '2xl': 'text-2xl',     // 24px - Section headings
    '3xl': 'text-3xl',     // 30px - Page title
  },

  // Font weights
  weight: {
    normal: 'font-normal',     // 400 - Body text
    medium: 'font-medium',     // 500 - Emphasis, labels
    semibold: 'font-semibold', // 600 - Subheadings, buttons
    bold: 'font-bold',         // 700 - Headings, important data
  },

  // Transitions
  transition: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-200',
    slow: 'transition-all duration-300',
  },
} as const;

// Helper to combine button variant with additional classes
export const withButtonVariant = (variant: keyof typeof buttonVariants, additionalClasses = '') => {
  return `${buttonVariants[variant]} ${additionalClasses}`.trim();
};

// Helper to combine card style with additional classes
export const withCardStyle = (style: keyof typeof cardStyles, additionalClasses = '') => {
  return `${cardStyles[style]} ${additionalClasses}`.trim();
};
