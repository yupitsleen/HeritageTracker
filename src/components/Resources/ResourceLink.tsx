import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface ResourceLinkProps {
  title: string;
  url: string;
  description?: string;
  organization?: string;
}

/**
 * External resource link component
 *
 * Displays a clickable link with title, description, and organization.
 * Opens in new tab with security attributes.
 */
export function ResourceLink({ title, url, description, organization }: ResourceLinkProps) {
  const { text, border } = useThemeClasses();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 rounded-lg border ${border} hover:bg-[#009639]/10 transition-colors group`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${text} group-hover:text-[#009639] transition-colors flex items-center gap-2`}>
            {title}
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </h3>
          {organization && (
            <p className="text-sm opacity-70 mt-1">{organization}</p>
          )}
          {description && (
            <p className="text-sm opacity-80 mt-2">{description}</p>
          )}
        </div>
      </div>
    </a>
  );
}
