
/**
 * MethodologySection - Research methodology and verification criteria (desktop only)
 */
export function MethodologySection() {

  return (
    <section className="hidden md:block mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3">Methodology</h2>
      <p className="text-sm text-gray-900 leading-relaxed mb-2">
        Every site has been verified by authoritative sources. Requirements:
      </p>
      <ul className="list-disc list-inside text-sm text-gray-900 space-y-1 mb-3">
        <li><strong>Multiple verifications</strong> from UNESCO, Forensic Architecture, or Heritage for Peace</li>
        <li><strong>Documented coordinates</strong> via satellite imagery or archaeological records</li>
        <li><strong>Verified destruction dates</strong> with supporting evidence</li>
        <li><strong>Published sources</strong> with URLs for transparency</li>
      </ul>
    </section>
  );
}
