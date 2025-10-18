import { useTheme } from "../../../contexts/ThemeContext";

/**
 * AboutHeader - Header section for About page
 */
export function AboutHeader() {
  const { isDark } = useTheme();

  return (
    <div className="mb-6 md:mb-8 text-center">
      <h1 className={`text-2xl md:text-4xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
        About Heritage Tracker
      </h1>
      <p className={`text-sm md:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        Evidence-based documentation of Palestinian cultural heritage destruction
      </p>
    </div>
  );
}
