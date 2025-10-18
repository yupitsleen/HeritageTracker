import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * MethodologySection - Research methodology and verification criteria (desktop only)
 */
export function MethodologySection() {
  const t = useThemeClasses();

  return (
    <section className="hidden md:block mb-8">
      <h2 className={`text-2xl font-bold ${t.text.heading} mb-4`}>Methodology</h2>
      <p className={`${t.text.body} leading-relaxed mb-4`}>
        Every site in this database has been verified by multiple authoritative sources. We only
        include sites with:
      </p>
      <ul className={`list-disc list-inside ${t.text.body} space-y-2 mb-4`}>
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
  );
}
