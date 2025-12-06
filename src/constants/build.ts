/**
 * Build and Deployment Constants
 * These values are dynamically set during the build/deployment process
 */

/**
 * Last deployment/build date
 * Dynamically set at build time via VITE_BUILD_DATE environment variable
 * Falls back to current date if not set in CI/CD pipeline
 *
 * Format: "Month Day, YYYY" (e.g., "December 6, 2025")
 *
 * @example
 * // In CI/CD pipeline (GitHub Actions, Vercel, Netlify, etc.):
 * VITE_BUILD_DATE=$(date +"%B %-d, %Y") npm run build
 *
 * // Or set in deployment platform environment variables:
 * VITE_BUILD_DATE="December 6, 2025"
 */
export const BUILD_DATE = import.meta.env.VITE_BUILD_DATE ||
  new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/**
 * Build version/commit hash (optional)
 * Can be set via VITE_BUILD_VERSION in CI/CD
 */
export const BUILD_VERSION = import.meta.env.VITE_BUILD_VERSION || undefined;
