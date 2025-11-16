import type { ImageWithAttribution } from "../../types";
import { cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface SiteImageProps {
  image: ImageWithAttribution;
  alt: string;
  label: string;
  className?: string;
}

/**
 * Image component with attribution and copyright information
 * Displays image with proper credit and licensing information below
 */
export function SiteImage({ image, alt, label, className }: SiteImageProps) {
  // Handle both absolute URLs and relative paths
  const getImageUrl = (url: string) => {
    // If it's an absolute URL (http/https), return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // For relative paths, prepend the base URL
    const baseUrl = import.meta.env.BASE_URL || '/';
    // Remove leading slash from url if present to avoid double slashes
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `${baseUrl}${cleanUrl}`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Image */}
      <div className="relative">
        <img
          src={getImageUrl(image.url)}
          alt={alt}
          className="w-full h-64 object-cover rounded-lg shadow-md"
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3EImage not available%3C/text%3E%3C/svg%3E";
          }}
        />

        {/* License badge overlay (if specified) */}
        {image.license && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
            {image.license}
          </div>
        )}
      </div>

      {/* Image label */}
      <p className="text-sm font-medium text-gray-700">{label}</p>

      {/* Attribution */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Credit:</span> {image.credit}
        </p>

        {image.date && (
          <p>
            <span className="font-medium">Date:</span> {image.date}
          </p>
        )}

        {image.description && (
          <p className="text-gray-500 italic">{image.description}</p>
        )}

        {image.sourceUrl && (
          <p>
            <a
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View original source
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Placeholder component for when images are not yet available
 * Shows where images should go with instructions for adding them
 */
export function SiteImagePlaceholder({ label }: { label: string }) {
  const t = useThemeClasses();

  return (
    <div className="space-y-2">
      <div className={cn(
        "w-full h-64 rounded-lg shadow-md flex flex-col items-center justify-center p-6 border-2 border-dashed",
        t.bg.secondary,
        t.border.subtle
      )}>
        <svg
          className={cn("w-12 h-12 mb-3", t.icon.muted)}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className={cn("text-sm font-medium text-center", t.text.muted)}>
          Image needed: {label}
        </p>
        <p className={cn("text-xs text-center mt-2", t.text.subtle)}>
          Requires proper attribution and licensing
        </p>
      </div>
      <p className={cn("text-sm font-medium", t.text.body)}>{label}</p>
      <div className={cn("text-xs space-y-1", t.text.subtle)}>
        <p className="font-medium">Required attribution fields:</p>
        <ul className="list-disc list-inside ml-2 space-y-0.5">
          <li>url: Image URL or file path</li>
          <li>credit: Photographer/organization name</li>
          <li>license: Copyright license (e.g., CC BY-SA, Fair Use)</li>
          <li>sourceUrl: Link to original source (optional)</li>
          <li>date: When photo was taken (optional)</li>
        </ul>
      </div>
    </div>
  );
}
