import { memo } from "react";
import { useThemeClasses } from "../../hooks/useThemeClasses";

/**
 * About/Methodology page explaining the project's purpose, data sources, and verification process
 * Establishes credibility and transparency for the Heritage Tracker project
 * Supports dark mode
 *
 * Performance optimizations:
 * - Consolidated from 11 separate section files into single component
 * - Added CSS containment for better scroll performance
 * - Memoized component to prevent unnecessary re-renders
 * - Uses semantic theme classes for cleaner, more maintainable styling
 */
export const About = memo(function About() {
  const t = useThemeClasses();

  return (
    <div style={{ contain: "layout style paint" }}>
      <div className="p-3 md:p-6">
        {/* About Header */}
        <div className="mb-4 md:mb-6 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold mb-1.5 ${t.text.heading}`}>
            About Heritage Tracker
          </h1>
        </div>

        {/* Mission Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 text-center ${t.text.heading}`}>
            Understanding Genocide
          </h2>

          <p className={`text-sm md:text-base leading-relaxed mb-2 md:mb-3 ${t.text.body}`}>
            Genocide is not only the mass killing of a people—it is the systematic eradication of
            their existence from history. The 1948 UN Genocide Convention explicitly recognizes that
            destroying a group's cultural and religious heritage constitutes genocide. When you
            destroy a people's mosques, churches, museums, libraries, and ancient sites, you attempt
            to erase proof they ever existed.
          </p>

          <p className={`text-sm md:text-base leading-relaxed mb-3 md:mb-4 ${t.text.body}`}>
            Since October 2023, Gaza has witnessed both: over 70,000 Palestinians killed by January
            2025 (independent research estimates exceed 100,000), with heritage sites systematically
            targeted—1,400-year-old mosques reduced to rubble, museums looted and demolished,
            libraries containing irreplaceable manuscripts burned. This is not collateral damage.
            This is the deliberate erasure of Palestinian existence from the land.
          </p>

          <div className={`${t.bg.tertiary} border-l-4 border-[#ed3039] p-2 md:p-3 rounded mb-3`}>
            <p className={`text-xs md:text-sm font-semibold mb-1 ${t.text.body}`}>
              UN Genocide Convention, Article II(e):
            </p>
            <p className={`text-xs md:text-sm italic ${t.text.body}`}>
              Genocide includes "deliberately inflicting on the group conditions of life calculated
              to bring about its physical destruction in whole or in part" and acts committed with
              "intent to destroy, in whole or in part, a national, ethnical, racial or religious
              group."
            </p>
          </div>

          <h3 className={`text-base md:text-lg font-bold mb-2 text-center ${t.text.heading}`}>
            Our Mission
          </h3>
          <p className={`text-sm md:text-base leading-relaxed mb-2 md:mb-3 ${t.text.body}`}>
            This tool visualizes cultural heritage destruction in Gaza using satellite imagery and
            verified data from UNESCO and other authoritative sources.
          </p>
          <p className={`text-sm md:text-base leading-relaxed mb-2 md:mb-3 ${t.text.body}`}>
            It's not a complete archive. It shows what happened to specific sites—where they were,
            when they were destroyed, what they looked like before and after. The satellite maps
            also let you explore the broader context and surrounding areas.
          </p>
          <p className={`text-sm md:text-base leading-relaxed mb-2 md:mb-3 ${t.text.body}`}>
            The goal is to make the scale visible. Maps show locations. Timelines show progression.
            Comparisons show change.
          </p>

          <div className={`${t.bg.tertiary} border-l-4 border-[#009639] p-2 md:p-3 rounded`}>
            <p className={`text-xs md:text-sm font-medium ${t.text.body}`}>
              "The destruction of cultural heritage is tantamount to the destruction of the people
              themselves, as heritage forms an integral part of their identity and history." —
              International Criminal Court
            </p>
          </div>
        </section>

        {/* Responsibility Section */}
        <section className="mb-8">
          <h2 className={`text-3xl font-bold mb-4 text-center ${t.text.heading}`}>
            Who's Responsible
          </h2>

          {/* Israeli Military Operations */}
          <div className={`${t.bg.tertiary} rounded-lg p-6 mb-4`}>
            <h3 className={`text-xl font-bold mb-3 text-center ${t.text.heading}`}>Israel</h3>
            <div className={`space-y-3 text-base ${t.text.body}`}>
              <p>
                The Israeli military has conducted systematic bombing campaigns across Gaza since
                October 2023, resulting in widespread destruction of civilian infrastructure and
                cultural heritage sites. International law experts and UN officials have documented
                numerous violations of the laws of war.
              </p>

              <div className="border-l-4 border-[#ed3039] pl-4 my-3">
                <p className={`text-sm mb-2 ${t.text.body}`}>
                  <strong>Legal Framework:</strong>
                </p>
                <ul className={`list-disc list-inside space-y-1 text-sm ${t.text.body}`}>
                  <li>
                    <strong>1954 Hague Convention:</strong> Prohibits deliberate targeting of
                    cultural property during armed conflict
                  </li>
                  <li>
                    <strong>Rome Statute Article 8(2)(b)(ix):</strong> Intentionally directing
                    attacks against cultural heritage constitutes a war crime
                  </li>
                  <li>
                    <strong>UN Genocide Convention Article II(e):</strong> Destruction of cultural
                    heritage as part of destroying a group's identity
                  </li>
                </ul>
              </div>

              <p>
                <strong>Documented Patterns:</strong> Satellite imagery, witness testimony, and
                forensic analysis show deliberate targeting of mosques, churches, museums,
                libraries, and archaeological sites—many with no military presence or justification.
                UNESCO, Human Rights Watch, and Amnesty International have all documented these
                destructions.
              </p>

              <p>
                <strong>Scale:</strong> Beyond the heritage sites documented here, Israel destroyed
                over 60% of all buildings in Gaza, displaced 90% of the population, killed over
                70,000 Palestinians by January 2025 (70% women and children; independent research
                estimates exceed 100,000), and rendered the territory largely uninhabitable.
              </p>

              <p>
                <strong>International Legal Actions:</strong> The International Court of Justice
                ordered Israel to prevent genocide in January 2024. The International Criminal Court
                issued arrest warrants for Israeli Prime Minister Benjamin Netanyahu and former
                Defense Minister Yoav Gallant in November 2024 for war crimes and crimes against
                humanity.
              </p>

              <p>
                <strong>Historical Context:</strong> The destruction of Palestinian heritage is not
                new. During the 1948 Nakba ("catastrophe"), over 400 Palestinian villages were
                depopulated and destroyed. Cultural erasure has continued for decades—renaming
                sites, demolishing historic buildings, destroying archives, and replacing
                Palestinian place names on maps. What's happening in Gaza is an intensification of a
                long-standing pattern.
              </p>
            </div>
          </div>

          {/* United States Complicity */}
          <div className={`${t.bg.tertiary} rounded-lg p-6`}>
            <h3 className={`text-xl font-bold mb-3 text-center ${t.text.heading}`}>
              United States
            </h3>
            <div className={`space-y-3 text-base ${t.text.body}`}>
              <p>
                The United States provided critical material, financial, and political support
                enabling these operations between October 2023 and January 2025, making it directly
                complicit in the destruction.
              </p>

              <div className="border-l-4 border-[#009639] pl-4 my-3">
                <p className={`text-sm mb-2 ${t.text.body}`}>
                  <strong>Material Support:</strong>
                </p>
                <ul className={`list-disc list-inside space-y-1 text-sm ${t.text.body}`}>
                  <li>
                    <strong>$18+ billion</strong> in military aid to Israel between October 2023 and
                    January 2025
                  </li>
                  <li>
                    <strong>Weapons transfers:</strong> 2,000-pound bombs, F-35 fighter jets,
                    artillery shells, and precision-guided munitions
                  </li>
                  <li>
                    <strong>Emergency resupply:</strong> Multiple expedited weapons deliveries
                    bypassing normal Congressional review
                  </li>
                  <li>
                    <strong>Intelligence sharing:</strong> Satellite imagery, targeting data, and
                    operational support
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-[#009639] pl-4 my-3">
                <p className={`text-sm mb-2 ${t.text.body}`}>
                  <strong>Political Support:</strong>
                </p>
                <ul className={`list-disc list-inside space-y-1 text-sm ${t.text.body}`}>
                  <li>
                    <strong>UN Security Council:</strong> Vetoed multiple ceasefire resolutions
                  </li>
                  <li>
                    <strong>ICC obstruction:</strong> Threatened sanctions against International
                    Criminal Court prosecutors investigating war crimes
                  </li>
                  <li>
                    <strong>Diplomatic cover:</strong> Blocked international intervention and
                    accountability measures
                  </li>
                  <li>
                    <strong>Leahy Law violations:</strong> Continued aid despite credible reports of
                    gross human rights violations
                  </li>
                </ul>
              </div>

              <p>
                <strong>Legal Implications:</strong> Under international law, providing weapons and
                material support with knowledge they will be used for war crimes creates complicity.
                The US obligation to prevent genocide (established in the Genocide Convention) is
                violated by actively enabling it.
              </p>

              <p>
                <strong>Historical Pattern:</strong> This support continues a decades-long pattern
                of unconditional US military aid to Israel totaling over $260 billion, enabling
                systematic displacement, occupation, and now the destruction documented here.
              </p>
            </div>
          </div>

          {/* Accountability Note */}
          <div className={`mt-4 p-4 rounded-lg ${t.bg.tertiary} border-l-4 border-[#ed3039]`}>
            <p className={`text-sm ${t.text.body}`}>
              <strong>Note on Documentation:</strong> This project documents verifiable heritage
              destruction using authoritative sources (UNESCO, Forensic Architecture, Heritage for
              Peace). Attribution of responsibility is based on documented military operations,
              weapons transfers, and established legal frameworks. All claims are evidenced and
              citations are provided throughout the site.
            </p>
          </div>
        </section>

        {/* Data Sources Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 text-center ${t.text.heading}`}>
            Data Sources
          </h2>

          <div className={`${t.bg.tertiary} border-l-4 border-[#009639] p-3 rounded mb-3`}>
            <p className={`text-xs md:text-sm font-medium ${t.text.body}`}>
              "The deliberate destruction of cultural heritage is an attack on humanity itself." —
              UNESCO
            </p>
          </div>

          <h3 className={`text-base md:text-lg font-semibold mb-2 ${t.text.heading}`}>
            Heritage Documentation
          </h3>
          <div className="space-y-2 md:space-y-3 mb-4">
            <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
              <h4 className={`text-sm md:text-base font-bold mb-1 text-center ${t.text.heading}`}>
                UNESCO
              </h4>
              <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
                UN agency providing official heritage damage assessments. Verified 114 cultural
                sites in Gaza (Oct 2024).
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
              <h4 className={`text-sm md:text-base font-bold mb-1 text-center ${t.text.heading}`}>
                Forensic Architecture
              </h4>
              <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
                Investigative agency at Goldsmiths, University of London, using spatial analysis to
                document heritage destruction.
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
              <h4 className={`text-sm md:text-base font-bold mb-1 text-center ${t.text.heading}`}>
                Heritage for Peace
              </h4>
              <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
                Nonprofit providing detailed documentation and damage assessments of heritage sites
                in conflict zones.
              </p>
            </div>
          </div>

          <h3 className={`text-base md:text-lg font-semibold mb-2 ${t.text.heading}`}>
            Casualty & Humanitarian Data
          </h3>
          <div className="space-y-2 md:space-y-3">
            <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
              <h4 className={`text-sm md:text-base font-bold mb-1 text-center ${t.text.heading}`}>
                UN Office for the Coordination of Humanitarian Affairs (OCHA)
              </h4>
              <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
                Official UN agency coordinating humanitarian response and verifying casualty data
                from Gaza Ministry of Health.
              </p>
              <a
                href="https://www.ochaopt.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#009639] hover:underline text-xs md:text-sm font-medium mt-1 inline-block"
              >
                View OCHA Reports →
              </a>
            </div>

            <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
              <h4 className={`text-sm md:text-base font-bold mb-1 text-center ${t.text.heading}`}>
                UNRWA (UN Relief and Works Agency)
              </h4>
              <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
                UN agency providing humanitarian assistance and documenting the impact on
                Palestinian refugees in Gaza.
              </p>
              <a
                href="https://www.unrwa.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#009639] hover:underline text-xs md:text-sm font-medium mt-1 inline-block"
              >
                View UNRWA Reports →
              </a>
            </div>

            <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
              <h4 className={`text-sm md:text-base font-bold mb-1 text-center ${t.text.heading}`}>
                Gaza Ministry of Health
              </h4>
              <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
                Primary source for casualty data, verified by WHO, UN OCHA, and international
                humanitarian organizations. Historical data accuracy confirmed by independent
                studies.
              </p>
            </div>
          </div>
        </section>

        {/* Research Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 text-center ${t.text.heading}`}>
            Research & Data Collection
          </h2>
          <p className={`text-sm leading-relaxed mb-2 ${t.text.body}`}>
            Comprehensive research (Oct 2025) synthesizing data from multiple authoritative sources.
          </p>
          <div className={`rounded-lg p-3 mb-3 ${t.bg.tertiary} ${t.border.default} border`}>
            <p className={`text-sm font-medium mb-1 ${t.text.body}`}>
              <strong>Research:</strong> Claude (Anthropic) with project team
            </p>
            <p className={`text-sm ${t.text.body}`}>
              Site descriptions are original syntheses of verified source data.
            </p>
          </div>
          <div className={`space-y-1.5 text-sm leading-relaxed ${t.text.body}`}>
            <p>
              <strong>Focus:</strong> 114 UNESCO-verified sites (Oct 2024). 64.7% of Gaza's 320
              archaeological sites damaged or destroyed. Currently documenting 70 sites
              (representing 140-160 buildings).
            </p>
            <p>
              <strong>Legal alignment:</strong> 1954 Hague Convention, Rome Statute (ICC), UN
              Resolution 2347.
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

        {/* Contributing Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 text-center ${t.text.heading}`}>
            How to Contribute
          </h2>
          <p className={`text-xs md:text-sm leading-relaxed mb-2 ${t.text.body}`}>
            We welcome contributions from researchers, heritage experts, developers, and community
            members:
          </p>
          <ul className={`list-disc list-inside text-xs md:text-sm space-y-1 ${t.text.body}`}>
            <li>
              <strong>Verify information:</strong> Cross-reference data with additional sources
            </li>
            <li className="hidden md:list-item">
              <strong>Provide documentation:</strong> Share reports, imagery, or records
            </li>
            <li className="hidden md:list-item">
              <strong>Translate:</strong> Help make this available in Arabic and other languages
            </li>
            <li>
              <strong>Report errors:</strong> Let us know with supporting evidence
            </li>
          </ul>
          <p className={`text-xs md:text-sm mt-2 ${t.text.body}`}>
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

        {/* Using Heritage Tracker Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 text-center ${t.text.heading}`}>
            Using Heritage Tracker
          </h2>
          <p className={`text-sm leading-relaxed mb-2 ${t.text.body}`}>
            Different audiences can use Heritage Tracker for various purposes. Click the "?" help
            button on any page for detailed instructions on using that page's features.
          </p>

          <div className={`${t.bg.tertiary} p-3 rounded-lg space-y-3`}>
            <div>
              <h3 className={`text-base font-semibold mb-1.5 ${t.text.subheading}`}>
                For Researchers
              </h3>
              <ul className={`list-disc list-inside space-y-1 text-sm ${t.text.body}`}>
                <li>Use GeoJSON export for spatial analysis in QGIS or ArcGIS</li>
                <li>
                  Filter by site type to focus on specific categories (e.g., all UNESCO-listed
                  sites)
                </li>
                <li>Compare satellite imagery dates to document destruction timeline</li>
                <li>Export filtered results to share specific subsets of data</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-base font-semibold mb-1.5 ${t.text.subheading}`}>
                For Advocates
              </h3>
              <ul className={`list-disc list-inside space-y-1 text-sm ${t.text.body}`}>
                <li>Use Timeline page to create compelling before/after comparisons</li>
                <li>Share direct links to specific sites for targeted campaigns</li>
                <li>Export to CSV for reports and presentations</li>
                <li>Cite sources directly from each site's detail view</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-base font-semibold mb-1.5 ${t.text.subheading}`}>
                For Educators
              </h3>
              <ul className={`list-disc list-inside space-y-1 text-sm ${t.text.body}`}>
                <li>Use map view to show geographic distribution of sites</li>
                <li>Timeline mode demonstrates scale and timeline of destruction</li>
                <li>Stats page provides context on broader humanitarian impact</li>
                <li>About page explains verification methodology and legal frameworks</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Comparative Scale - If This Were Your City */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 text-center ${t.text.heading}`}>
            If This Were Your City
          </h2>
          <p className={`text-sm md:text-base mb-3 ${t.text.body}`}>
            Gaza's heritage destruction, proportionally applied to other cities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>Rome</h3>
              <p className={`text-xs md:text-sm mb-2 ${t.text.body}`}>
                The Pantheon, Colosseum, and 8 medieval churches—destroyed in 14 months.
              </p>
              <p className={`text-xs italic ${t.text.body}`}>Equivalent to Gaza's losses</p>
            </div>
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>Paris</h3>
              <p className={`text-xs md:text-sm mb-2 ${t.text.body}`}>
                Notre-Dame, Sainte-Chapelle, The Louvre, and 12 historic churches—leveled.
              </p>
              <p className={`text-xs italic ${t.text.body}`}>Equivalent to Gaza's losses</p>
            </div>
            <div className={`${t.bg.tertiary} border ${t.border.default} rounded-lg p-3`}>
              <h3 className={`text-sm md:text-base font-bold mb-2 ${t.text.heading}`}>New York</h3>
              <p className={`text-xs md:text-sm mb-2 ${t.text.body}`}>
                St. Patrick's Cathedral, Trinity Church, The Met, MoMA, and colonial-era
                sites—erased.
              </p>
              <p className={`text-xs italic ${t.text.body}`}>Equivalent to Gaza's losses</p>
            </div>
          </div>
        </section>

        {/* Acknowledgments Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 text-center ${t.text.heading}`}>
            Acknowledgments
          </h2>
          <p className={`text-sm leading-relaxed ${t.text.body}`}>
            This project builds on work by UNESCO, Forensic Architecture, Heritage for Peace,
            Palestinian Museum, Institute for Palestine Studies, ICOM, and countless researchers and
            community members dedicated to documenting Palestinian cultural heritage.
          </p>
        </section>

        {/* Disclaimer Section */}
        <section className={`border-t ${t.border.default} pt-4 md:pt-6`}>
          <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
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
});
