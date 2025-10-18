import { useThemeClasses } from "../../hooks/useThemeClasses";

/**
 * DonateModal - Modal containing links to reputable Palestinian relief organizations
 * Supports dark mode
 */

interface DonationOrg {
  name: string;
  description: string;
  url: string;
  focus: string;
}

const DONATION_ORGANIZATIONS: DonationOrg[] = [
  {
    name: "UNRWA (United Nations Relief and Works Agency)",
    description: "Provides education, healthcare, and emergency aid to Palestinian refugees across the Middle East.",
    url: "https://donate.unrwa.org/",
    focus: "Humanitarian aid, education, healthcare",
  },
  {
    name: "Medical Aid for Palestinians (MAP)",
    description: "Delivers medical services and supplies to Palestinians in the occupied territories and refugee camps.",
    url: "https://www.map.org.uk/donate",
    focus: "Medical care, health services",
  },
  {
    name: "Palestine Children's Relief Fund (PCRF)",
    description: "Provides free medical care to injured and sick children, and humanitarian relief in Palestine and Lebanon.",
    url: "https://www.pcrf.net/donate.html",
    focus: "Children's healthcare, medical aid",
  },
  {
    name: "Islamic Relief Worldwide - Gaza Emergency",
    description: "Provides emergency food, medical aid, and shelter assistance to families in Gaza.",
    url: "https://islamic-relief.org/appeals/palestine-emergency-appeal/",
    focus: "Emergency relief, food aid, shelter",
  },
  {
    name: "Doctors Without Borders / MSF",
    description: "Provides emergency medical care and surgical services in Gaza and the West Bank.",
    url: "https://www.doctorswithoutborders.org/",
    focus: "Emergency medical care, surgery",
  },
  {
    name: "Middle East Children's Alliance (MECA)",
    description: "Supports Palestinian children's welfare, health, and education programs.",
    url: "https://www.mecaforpeace.org/donate",
    focus: "Children's welfare, education",
  },
];

export function DonateModal() {
  const t = useThemeClasses();

  return (
    <div className={`rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto ${t.bg.primary}`}>
      <div className="px-6 py-4">
        <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>
          Help Palestine
        </h2>

        <p className={`text-sm mb-6 ${t.text.body}`}>
          Support humanitarian relief efforts in Palestine through these reputable organizations.
          All organizations listed below are established, transparent charities working to provide
          essential aid to Palestinians affected by the ongoing crisis.
        </p>

        <div className="space-y-4">
          {DONATION_ORGANIZATIONS.map((org) => (
            <div
              key={org.name}
              className={`rounded-xl p-4 hover:border-[#009639] hover:shadow-md transition-all duration-200 border ${t.border.default} ${t.bg.tertiary}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`font-semibold text-base mb-1 ${t.text.heading}`}>
                    {org.name}
                  </h3>
                  <p className={`text-xs mb-2 ${t.text.muted}`}>
                    <span className="font-medium">Focus:</span> {org.focus}
                  </p>
                  <p className={`text-sm mb-3 ${t.text.body}`}>
                    {org.description}
                  </p>
                </div>
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-shrink-0 px-4 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold whitespace-nowrap active:scale-95 ${t.flag.greenBg} ${t.flag.greenHover}`}
                  aria-label={`Donate to ${org.name}`}
                >
                  Donate
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 rounded-lg ${t.bg.tertiary} border ${t.border.default}`}>
          <p className={`text-xs ${t.text.muted}`}>
            <strong>Note:</strong> Heritage Tracker is not affiliated with any of these organizations.
            We have compiled this list to help users find reputable charities supporting Palestinian
            humanitarian relief. Please conduct your own research before donating. All donations go
            directly to the organizations listed.
          </p>
        </div>
      </div>
    </div>
  );
}
