import { useTranslation } from "../../contexts/LocaleContext";
import { ResourcePageLayout, ResourceSection, ResourceLink } from "../../components/Resources";

/**
 * ResearchPage - Academic research and official reports
 *
 * Displays curated list of:
 * - UNESCO damage assessments
 * - Academic studies and papers
 * - Documentation projects
 * - Statistical reports
 */
export function ResearchPage() {
  const t = useTranslation();

  return (
    <ResourcePageLayout
      title={t('resources.research.title')}
      description={t('resources.research.description')}
    >
      <ResourceSection title={t('resources.research.officialReportsSection')}>
        <ResourceLink
          title="UNESCO Gaza Heritage Damage Assessment"
          organization="UNESCO"
          url="https://www.unesco.org/"
          description={t('resources.research.unescoReportDesc')}
        />
        <ResourceLink
          title="UN OCHA Humanitarian Reports"
          organization="United Nations Office for the Coordination of Humanitarian Affairs"
          url="https://www.ochaopt.org/"
          description={t('resources.research.ochaDesc')}
        />
        <ResourceLink
          title="UNRWA Situation Reports"
          organization="United Nations Relief and Works Agency"
          url="https://www.unrwa.org/resources/reports"
          description={t('resources.research.unrwaReportsDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.research.documentationSection')}>
        <ResourceLink
          title="Forensic Architecture - Gaza Investigations"
          organization="Goldsmiths, University of London"
          url="https://forensic-architecture.org/"
          description={t('resources.research.forensicProjectsDesc')}
        />
        <ResourceLink
          title="Airwars - Civilian Harm Tracking"
          url="https://airwars.org/"
          description={t('resources.research.airwarsDesc')}
        />
        <ResourceLink
          title="Euro-Med Human Rights Monitor"
          url="https://euromedmonitor.org/"
          description={t('resources.research.euromedDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.research.academicSection')}>
        <ResourceLink
          title="Palestine Studies Journal"
          organization="Institute for Palestine Studies"
          url="https://www.palestine-studies.org/"
          description={t('resources.research.palestineStudiesDesc')}
        />
        <ResourceLink
          title="Journal of Holy Land and Palestine Studies"
          organization="Edinburgh University Press"
          url="https://www.euppublishing.com/loi/hlps"
          description={t('resources.research.holyLandJournalDesc')}
        />
        <ResourceLink
          title="Middle East Research and Information Project (MERIP)"
          url="https://merip.org/"
          description={t('resources.research.meripDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.research.databasesSection')}>
        <ResourceLink
          title="Palestine Open Maps"
          url="https://palopenmaps.org/"
          description={t('resources.research.openMapsDesc')}
        />
        <ResourceLink
          title="Palestine Remembered"
          url="https://www.palestineremembered.com/"
          description={t('resources.research.rememberedDesc')}
        />
      </ResourceSection>
    </ResourcePageLayout>
  );
}
