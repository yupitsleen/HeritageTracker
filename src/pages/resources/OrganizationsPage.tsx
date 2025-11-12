import { useTranslation } from "../../contexts/LocaleContext";
import { ResourcePageLayout, ResourceSection, ResourceLink } from "../../components/Resources";

/**
 * OrganizationsPage - Palestinian heritage and justice organizations
 *
 * Displays curated list of organizations working on:
 * - Heritage preservation and documentation
 * - Human rights and justice
 * - Humanitarian aid
 * - Legal advocacy
 */
export function OrganizationsPage() {
  const t = useTranslation();

  return (
    <ResourcePageLayout
      title={t('resources.organizations.title')}
      description={t('resources.organizations.description')}
    >
      <ResourceSection title={t('resources.organizations.heritageSection')}>
        <ResourceLink
          title="UNESCO"
          organization="United Nations Educational, Scientific and Cultural Organization"
          url="https://www.unesco.org/en"
          description={t('resources.organizations.unescoDesc')}
        />
        <ResourceLink
          title="Heritage for Peace"
          url="https://www.heritageforpeace.org/"
          description={t('resources.organizations.h4pDesc')}
        />
        <ResourceLink
          title="Forensic Architecture"
          organization="Goldsmiths, University of London"
          url="https://forensic-architecture.org/"
          description={t('resources.organizations.forensicDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.organizations.humanRightsSection')}>
        <ResourceLink
          title="Al-Haq"
          organization="Palestinian Human Rights Organization"
          url="https://www.alhaq.org/"
          description={t('resources.organizations.alhaqDesc')}
        />
        <ResourceLink
          title="B'Tselem"
          organization="Israeli Information Center for Human Rights"
          url="https://www.btselem.org/"
          description={t('resources.organizations.btselemDesc')}
        />
        <ResourceLink
          title="Amnesty International - Palestine"
          url="https://www.amnesty.org/en/location/middle-east-and-north-africa/palestine-state-of/"
          description={t('resources.organizations.amnestyDesc')}
        />
        <ResourceLink
          title="Human Rights Watch - Palestine"
          url="https://www.hrw.org/middle-east/north-africa/israel/palestine"
          description={t('resources.organizations.hrwDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.organizations.humanitarianSection')}>
        <ResourceLink
          title="UNRWA"
          organization="United Nations Relief and Works Agency"
          url="https://www.unrwa.org/"
          description={t('resources.organizations.unrwaDesc')}
        />
        <ResourceLink
          title="Medical Aid for Palestinians (MAP)"
          url="https://www.map.org.uk/"
          description={t('resources.organizations.mapDesc')}
        />
        <ResourceLink
          title="Palestine Children's Relief Fund (PCRF)"
          url="https://www.pcrf.net/"
          description={t('resources.organizations.pcrfDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.organizations.legalSection')}>
        <ResourceLink
          title="International Court of Justice - Palestine Case"
          organization="United Nations"
          url="https://www.icj-cij.org/"
          description={t('resources.organizations.icjDesc')}
        />
        <ResourceLink
          title="International Criminal Court - Palestine"
          url="https://www.icc-cpi.int/"
          description={t('resources.organizations.iccDesc')}
        />
      </ResourceSection>
    </ResourcePageLayout>
  );
}
