import type { ReactNode } from "react";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface ResourceSectionProps {
  title: string;
  children: ReactNode;
}

/**
 * Reusable section component for resource pages
 *
 * Provides consistent section styling with title and content area.
 */
export function ResourceSection({ title, children }: ResourceSectionProps) {
  const t = useThemeClasses();

  return (
    <section className="space-y-4">
      <h2 className={`text-2xl font-semibold ${t.text.heading}`}>{title}</h2>
      <div className="space-y-2">
        {children}
      </div>
    </section>
  );
}
