import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * MethodologySection - Research methodology and verification criteria (desktop only)
 */
export function MethodologySection() {
  const t = useThemeClasses();

  return (
    <section className="hidden md:block mb-6">
      <h2 className={`text-lg font-bold ${t.text.heading} mb-3`}>Methodology</h2>
      <p className={`text-xs ${t.text.body} leading-relaxed mb-2`}>
        Every site has been verified by authoritative sources. Requirements:
      </p>
      <ul className={`list-disc list-inside text-xs ${t.text.body} space-y-1 mb-3`}>
        <li><strong>Multiple verifications</strong> from UNESCO, Forensic Architecture, or Heritage for Peace</li>
        <li><strong>Documented coordinates</strong> via satellite imagery or archaeological records</li>
        <li><strong>Verified destruction dates</strong> with supporting evidence</li>
        <li><strong>Published sources</strong> with URLs for transparency</li>
      </ul>
    </section>
  );
}
