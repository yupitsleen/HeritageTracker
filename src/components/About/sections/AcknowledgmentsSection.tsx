import { useTheme } from "../../../contexts/ThemeContext";

/**
 * AcknowledgmentsSection - Credits to organizations and researchers (desktop only)
 */
export function AcknowledgmentsSection() {
  const { isDark } = useTheme();

  return (
    <section className="hidden md:block mb-8">
      <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}>Acknowledgments</h2>
      <p className={`${isDark ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
        This project builds on the essential work of UNESCO, Forensic Architecture, Heritage for
        Peace, the Palestinian Museum, Institute for Palestine Studies, ICOM, and countless
        researchers, archaeologists, and community members who have dedicated themselves to
        documenting and preserving Palestinian cultural heritage.
      </p>
    </section>
  );
}
