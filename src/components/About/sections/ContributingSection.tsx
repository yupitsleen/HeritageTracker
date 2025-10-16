/**
 * ContributingSection - How to contribute to the project
 */
export function ContributingSection() {
  return (
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
  );
}
