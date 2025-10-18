import { useTheme } from "../../../contexts/ThemeContext";

/**
 * ResearchSection - Research methodology and data collection details (desktop only)
 */
export function ResearchSection() {
  const { isDark } = useTheme();

  return (
    <section className="hidden md:block mb-8">
      <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}>Research & Data Collection</h2>
      <p className={`${isDark ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-4`}>
        This project is built on comprehensive research conducted in October 2025, synthesizing
        data from multiple authoritative sources to create an evidence-based documentation
        platform.
      </p>
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
        <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"} font-medium mb-2`}>
          <strong>Research conducted by:</strong> Claude (Anthropic) in collaboration with
          project team
        </p>
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          All site descriptions are original syntheses combining factual data from multiple
          verified sources. Narrative descriptions are original summaries of publicly available
          information, not direct quotations.
        </p>
      </div>
      <div className={`space-y-3 text-sm ${isDark ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
        <p>
          <strong>MVP Focus:</strong> 110 sites officially verified by UNESCO (as of May 2025),
          with 64.7% of Gaza's 320 archaeological sites damaged or destroyed.
        </p>
        <p>
          <strong>Legal Framework:</strong> Documentation aligns with the 1954 Hague Convention,
          Rome Statute (ICC), and UN Security Council Resolution 2347 (2017).
        </p>
        <p>
          <strong>Full Research Study:</strong> For complete methodology, historical context,
          legal frameworks, and future expansion plans, see the{" "}
          <a
            href="https://github.com/yupitsleen/HeritageTracker/blob/main/docs/research/research_document.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#009639] hover:underline font-medium"
          >
            research documentation
          </a>
          .
        </p>
      </div>
    </section>
  );
}
