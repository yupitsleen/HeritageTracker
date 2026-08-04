import type { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { COLORS } from "../../config/colorThemes";

interface SharedLayoutProps {
  children: ReactNode;
  showFooter?: boolean; // Optional - some pages might not want footer
  /** Rendered in the header's top-left square (e.g. a collapsed sidebar's re-open button). */
  headerLeading?: ReactNode;
}

/**
 * SharedLayout - Consistent header, footer, and background for all pages
 *
 * Features:
 * - Palestinian flag red triangle background (desktop only)
 * - App header with navigation
 * - App footer with links
 * - Skip to content link for accessibility
 * - Donate now navigates to dedicated page at /donate for better performance
 */
export function SharedLayout({ children, showFooter = true, headerLeading }: SharedLayoutProps) {
  const { isDark } = useTheme();
  const t = useThemeClasses();

  // Determine if mobile based on page - DashboardPage passes isMobile prop, others assume desktop
  const isMobile = false; // Default to desktop for About/Stats/Donate pages

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className={`min-h-screen relative transition-colors duration-200 ${t.layout.appBackground}`}
    >
      {/* Skip to content link for keyboard navigation */}
      <a
        href="#main-content"
        className={t.layout.skipLink}
      >
        Skip to main content
      </a>

      {/* Palestinian Flag Red Triangle - Background Element (All pages, desktop only) */}
      {/* Z-index 0 to stay behind all content (footer=5, header=sticky, content=auto) */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-0 opacity-50 transition-colors duration-200"
        style={{
          width: '800px', // Extends from left edge
          height: '100vh',
          background: isDark ? COLORS.FLAG_RED_DARK : COLORS.FLAG_RED, // Muted red in dark mode
          clipPath: 'polygon(0 0, 0 100%, 800px 50%)',
        }}
        aria-hidden="true"
      />

      {/* Header with flag line */}
      <AppHeader leading={headerLeading} />

      {/* Main Content */}
      {/* Relative positioning creates stacking context above z-0 triangle */}
      <main id="main-content" className="relative">
        {children}
      </main>

      {/* Footer (optional) */}
      {showFooter && (
        <AppFooter isMobile={isMobile} />
      )}

    </div>
  );
}
