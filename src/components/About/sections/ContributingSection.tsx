import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * ContributingSection - How to contribute to the project
 */
export function ContributingSection() {
  const t = useThemeClasses();

  return (
    <section className="mb-4 md:mb-6">
      <h2 className={`text-base md:text-lg font-bold ${t.text.heading} mb-2 md:mb-3`}>
        How to Contribute
      </h2>
      <p className={`text-[10px] md:text-xs ${t.text.body} leading-relaxed mb-2`}>
        We welcome contributions from researchers, heritage experts, developers, and community members:
      </p>
      <ul className={`list-disc list-inside text-[10px] md:text-xs ${t.text.body} space-y-1`}>
        <li><strong>Verify information:</strong> Cross-reference data with additional sources</li>
        <li className="hidden md:list-item"><strong>Provide documentation:</strong> Share reports, imagery, or records</li>
        <li className="hidden md:list-item"><strong>Translate:</strong> Help make this available in Arabic and other languages</li>
        <li><strong>Report errors:</strong> Let us know with supporting evidence</li>
      </ul>
      <p className={`text-[10px] md:text-xs ${t.text.muted} mt-2`}>
        Contact:{" "}
        <a
          href="https://github.com/yupitsleen/HeritageTracker"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#009639] hover:underline font-medium"
        >
          GitHub Repository
        </a>
      </p>
    </section>
  );
}
