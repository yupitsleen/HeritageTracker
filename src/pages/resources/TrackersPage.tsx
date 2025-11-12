import { useTranslation } from "../../contexts/LocaleContext";
import { ResourcePageLayout, ResourceSection, ResourceLink } from "../../components/Resources";

/**
 * TrackersPage - Other heritage and conflict documentation trackers
 *
 * Displays curated list of similar projects documenting:
 * - Heritage destruction in other conflicts
 * - Cultural preservation initiatives
 * - Conflict documentation platforms
 */
export function TrackersPage() {
  const t = useTranslation();

  return (
    <ResourcePageLayout
      title={t('resources.trackers.title')}
      description={t('resources.trackers.description')}
    >
      <ResourceSection title={t('resources.trackers.palestineSection')}>
        <ResourceLink
          title="Gaza Mosque Archive"
          url="https://gazamosques.com/"
          description={t('resources.trackers.gazaMosquesDesc')}
        />
        <ResourceLink
          title="Palestine Open Maps"
          url="https://palopenmaps.org/"
          description={t('resources.trackers.openMapsDesc')}
        />
        <ResourceLink
          title="Visualizing Palestine"
          url="https://www.visualizingpalestine.org/"
          description={t('resources.trackers.vizPalDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.trackers.syriaSection')}>
        <ResourceLink
          title="Syrian Heritage Archive Project"
          organization="Heritage for Peace"
          url="https://www.heritageforpeace.org/syrian-heritage-initiative/syrian-heritage-archive-project/"
          description={t('resources.trackers.syrianArchiveDesc')}
        />
        <ResourceLink
          title="The Day After - Heritage Protection"
          url="https://tda-sy.org/"
          description={t('resources.trackers.dayAfterDesc')}
        />
        <ResourceLink
          title="ASOR Cultural Heritage Initiatives - Syria"
          organization="American Schools of Oriental Research"
          url="https://www.asor-syrianheritage.org/"
          description={t('resources.trackers.asorSyriaDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.trackers.yemenSection')}>
        <ResourceLink
          title="Yemen Data Project"
          url="https://yemendataproject.org/"
          description={t('resources.trackers.yemenDataDesc')}
        />
        <ResourceLink
          title="Yemen Archive - Mnemonic"
          url="https://yemeniarchive.org/"
          description={t('resources.trackers.yemenArchiveDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.trackers.ukraineSection')}>
        <ResourceLink
          title="Conflict Observatory - Ukraine"
          organization="U.S. Department of State"
          url="https://hub.conflictobservatory.org/"
          description={t('resources.trackers.conflictObsDesc')}
        />
        <ResourceLink
          title="Ukraine Cultural Heritage Monitoring Lab"
          organization="Virginia Museum of Natural History / Smithsonian"
          url="https://www.chmlab.io/"
          description={t('resources.trackers.ukraineLabDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.trackers.globalSection')}>
        <ResourceLink
          title="Endangered Heritage - Tracking Cultural Destruction"
          organization="Smithsonian Cultural Rescue Initiative"
          url="https://culturalrescue.si.edu/"
          description={t('resources.trackers.smithsonianDesc')}
        />
        <ResourceLink
          title="Bellingcat - Open Source Investigations"
          url="https://www.bellingcat.com/"
          description={t('resources.trackers.bellingcatDesc')}
        />
        <ResourceLink
          title="Syrian Archive - Digital Evidence Preservation"
          url="https://syrianarchive.org/"
          description={t('resources.trackers.syrianArchiveOrgDesc')}
        />
        <ResourceLink
          title="Mnemonic - Digital Memory Archive"
          url="https://mnemonic.org/"
          description={t('resources.trackers.mnemonicDesc')}
        />
      </ResourceSection>
    </ResourcePageLayout>
  );
}
