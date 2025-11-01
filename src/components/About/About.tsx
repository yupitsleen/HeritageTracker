import { memo, useMemo } from "react";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import type { GazaSite } from "../../types";

interface AboutProps {
  sites: GazaSite[];
}

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
export const About = memo(function About({ sites }: AboutProps) {
  const t = useThemeClasses();

  // Calculate stats dynamically from site data
  const stats = useMemo(() => {
    const total = sites.length;
    const destroyed = sites.filter((s) => s.status === "destroyed").length;
    const damaged = sites.filter(
      (s) => s.status === "damaged" || s.status === "heavily-damaged"
    ).length;

    // Calculate oldest site age
    const parseAge = (yearBuilt: string): number => {
      const match = yearBuilt.match(/(\d+)\s*(BCE|BC|CE)?/);
      if (!match) return 0;
      const year = parseInt(match[1]);
      const isBCE = match[2] === "BCE" || match[2] === "BC";
      return isBCE ? year : 2025 - year;
    };
    const ages = sites.map((s) => parseAge(s.yearBuilt)).filter((age) => age > 0);
    const oldestSiteAge = Math.max(...ages, 0);

    return { total, destroyed, damaged, oldestSiteAge };
  }, [sites]);

  return (
    <div style={{ contain: "layout style paint" }}>
      <div className="p-3 md:p-6">
        {/* About Header */}
        <div className="mb-4 md:mb-6 text-center">
          <h1 className={`text-3xl md:text-4xl font-bold mb-1.5 ${t.text.heading}`}>
            About Heritage Tracker
          </h1>
          <p className={`text-sm md:text-lg ${t.text.body}`}>
            Evidence-based documentation of Palestinian cultural heritage destruction
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${t.text.heading}`}>
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
            Since October 2023, Gaza has witnessed both: over 45,000 Palestinians killed, with
            heritage sites systematically targeted—1,400-year-old mosques reduced to rubble, museums
            looted and demolished, libraries containing irreplaceable manuscripts burned. This is
            not collateral damage. This is the deliberate erasure of Palestinian existence from the
            land.
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

          <h3 className={`text-base md:text-lg font-bold mb-2 ${t.text.heading}`}>Our Mission</h3>
          <p className={`text-sm md:text-base leading-relaxed mb-2 md:mb-3 ${t.text.body}`}>
            Heritage Tracker documents this cultural destruction with forensic precision. We create
            an evidence-based record for international courts, historians, and humanity. Every site
            documented here is verified by UNESCO, Forensic Architecture, and Heritage for Peace.
            This is documentation of what international law defines as genocide.
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
          <h2 className={`text-3xl font-bold mb-4 ${t.text.heading}`}>Who's Responsible</h2>

          {/* Israeli Military Operations */}
          <div className={`${t.bg.tertiary} rounded-lg p-6 mb-4`}>
            <h3 className={`text-xl font-bold mb-3 ${t.text.heading}`}>Israel</h3>
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
                <strong>Scale:</strong> Beyond the heritage sites documented here, Israel has
                destroyed over 60% of all buildings in Gaza, displaced 90% of the population, killed
                over 45,000 Palestinians (70% women and children), and rendered the territory
                largely uninhabitable.
              </p>
            </div>
          </div>

          {/* United States Complicity */}
          <div className={`${t.bg.tertiary} rounded-lg p-6`}>
            <h3 className={`text-xl font-bold mb-3 ${t.text.heading}`}>United States</h3>
            <div className={`space-y-3 text-base ${t.text.body}`}>
              <p>
                The United States has provided critical material, financial, and political support
                enabling these operations, making it directly complicit in the destruction.
              </p>

              <div className="border-l-4 border-[#009639] pl-4 my-3">
                <p className={`text-sm mb-2 ${t.text.body}`}>
                  <strong>Material Support:</strong>
                </p>
                <ul className={`list-disc list-inside space-y-1 text-sm ${t.text.body}`}>
                  <li>
                    <strong>$18+ billion</strong> in military aid to Israel since October 2023
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

        {/* Methodology Section (desktop only) */}
        <section className="hidden md:block mb-6">
          <h2 className={`text-xl font-bold mb-3 ${t.text.heading}`}>Methodology</h2>
          <p className={`text-sm leading-relaxed mb-2 ${t.text.body}`}>
            Every site has been verified by authoritative sources. Requirements:
          </p>
          <ul className={`list-disc list-inside text-sm space-y-1 mb-3 ${t.text.body}`}>
            <li>
              <strong>Multiple verifications</strong> from UNESCO, Forensic Architecture, or
              Heritage for Peace
            </li>
            <li>
              <strong>Documented coordinates</strong> via satellite imagery or archaeological
              records
            </li>
            <li>
              <strong>Verified destruction dates</strong> with supporting evidence
            </li>
            <li>
              <strong>Published sources</strong> with URLs for transparency
            </li>
          </ul>
        </section>

        {/* Data Sources Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${t.text.heading}`}>
            Data Sources
          </h2>
          <div className="space-y-2 md:space-y-3">
            <div className={`border ${t.border.default} rounded-lg p-2 md:p-3`}>
              <h3 className={`text-sm md:text-base font-bold mb-1 ${t.text.heading}`}>UNESCO</h3>
              <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
                UN agency providing official heritage damage assessments. Verified 110+ cultural
                sites in Gaza (Aug 2024).
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
              <h3 className={`text-sm md:text-base font-bold mb-1 ${t.text.heading}`}>
                Forensic Architecture
              </h3>
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
              <h3 className={`text-sm md:text-base font-bold mb-1 ${t.text.heading}`}>
                Heritage for Peace
              </h3>
              <p className={`text-xs md:text-sm leading-relaxed ${t.text.body}`}>
                Nonprofit providing detailed documentation and damage assessments of heritage sites
                in conflict zones.
              </p>
            </div>
          </div>
        </section>

        {/* The Data Section (desktop only) */}
        <section className="hidden md:block mb-8">
          <h2 className={`text-3xl font-bold mb-4 ${t.text.heading}`}>The Data</h2>
          <div className={`${t.bg.tertiary} rounded-lg p-6 space-y-4`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#009639]">{stats.total}</div>
                <div className={`text-base ${t.text.body}`}>Sites Documented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ed3039]">{stats.destroyed}</div>
                <div className={`text-base ${t.text.body}`}>Completely Destroyed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ca8a04]">{stats.damaged}</div>
                <div className={`text-base ${t.text.body}`}>Damaged</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${t.text.heading}`}>
                  {stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) / 10}k` : "—"}
                </div>
                <div className={`text-base ${t.text.body}`}>Years of History</div>
              </div>
            </div>
            <p className={`text-base text-center mt-4 ${t.text.body}`}>
              As of January 2025 • {stats.total} documented heritage sites
            </p>
          </div>
        </section>

        {/* Research Section (desktop only) */}
        <section className="hidden md:block mb-6">
          <h2 className={`text-xl font-bold mb-3 ${t.text.heading}`}>Research & Data Collection</h2>
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
              <strong>Focus:</strong> 110 UNESCO-verified sites (May 2025). 64.7% of Gaza's 320
              archaeological sites damaged or destroyed.
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

        {/* Legal Framework Section (desktop only) */}
        <section className="hidden md:block mb-6">
          <h2 className={`text-xl font-bold mb-3 ${t.text.heading}`}>Legal & Ethical Framework</h2>
          <div className={`space-y-1.5 text-sm leading-relaxed ${t.text.body}`}>
            <p>
              <strong>Documentation:</strong> Factual information from verified sources.
            </p>
            <p>
              <strong>Attribution:</strong> All claims sourced with citations, dates, and URLs.
            </p>
            <p>
              <strong>Cultural sensitivity:</strong> Respectful documentation of Palestinian
              heritage.
            </p>
            <p>
              <strong>Educational purpose:</strong> Fair use for educational and historical
              documentation.
            </p>
            <p>
              <strong>Privacy:</strong> No personal data collected or stored.
            </p>
          </div>
        </section>

        {/* Contributing Section */}
        <section className="mb-4 md:mb-6">
          <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${t.text.heading}`}>
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

        {/* Acknowledgments Section (desktop only) */}
        <section className="hidden md:block mb-6">
          <h2 className={`text-xl font-bold mb-3 ${t.text.heading}`}>Acknowledgments</h2>
          <p className={`text-sm leading-relaxed ${t.text.body}`}>
            This project builds on work by UNESCO, Forensic Architecture, Heritage for Peace,
            Palestinian Museum, Institute for Palestine Studies, ICOM, and countless researchers and
            community members dedicated to documenting Palestinian cultural heritage.
          </p>
        </section>

        {/* Attribution Section */}
        <section className={`border-t ${t.border.default} pt-4 md:pt-6`}>
          <p className={`text-xs md:text-sm leading-relaxed mb-3 ${t.text.body}`}>
            <strong>Content Attribution & Methodology:</strong> Site descriptions and historical
            information are original syntheses created by combining factual data from multiple
            verified sources. Research was conducted using publicly available reports from UNESCO,
            Forensic Architecture, Heritage for Peace, and other authoritative organizations. All
            factual claims (dates, coordinates, artifact counts, destruction dates) are
            cross-referenced against multiple sources and cited accordingly. Narrative descriptions
            are original summaries of publicly available information, not direct quotations.
            Research assistance provided by Claude (Anthropic).
          </p>
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
