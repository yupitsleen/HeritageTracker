import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * AboutHeader - Header section for About page
 */
export function AboutHeader() {
  const t = useThemeClasses();

  return (
    <div className="mb-4 md:mb-6 text-center">
      <h1 className={`text-xl md:text-3xl font-bold ${t.text.heading} mb-1.5`}>
        About Heritage Tracker
      </h1>
      <p className={`text-xs md:text-base ${t.text.muted}`}>
        Evidence-based documentation of Palestinian cultural heritage destruction
      </p>
    </div>
  );
}
