import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * ResearchSection - Research methodology and data collection details (desktop only)
 */
export function ResearchSection() {
  const t = useThemeClasses();

  return (
    <section className="hidden md:block mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3">Research & Data Collection</h2>
      <p className="text-sm text-gray-900 leading-relaxed mb-2">
        Comprehensive research (Oct 2025) synthesizing data from multiple authoritative sources.
      </p>
      <div className={`rounded-lg p-3 mb-3 ${t.bg.tertiary} ${t.border.default} border`}>
        <p className="text-sm text-gray-900 font-medium mb-1">
          <strong>Research:</strong> Claude (Anthropic) with project team
        </p>
        <p className="text-sm text-gray-900">
          Site descriptions are original syntheses of verified source data.
        </p>
      </div>
      <div className="space-y-1.5 text-sm text-gray-900 leading-relaxed">
        <p>
          <strong>Focus:</strong> 110 UNESCO-verified sites (May 2025). 64.7% of Gaza's 320 archaeological sites damaged or destroyed.
        </p>
        <p>
          <strong>Legal alignment:</strong> 1954 Hague Convention, Rome Statute (ICC), UN Resolution 2347.
        </p>
        <p>
          <strong>Full study:</strong> See{" "}
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
