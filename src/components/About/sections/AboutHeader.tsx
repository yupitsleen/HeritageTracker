import { useTheme } from "../../../contexts/ThemeContext";

/**
 * AboutHeader - Header section for About page
 */
export function AboutHeader() {
  const { isDark } = useTheme();

  return (
    <div className="mb-4 md:mb-6 text-center">
      <h1 className={`text-3xl md:text-4xl font-bold mb-1.5 ${isDark ? "text-white" : "text-gray-900"}`}>
        About Heritage Tracker
      </h1>
      <p className={`text-sm md:text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
        Evidence-based documentation of Palestinian cultural heritage destruction
      </p>
    </div>
  );
}
