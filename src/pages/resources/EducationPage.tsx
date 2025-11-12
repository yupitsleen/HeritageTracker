import { useTranslation } from "../../contexts/LocaleContext";
import { ResourcePageLayout, ResourceSection, ResourceLink } from "../../components/Resources";

/**
 * EducationPage - Teaching materials and historical context
 *
 * Displays curated list of:
 * - Educational resources and curricula
 * - Historical timelines and context
 * - Teaching guides
 * - Books and publications
 */
export function EducationPage() {
  const t = useTranslation();

  return (
    <ResourcePageLayout
      title={t('resources.education.title')}
      description={t('resources.education.description')}
    >
      <ResourceSection title={t('resources.education.teachingResourcesSection')}>
        <ResourceLink
          title="Zinn Education Project - Teaching Palestine"
          url="https://www.zinnedproject.org/campaigns/teach-palestine/"
          description={t('resources.education.zinnDesc')}
        />
        <ResourceLink
          title="Teaching for Change - Palestine Resources"
          url="https://www.teachingforchange.org/"
          description={t('resources.education.t4cDesc')}
        />
        <ResourceLink
          title="Rethinking Schools - Palestine Curriculum"
          url="https://rethinkingschools.org/"
          description={t('resources.education.rethinkingDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.education.historicalContextSection')}>
        <ResourceLink
          title="Palestine Timeline - Interactive History"
          url="https://interactive.aljazeera.com/aje/palestineremix/"
          description={t('resources.education.timelineDesc')}
        />
        <ResourceLink
          title="Nakba Archive - 1948 Documentation"
          url="https://www.nakba-archive.org/"
          description={t('resources.education.nakbaArchiveDesc')}
        />
        <ResourceLink
          title="Institute for Palestine Studies"
          url="https://www.palestine-studies.org/en"
          description={t('resources.education.ipsDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.education.booksSection')}>
        <ResourceLink
          title="'The Hundred Years' War on Palestine' by Rashid Khalidi"
          url="https://www.penguinrandomhouse.com/books/565905/the-hundred-years-war-on-palestine-by-rashid-khalidi/"
          description={t('resources.education.khalidiDesc')}
        />
        <ResourceLink
          title="'The Ethnic Cleansing of Palestine' by Ilan Pappé"
          url="https://oneworld-publications.com/the-ethnic-cleansing-of-palestine-pb.html"
          description={t('resources.education.pappeDesc')}
        />
        <ResourceLink
          title="'Palestine: A Four Thousand Year History' by Nur Masalha"
          url="https://www.bloomsbury.com/uk/palestine-9781786992727/"
          description={t('resources.education.masalhaDesc')}
        />
        <ResourceLink
          title="'Except for Palestine' by Marc Lamont Hill & Mitchell Plitnick"
          url="https://thenewpress.com/books/except-for-palestine"
          description={t('resources.education.hillPlitnickDesc')}
        />
      </ResourceSection>

      <ResourceSection title={t('resources.education.youthResourcesSection')}>
        <ResourceLink
          title="P is for Palestine - Children's Book"
          url="https://www.goodreads.com/book/show/36236530-p-is-for-palestine"
          description={t('resources.education.pisforpalDesc')}
        />
        <ResourceLink
          title="Sitti's Key - Children's Story"
          url="https://www.goodreads.com/book/show/23995614-sitti-s-key"
          description={t('resources.education.sittisKeyDesc')}
        />
      </ResourceSection>
    </ResourcePageLayout>
  );
}
