import { useTheme } from "../../../contexts/ThemeContext";

/**
 * ContributingSection - How to contribute to the project
 */
export function ContributingSection() {
  const { isDark } = useTheme();

  return (
    <section className="mb-4 md:mb-6">
      <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
        How to Contribute
      </h2>
      <p className={`text-xs md:text-sm leading-relaxed mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
        We welcome contributions from researchers, heritage experts, developers, and community members:
      </p>
      <ul className={`list-disc list-inside text-xs md:text-sm space-y-1 ${isDark ? "text-white" : "text-gray-900"}`}>
        <li><strong>Verify information:</strong> Cross-reference data with additional sources</li>
        <li className="hidden md:list-item"><strong>Provide documentation:</strong> Share reports, imagery, or records</li>
        <li className="hidden md:list-item"><strong>Translate:</strong> Help make this available in Arabic and other languages</li>
        <li><strong>Report errors:</strong> Let us know with supporting evidence</li>
      </ul>
      <p className={`text-xs md:text-sm mt-2 ${isDark ? "text-white" : "text-gray-900"}`}>
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
