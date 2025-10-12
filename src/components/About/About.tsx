/**
 * About/Methodology page explaining the project's purpose, data sources, and verification process
 * Establishes credibility and transparency for the Heritage Tracker project
 */
export function About() {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-white">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            About Heritage Tracker
          </h1>
          <p className="text-sm md:text-lg text-gray-600">
            Evidence-based documentation of Palestinian cultural heritage destruction
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Mission</h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
            Heritage Tracker documents the systematic destruction of Palestinian cultural heritage
            sites in Gaza during the genocide, paticularly in 2023-2024 (this time range will be
            expanded. The range is only meant to limit the scope while the app's MVP is being
            developed). Our goal is to create a transparent, evidence-based record that serves
            researchers, legal advocates, journalists, educators, and the global public.
          </p>
          <div className="bg-gray-50 border-l-4 border-[#009639] p-3 md:p-4 rounded">
            <p className="text-xs md:text-base text-gray-800 font-medium">
              "Cultural heritage belongs to all of humanity. Its destruction is everyone's loss."
            </p>
          </div>
        </section>

        {/* Methodology Section - Desktop only */}
        <section className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Methodology</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every site in this database has been verified by multiple authoritative sources. We only
            include sites with:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>
              <strong>Multiple independent verifications</strong> from UNESCO, Forensic
              Architecture, or Heritage for Peace
            </li>
            <li>
              <strong>Documented coordinates</strong> (satellite imagery or archaeological records)
            </li>
            <li>
              <strong>Verified destruction dates</strong> with supporting evidence
            </li>
            <li>
              <strong>Published sources</strong> with URLs and dates for full transparency
            </li>
            <li>
              <strong>Historical significance</strong> documented by cultural heritage experts
            </li>
          </ul>
        </section>

        {/* Data Sources Section */}
        <section className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Data Sources</h2>
          <div className="space-y-3 md:space-y-4">
            <div className="border border-gray-200 rounded-lg p-3 md:p-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 md:mb-2">UNESCO</h3>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                The United Nations Educational, Scientific and Cultural Organization provides
                official heritage damage assessments using satellite imagery and ground
                verification. UNESCO has verified damage to 110+ cultural sites in Gaza as of August
                2024.
              </p>
              <a
                href="https://www.unesco.org/en/gaza/assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#009639] hover:underline text-xs md:text-sm font-medium mt-1 md:mt-2 inline-block"
              >
                View UNESCO Gaza Assessment →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-3 md:p-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 md:mb-2">
                Forensic Architecture
              </h3>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                An investigative journalism agency at Goldsmiths, University of London, that uses
                spatial analysis and open-source data to document human rights violations and
                cultural heritage destruction.
              </p>
              <a
                href="https://forensic-architecture.org/investigation/living-archaeology-in-gaza"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#009639] hover:underline text-xs md:text-sm font-medium mt-1 md:mt-2 inline-block"
              >
                View Living Archaeology Investigation →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-3 md:p-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 md:mb-2">
                Heritage for Peace
              </h3>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                A nonprofit organization dedicated to protecting cultural heritage in conflict
                zones. They provide detailed documentation and preliminary damage assessments of
                heritage sites in Gaza.
              </p>
            </div>
          </div>
        </section>

        {/* The Data Section - Desktop only */}
        <section className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Data</h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#009639]">18</div>
                <div className="text-sm text-gray-600">Sites Documented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ed3039]">10</div>
                <div className="text-sm text-gray-600">Completely Destroyed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ca8a04]">8</div>
                <div className="text-sm text-gray-600">Damaged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700">1,700+</div>
                <div className="text-sm text-gray-600">Years of History</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              As of October 2025 • 18 of 20-25 priority sites documented
            </p>
          </div>
        </section>

        {/* Research Methodology - Desktop only */}
        <section className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Research & Data Collection</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This project is built on comprehensive research conducted in October 2025, synthesizing
            data from multiple authoritative sources to create an evidence-based documentation
            platform.
          </p>
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-800 font-medium mb-2">
              <strong>Research conducted by:</strong> Claude (Anthropic) in collaboration with
              project team
            </p>
            <p className="text-sm text-gray-700">
              All site descriptions are original syntheses combining factual data from multiple
              verified sources. Narrative descriptions are original summaries of publicly available
              information, not direct quotations.
            </p>
          </div>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
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

        {/* Legal & Ethical Framework - Desktop only */}
        <section className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal & Ethical Framework</h2>
          <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
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

        {/* Contributing Section */}
        <section className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
            How to Contribute
          </h2>
          <p className="text-xs md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
            We welcome contributions from researchers, cultural heritage experts, software
            developers, and community members:
          </p>
          <ul className="list-disc list-inside text-xs md:text-base text-gray-700 space-y-1 md:space-y-2">
            <li>
              <strong>Verify information:</strong> Help us cross-reference data with additional
              sources
            </li>
            <li className="hidden md:list-item">
              <strong>Provide documentation:</strong> Share published reports, satellite imagery, or
              archaeological records
            </li>
            <li className="hidden md:list-item">
              <strong>Translate content:</strong> Help make this resource available in Arabic and
              other languages
            </li>
            <li>
              <strong>Report errors:</strong> If you find inaccuracies, please let us know with
              supporting evidence
            </li>
          </ul>
          <p className="text-xs md:text-sm text-gray-600 mt-3 md:mt-4">
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

        {/* Acknowledgments - Desktop only */}
        <section className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acknowledgments</h2>
          <p className="text-gray-700 leading-relaxed">
            This project builds on the essential work of UNESCO, Forensic Architecture, Heritage for
            Peace, the Palestinian Museum, Institute for Palestine Studies, ICOM, and countless
            researchers, archaeologists, and community members who have dedicated themselves to
            documenting and preserving Palestinian cultural heritage.
          </p>
        </section>

        {/* Content Attribution & Methodology */}
        <section className="border-t border-gray-200 pt-4 md:pt-6">
          <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed mb-3">
            <strong>Content Attribution & Methodology:</strong> Site descriptions and historical
            information are original syntheses created by combining factual data from multiple
            verified sources. Research was conducted using publicly available reports from UNESCO,
            Forensic Architecture, Heritage for Peace, and other authoritative organizations. All
            factual claims (dates, coordinates, artifact counts, destruction dates) are
            cross-referenced against multiple sources and cited accordingly. Narrative descriptions
            are original summaries of publicly available information, not direct quotations.
            Research assistance provided by Claude (Anthropic).
          </p>
          <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed">
            <strong>Disclaimer:</strong> Heritage Tracker is an independent documentation project.
            All information is sourced from publicly available reports by UNESCO, Forensic
            Architecture, Heritage for Peace, and other reputable cultural heritage organizations.
            While we strive for accuracy, users should verify information through the original
            sources cited for each site. This project is for educational and research purposes and
            does not constitute legal advice or official policy positions.
          </p>
        </section>
      </div>
    </div>
  );
}
