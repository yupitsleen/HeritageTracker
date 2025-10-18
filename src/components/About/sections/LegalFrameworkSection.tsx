import { useTheme } from "../../../contexts/ThemeContext";

/**
 * LegalFrameworkSection - Legal and ethical framework (desktop only)
 */
export function LegalFrameworkSection() {
  const { isDark } = useTheme();

  return (
    <section className="hidden md:block mb-8">
      <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}>Legal & Ethical Framework</h2>
      <div className={`space-y-3 ${isDark ? "text-gray-300" : "text-gray-700"} text-sm leading-relaxed`}>
        <p>
          <strong>Documentation:</strong> This project presents factual information from
          verified sources.
        </p>
        <p>
          <strong>Full attribution:</strong> Every claim is sourced with citations, dates, and
          URLs for independent verification.
        </p>
        <p>
          <strong>Cultural sensitivity:</strong> We approach this documentation with respect for
          Palestinian heritage and the communities affected by these losses.
        </p>
        <p>
          <strong>Educational purpose:</strong> All content is used under fair use principles
          for educational and historical documentation purposes.
        </p>
        <p>
          <strong>No personal data:</strong> This project does not collect or store any personal
          information about visitors.
        </p>
      </div>
    </section>
  );
}
