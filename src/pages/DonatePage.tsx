import { useTranslation } from "../contexts/LocaleContext";
import { ResourcePageLayout, ResourceSection, ResourceLink } from "../components/Resources";

/**
 * DonatePage - Palestinian relief organizations for donations
 *
 * Displays curated list of reputable organizations providing:
 * - Humanitarian aid and emergency relief
 * - Medical care and supplies
 * - Healthcare for children
 *
 * Benefits over modal:
 * - Native browser scrolling (60 FPS guaranteed)
 * - Better SEO and sharing
 * - Browser back button support
 * - Consistent styling with other resource pages
 */
export function DonatePage() {
  const t = useTranslation();

  return (
    <ResourcePageLayout
      title={t("donate.title")}
      description={t("donate.description")}
    >
      <ResourceSection title={t("donate.organizationsSection")}>
        <ResourceLink
          title="UNRWA"
          organization="United Nations Relief and Works Agency"
          url="https://donate.unrwa.org/"
          description={t("donate.unrwaDesc")}
        />
        <ResourceLink
          title="Medical Aid for Palestinians"
          url="https://www.map.org.uk/donate"
          description={t("donate.mapDesc")}
        />
        <ResourceLink
          title="Palestine Children's Relief Fund"
          url="https://www.pcrf.net/donate.html"
          description={t("donate.pcrfDesc")}
        />
        <ResourceLink
          title="Doctors Without Borders"
          url="https://www.doctorswithoutborders.org/"
          description={t("donate.msfDesc")}
        />
      </ResourceSection>
    </ResourcePageLayout>
  );
}
