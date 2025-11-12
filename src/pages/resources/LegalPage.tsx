import { useTranslation } from "../../contexts/LocaleContext";
import { ResourcePageLayout, ResourceSection, ResourceLink } from "../../components/Resources";

/**
 * LegalPage - Legal proceedings and advocacy campaigns
 *
 * Displays curated list of:
 * - International court cases (ICJ, ICC)
 * - Legal advocacy organizations
 * - UN resolutions and reports
 * - Advocacy campaigns
 */
export function LegalPage() {
  const t = useTranslation();

  return (
    <ResourcePageLayout
      title={t('resources.legal.title')}
      description={t('resources.legal.description')}
    >
      <ResourceSection title={t('resources.legal.internationalCourtsSection')}>
        <ResourceLink
          title="ICJ Case: South Africa v. Israel"
          organization="International Court of Justice"
          url="https://www.icj-cij.org/"
          description={t('resources.legal.icjCaseDesc')}
        />
        <ResourceLink
          title="ICC Investigation in Palestine"
          organization="International Criminal Court"
          url="https://www.icc-cpi.int/palestine"
          description={t('resources.legal.iccInvestigationDesc')}
        />
        <ResourceLink
          title="UN Special Rapporteur on Palestine"
          organization="United Nations Human Rights Council"
          url="https://www.ohchr.org/en/special-procedures/sr-palestine"
          description={t('resources.legal.unRapporteurDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.legal.legalAdvocacySection')}>
        <ResourceLink
          title="Center for Constitutional Rights - Palestine Advocacy"
          url="https://ccrjustice.org/home/get-involved/tools-resources/fact-sheets-and-faqs/advocacy-palestinian-human-rights"
          description={t('resources.legal.ccrDesc')}
        />
        <ResourceLink
          title="Palestine Legal"
          url="https://palestinelegal.org/"
          description={t('resources.legal.palLegalDesc')}
        />
        <ResourceLink
          title="Adalah - Legal Center for Arab Minority Rights"
          url="https://www.adalah.org/"
          description={t('resources.legal.adalahDesc')}
        />
        <ResourceLink
          title="Al-Haq - Law in the Service of Man"
          url="https://www.alhaq.org/"
          description={t('resources.legal.alhaqLegalDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.legal.unResolutionsSection')}>
        <ResourceLink
          title="UN General Assembly Resolutions on Palestine"
          organization="United Nations"
          url="https://www.un.org/unispal/document-tags/general-assembly-resolutions/"
          description={t('resources.legal.gaResolutionsDesc')}
        />
        <ResourceLink
          title="UN Security Council Resolutions on Palestine"
          organization="United Nations"
          url="https://www.un.org/unispal/document-tags/security-council-resolutions/"
          description={t('resources.legal.scResolutionsDesc')}
        />
        <ResourceLink
          title="UN Special Committee on Palestinian Rights"
          organization="United Nations"
          url="https://www.un.org/unispal/committee/"
          description={t('resources.legal.unCommitteeDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.legal.advocacyCampaignsSection')}>
        <ResourceLink
          title="BDS Movement (Boycott, Divestment, Sanctions)"
          url="https://bdsmovement.net/"
          description={t('resources.legal.bdsDesc')}
        />
        <ResourceLink
          title="Jewish Voice for Peace"
          url="https://www.jewishvoiceforpeace.org/"
          description={t('resources.legal.jvpDesc')}
        />
        <ResourceLink
          title="American Muslims for Palestine"
          url="https://www.ampalestine.org/"
          description={t('resources.legal.ampDesc')}
        />
        <ResourceLink
          title="US Campaign for Palestinian Rights"
          url="https://uscpr.org/"
          description={t('resources.legal.uscprDesc')}
        />
      </ResourceSection>
    </ResourcePageLayout>
  );
}
