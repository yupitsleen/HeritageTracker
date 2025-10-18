import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * AboutHeader - Header section for About page
 */
export function AboutHeader() {
  const t = useThemeClasses();

  return (
    <div className="mb-6 md:mb-8 text-center">
      <h1 className={`text-2xl md:text-4xl font-bold ${t.text.heading} mb-2`}>
        About Heritage Tracker
      </h1>
      <p className={`text-sm md:text-lg ${t.text.muted}`}>
        Evidence-based documentation of Palestinian cultural heritage destruction
      </p>
    </div>
  );
}
