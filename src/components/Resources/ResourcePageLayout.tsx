import type { ReactNode } from "react";
import { SharedLayout } from "../Layout/SharedLayout";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface ResourcePageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Base layout component for all resource pages
 *
 * Provides consistent styling and structure:
 * - SharedLayout wrapper (header + footer)
 * - Container with max-width
 * - Theme-aware styling
 * - Consistent padding and spacing
 */
export function ResourcePageLayout({ title, description, children }: ResourcePageLayoutProps) {
  const { text, bg } = useThemeClasses();

  return (
    <SharedLayout>
      <div className={`container mx-auto px-4 py-6 pb-24 max-w-7xl ${bg} ${text}`}>
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-lg opacity-80">{description}</p>
          )}
        </header>

        {/* Page Content */}
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </SharedLayout>
  );
}
