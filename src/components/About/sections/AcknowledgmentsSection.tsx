import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * AcknowledgmentsSection - Credits to organizations and researchers (desktop only)
 */
export function AcknowledgmentsSection() {
  const t = useThemeClasses();

  return (
    <section className="hidden md:block mb-6">
      <h2 className={`text-lg font-bold ${t.text.heading} mb-3`}>Acknowledgments</h2>
      <p className={`text-xs ${t.text.body} leading-relaxed`}>
        This project builds on work by UNESCO, Forensic Architecture, Heritage for Peace, Palestinian Museum, Institute for Palestine Studies, ICOM, and countless researchers and community members dedicated to documenting Palestinian cultural heritage.
      </p>
    </section>
  );
}
