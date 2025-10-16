/**
 * DataSourcesSection - Information about primary data sources (UNESCO, Forensic Architecture, Heritage for Peace)
 */
export function DataSourcesSection() {
  return (
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
  );
}
