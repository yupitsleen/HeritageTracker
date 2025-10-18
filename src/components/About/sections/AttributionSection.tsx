import { useTheme } from "../../../contexts/ThemeContext";

/**
 * AttributionSection - Content attribution, methodology, and disclaimer
 */
export function AttributionSection() {
  const { isDark } = useTheme();

  return (
    <section className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} pt-4 md:pt-6`}>
      <p className={`text-[10px] md:text-xs ${isDark ? "text-gray-400" : "text-gray-500"} leading-relaxed mb-3`}>
        <strong>Content Attribution & Methodology:</strong> Site descriptions and historical
        information are original syntheses created by combining factual data from multiple
        verified sources. Research was conducted using publicly available reports from UNESCO,
        Forensic Architecture, Heritage for Peace, and other authoritative organizations. All
        factual claims (dates, coordinates, artifact counts, destruction dates) are
        cross-referenced against multiple sources and cited accordingly. Narrative descriptions
        are original summaries of publicly available information, not direct quotations.
        Research assistance provided by Claude (Anthropic).
      </p>
      <p className={`text-[10px] md:text-xs ${isDark ? "text-gray-400" : "text-gray-500"} leading-relaxed`}>
        <strong>Disclaimer:</strong> Heritage Tracker is an independent documentation project.
        All information is sourced from publicly available reports by UNESCO, Forensic
        Architecture, Heritage for Peace, and other reputable cultural heritage organizations.
        While we strive for accuracy, users should verify information through the original
        sources cited for each site. This project is for educational and research purposes and
        does not constitute legal advice or official policy positions.
      </p>
    </section>
  );
}
