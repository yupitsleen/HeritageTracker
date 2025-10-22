import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * DataSourcesSection - Information about primary data sources (UNESCO, Forensic Architecture, Heritage for Peace)
 */
export function DataSourcesSection() {
  const t = useThemeClasses();

  return (
    <section className="mb-4 md:mb-6">
      <h2 className={`text-base md:text-lg font-bold ${t.text.heading} mb-2 md:mb-3`}>Data Sources</h2>
      <div className="space-y-2 md:space-y-3">
        <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
          <h3 className={`text-xs md:text-sm font-bold ${t.text.heading} mb-1`}>UNESCO</h3>
          <p className={`text-[10px] md:text-xs ${t.text.body} leading-relaxed`}>
            UN agency providing official heritage damage assessments. Verified 110+ cultural sites in Gaza (Aug 2024).
          </p>
          <a
            href="https://www.unesco.org/en/gaza/assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#009639] hover:underline text-[10px] md:text-xs font-medium mt-1 inline-block"
          >
            View UNESCO Gaza Assessment →
          </a>
        </div>

        <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
          <h3 className={`text-xs md:text-sm font-bold ${t.text.heading} mb-1`}>
            Forensic Architecture
          </h3>
          <p className={`text-[10px] md:text-xs ${t.text.body} leading-relaxed`}>
            Investigative agency at Goldsmiths, University of London, using spatial analysis to document heritage destruction.
          </p>
          <a
            href="https://forensic-architecture.org/investigation/living-archaeology-in-gaza"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#009639] hover:underline text-[10px] md:text-xs font-medium mt-1 inline-block"
          >
            View Investigation →
          </a>
        </div>

        <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
          <h3 className={`text-xs md:text-sm font-bold ${t.text.heading} mb-1`}>
            Heritage for Peace
          </h3>
          <p className={`text-[10px] md:text-xs ${t.text.body} leading-relaxed`}>
            Nonprofit providing detailed documentation and damage assessments of heritage sites in conflict zones.
          </p>
        </div>
      </div>
    </section>
  );
}
