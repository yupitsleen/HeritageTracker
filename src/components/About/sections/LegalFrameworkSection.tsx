import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * LegalFrameworkSection - Legal and ethical framework (desktop only)
 */
export function LegalFrameworkSection() {
  const t = useThemeClasses();

  return (
    <section className="hidden md:block mb-6">
      <h2 className={`text-lg font-bold ${t.text.heading} mb-3`}>Legal & Ethical Framework</h2>
      <div className={`space-y-1.5 ${t.text.body} text-xs leading-relaxed`}>
        <p><strong>Documentation:</strong> Factual information from verified sources.</p>
        <p><strong>Attribution:</strong> All claims sourced with citations, dates, and URLs.</p>
        <p><strong>Cultural sensitivity:</strong> Respectful documentation of Palestinian heritage.</p>
        <p><strong>Educational purpose:</strong> Fair use for educational and historical documentation.</p>
        <p><strong>Privacy:</strong> No personal data collected or stored.</p>
      </div>
    </section>
  );
}
