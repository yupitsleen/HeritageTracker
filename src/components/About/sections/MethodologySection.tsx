import { useTheme } from "../../../contexts/ThemeContext";

/**
 * MethodologySection - Research methodology and verification criteria (desktop only)
 */
export function MethodologySection() {
  const { isDark } = useTheme();

  return (
    <section className="hidden md:block mb-6">
      <h2 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Methodology</h2>
      <p className={`text-sm leading-relaxed mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
        Every site has been verified by authoritative sources. Requirements:
      </p>
      <ul className={`list-disc list-inside text-sm space-y-1 mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
        <li><strong>Multiple verifications</strong> from UNESCO, Forensic Architecture, or Heritage for Peace</li>
        <li><strong>Documented coordinates</strong> via satellite imagery or archaeological records</li>
        <li><strong>Verified destruction dates</strong> with supporting evidence</li>
        <li><strong>Published sources</strong> with URLs for transparency</li>
      </ul>
    </section>
  );
}
