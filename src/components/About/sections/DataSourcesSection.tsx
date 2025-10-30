import { useTheme } from "../../../contexts/ThemeContext";
import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * DataSourcesSection - Information about primary data sources (UNESCO, Forensic Architecture, Heritage for Peace)
 */
export function DataSourcesSection() {
  const { isDark } = useTheme();
  const t = useThemeClasses();

  return (
    <section className="mb-4 md:mb-6">
      <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Data Sources</h2>
      <div className="space-y-2 md:space-y-3">
        <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
          <h3 className={`text-sm md:text-base font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>UNESCO</h3>
          <p className={`text-xs md:text-sm leading-relaxed ${isDark ? "text-white" : "text-gray-900"}`}>
            UN agency providing official heritage damage assessments. Verified 110+ cultural sites in Gaza (Aug 2024).
          </p>
          <a
            href="https://www.unesco.org/en/gaza/assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#009639] hover:underline text-xs md:text-sm font-medium mt-1 inline-block"
          >
            View UNESCO Gaza Assessment →
          </a>
        </div>

        <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
          <h3 className={`text-sm md:text-base font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            Forensic Architecture
          </h3>
          <p className={`text-xs md:text-sm leading-relaxed ${isDark ? "text-white" : "text-gray-900"}`}>
            Investigative agency at Goldsmiths, University of London, using spatial analysis to document heritage destruction.
          </p>
          <a
            href="https://forensic-architecture.org/investigation/living-archaeology-in-gaza"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#009639] hover:underline text-xs md:text-sm font-medium mt-1 inline-block"
          >
            View Investigation →
          </a>
        </div>

        <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
          <h3 className={`text-sm md:text-base font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            Heritage for Peace
          </h3>
          <p className={`text-xs md:text-sm leading-relaxed ${isDark ? "text-white" : "text-gray-900"}`}>
            Nonprofit providing detailed documentation and damage assessments of heritage sites in conflict zones.
          </p>
        </div>
      </div>
    </section>
  );
}
