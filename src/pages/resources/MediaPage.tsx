import { useTranslation } from "../../contexts/LocaleContext";
import { ResourcePageLayout, ResourceSection, ResourceLink } from "../../components/Resources";

/**
 * MediaPage - Photo archives, videos, and news sources
 *
 * Displays curated list of:
 * - Photo and video documentation
 * - News outlets covering Palestine
 * - Social media archives
 * - Documentary films
 */
export function MediaPage() {
  const t = useTranslation();

  return (
    <ResourcePageLayout
      title={t('resources.media.title')}
      description={t('resources.media.description')}
    >
      <ResourceSection title={t('resources.media.photoArchivesSection')}>
        <ResourceLink
          title="The Palestine Museum Digital Archive"
          url="https://www.palmuseum.org/"
          description={t('resources.media.palMuseumDesc')}
        />
        <ResourceLink
          title="Palestinian Museum Photo Collection"
          url="https://www.palmuseum.org/en/collection"
          description={t('resources.media.photoCollectionDesc')}
        />
        <ResourceLink
          title="UNRWA Photo and Film Archive"
          organization="United Nations Relief and Works Agency"
          url="https://www.unrwa.org/photo-and-film-archive"
          description={t('resources.media.unrwaArchiveDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.media.newsOutletsSection')}>
        <ResourceLink
          title="Al Jazeera - Palestine"
          url="https://www.aljazeera.com/where/palestine/"
          description={t('resources.media.alJazeeraDesc')}
        />
        <ResourceLink
          title="Middle East Eye"
          url="https://www.middleeasteye.net/countries/palestine"
          description={t('resources.media.meeDesc')}
        />
        <ResourceLink
          title="The Electronic Intifada"
          url="https://electronicintifada.net/"
          description={t('resources.media.eintifadaDesc')}
        />
        <ResourceLink
          title="Mondoweiss"
          url="https://mondoweiss.net/"
          description={t('resources.media.mondoweissDesc')}
        />
        <ResourceLink
          title="+972 Magazine"
          url="https://www.972mag.com/"
          description={t('resources.media.972Desc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.media.documentariesSection')}>
        <ResourceLink
          title="5 Broken Cameras"
          url="https://www.5brokencameras.com/"
          description={t('resources.media.5camerasDesc')}
        />
        <ResourceLink
          title="The Occupation of the American Mind"
          url="https://www.occupationmovie.org/"
          description={t('resources.media.occupationMindDesc')}
        />
        <ResourceLink
          title="Gaza Fights For Freedom"
          url="https://gazafightsforfreedom.com/"
          description={t('resources.media.gazaFightsDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.media.socialMediaSection')}>
        <ResourceLink
          title="Eye on Palestine (@eye.on.palestine)"
          url="https://www.instagram.com/eye.on.palestine/"
          description={t('resources.media.eyeOnPalDesc')}
        />
        <ResourceLink
          title="Palestinian Youth Movement"
          url="https://www.instagram.com/palyouthmvmt/"
          description={t('resources.media.pymDesc')}
        />
      </ResourceSection>
    </ResourcePageLayout>
  );
}
