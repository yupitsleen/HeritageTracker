import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";

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
    name: "UNRWA",
    description: "UN agency providing education, healthcare, and emergency aid to Palestinian refugees.",
    url: "https://donate.unrwa.org/",
    focus: "Humanitarian aid, healthcare",
  },
  {
    name: "Medical Aid for Palestinians",
    description: "Medical services and supplies for Palestinians in occupied territories.",
    url: "https://www.map.org.uk/donate",
    focus: "Medical care",
  },
  {
    name: "Palestine Children's Relief Fund",
    description: "Free medical care for injured and sick children in Palestine.",
    url: "https://www.pcrf.net/donate.html",
    focus: "Children's healthcare",
  },
  {
    name: "Doctors Without Borders",
    description: "Emergency medical care and surgical services in Gaza and West Bank.",
    url: "https://www.doctorswithoutborders.org/",
    focus: "Emergency medical care",
  },
];

export function DonateModal() {
  const t = useThemeClasses();
  const translate = useTranslation();

  return (
    <div className="rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
      <div className="px-4 py-3">
        <h2 className={`text-lg font-bold mb-3 ${t.text.heading}`}>
          {translate("donate.title")}
        </h2>

        <p className={`text-xs mb-4 ${t.text.body}`}>
          {translate("donate.description")}
        </p>

        <div className="space-y-3">
          {DONATION_ORGANIZATIONS.map((org) => (
            <div
              key={org.name}
              className={`rounded-lg p-3 hover:border-[#009639] hover:shadow-md transition-all duration-200 border ${t.border.default} ${t.bg.tertiary}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm mb-1 ${t.text.heading}`}>
                    {org.name}
                  </h3>
                  <p className={`text-[10px] mb-1.5 ${t.text.muted}`}>
                    <span className="font-medium">{translate("donate.focus")}</span> {org.focus}
                  </p>
                  <p className={`text-xs mb-2 ${t.text.body}`}>
                    {org.description}
                  </p>
                </div>
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-shrink-0 px-3 py-1.5 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs font-semibold whitespace-nowrap active:scale-95 ${t.flag.greenBg} ${t.flag.greenHover}`}
                  aria-label={`Donate to ${org.name}`}
                >
                  {translate("donate.donateButton")}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-4 p-3 rounded-lg ${t.bg.tertiary} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.muted}`}>
            <strong>{translate("donate.disclaimer")}</strong> {translate("donate.disclaimerText")}
          </p>
        </div>
      </div>
    </div>
  );
}
