import { useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { Modal } from "../Modal/Modal";
import { Z_INDEX } from "../../constants/layout";
import { COLORS } from "../../config/colorThemes";

interface SharedLayoutProps {
  children: ReactNode;
  showFooter?: boolean; // Optional - some pages might not want footer
}

/**
 * SharedLayout - Consistent header, footer, and background for all pages
 *
 * Features:
 * - White background with red vertical bar on left edge
 * - App header with navigation
 * - App footer with links
 * - Skip to content link for accessibility
 * - Help modal (shared across all pages)
 * - Donate now navigates to dedicated page at /donate for better performance
 */
export function SharedLayout({ children, showFooter = true }: SharedLayoutProps) {
  const { isDark } = useTheme();
  const t = useThemeClasses();

  // Modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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

      {/* Red Vertical Bar - Background Element (All pages) */}
      {/* Z-index 1250 to appear above header and footer for visual continuity */}
      <div
        className="fixed top-0 left-0 pointer-events-none transition-colors duration-200"
        style={{
          width: '48px', // Half inch (approx 48px)
          height: '100vh',
          background: isDark ? COLORS.FLAG_RED_DARK : COLORS.FLAG_RED, // Muted red in dark mode
          zIndex: Z_INDEX.RED_VERTICAL_LINE,
        }}
        aria-hidden="true"
      />

      {/* Header with flag line */}
      <AppHeader
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content */}
      {/* Relative positioning creates stacking context above z-0 triangle */}
      <main id="main-content" className={`relative ${isDark ? 'text-black' : ''}`}>
        {children}
      </main>

      {/* Footer (optional) */}
      {showFooter && (
        <AppFooter
          isMobile={isMobile}
        />
      )}

      {/* Help Modal (shared across all pages) */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        zIndex={Z_INDEX.MODAL_DROPDOWN}
      >
        <div className="p-6">
          <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>How to Use Heritage Tracker</h2>

          <div className={`space-y-4 ${t.text.body}`}>
            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Overview</h3>
              <p className="text-sm">
                Heritage Tracker documents 70 cultural heritage sites in Gaza (representing 140-160 buildings) that have been damaged or destroyed.
                Use the interactive map, timeline, and filters to explore the data.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Navigation</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li><strong>Statistics:</strong> View comprehensive statistics and charts</li>
                <li><strong>About:</strong> Learn about the project, methodology, and data sources</li>
                <li><strong>Timeline:</strong> Explore satellite imagery over time</li>
                <li><strong>Help Palestine:</strong> Support relief efforts</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Interactive Features</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li><strong>Map:</strong> Click markers to view site details</li>
                <li><strong>Timeline:</strong> Click dots to highlight sites destroyed on specific dates</li>
                <li><strong>Table:</strong> Sort and filter the complete dataset</li>
                <li><strong>Filters:</strong> Filter by site type, status, and date range</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Keyboard Navigation</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li><strong>Tab:</strong> Navigate between interactive elements</li>
                <li><strong>Enter/Space:</strong> Activate buttons and links</li>
                <li><strong>Escape:</strong> Close modals and dialogs</li>
              </ul>
            </section>
          </div>
        </div>
      </Modal>
    </div>
  );
}
