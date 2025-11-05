import { useTranslation } from "../../contexts/LocaleContext";
import { Button } from "../Button";

interface NavigationItem {
  path: string;
  translationKey: string;
  variant: 'primary' | 'secondary' | 'danger';
  hideOnMobile?: boolean;
}

interface NavigationLinksProps {
  activePage: string | null;
  isMobileSize: boolean;
  onNavigate: (path: string) => void;
  layout: 'desktop' | 'mobile';
}

const NAV_ITEMS: NavigationItem[] = [
  { path: '/', translationKey: 'header.dashboard', variant: 'primary', hideOnMobile: true },
  { path: '/data', translationKey: 'header.data', variant: 'primary' },
  { path: '/timeline', translationKey: 'header.timeline', variant: 'secondary' },
  { path: '/donate', translationKey: 'header.helpPalestine', variant: 'danger' },
  { path: '/stats', translationKey: 'header.statistics', variant: 'primary' },
  { path: '/about', translationKey: 'header.about', variant: 'primary' },
];

/**
 * Reusable navigation links component
 *
 * Renders navigation buttons for both desktop and mobile layouts.
 * Handles hiding Dashboard on mobile devices (< 1024px) since they get redirected to Data page.
 *
 * @param activePage - Currently active page ('dashboard', 'data', etc.)
 * @param isMobileSize - Whether viewport is mobile size (< 1024px)
 * @param onNavigate - Callback when navigation button is clicked
 * @param layout - 'desktop' or 'mobile' layout variant
 */
export function NavigationLinks({ activePage, isMobileSize, onNavigate, layout }: NavigationLinksProps) {
  const t = useTranslation();

  // Desktop: small buttons, no full width
  // Mobile: larger buttons, full width, left-aligned
  const size = layout === 'mobile' ? 'sm' : 'xs';
  const baseClassName = layout === 'mobile' ? 'w-full justify-start' : '';

  return (
    <>
      {NAV_ITEMS.map(({ path, translationKey, variant, hideOnMobile }) => {
        // Skip Dashboard on mobile devices (< 1024px)
        if (hideOnMobile && layout === 'mobile' && isMobileSize) {
          return null;
        }

        // Determine if this nav item is active
        const pageKey = path === '/' ? 'dashboard' : path.substring(1); // '/data' -> 'data'
        const isActive = activePage === pageKey;

        return (
          <Button
            key={path}
            onClick={() => onNavigate(path)}
            variant={isActive ? variant : 'ghost'}
            size={size}
            lightText
            aria-label={t(translationKey)}
            className={`${baseClassName} ${
              isActive ? 'ring-2 ring-white/50' : ''
            } ${layout === 'desktop' && isActive ? 'border' : layout === 'desktop' ? 'border-0' : ''}`}
          >
            {t(translationKey)}
          </Button>
        );
      })}
    </>
  );
}
