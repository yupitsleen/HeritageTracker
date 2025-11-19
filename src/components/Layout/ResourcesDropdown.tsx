import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../contexts/LocaleContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "../Button";
import { Z_INDEX } from "../../constants/layout";
import type { TranslationKey } from "../../types/i18n";

interface ResourceItem {
  path: string;
  translationKey: TranslationKey;
}

const RESOURCE_ITEMS: ResourceItem[] = [
  { path: '/resources/donate', translationKey: 'header.resources.donate' },
  { path: '/resources/organizations', translationKey: 'header.resources.organizations' },
  { path: '/resources/research', translationKey: 'header.resources.research' },
  { path: '/resources/media', translationKey: 'header.resources.media' },
  { path: '/resources/education', translationKey: 'header.resources.education' },
  { path: '/resources/legal', translationKey: 'header.resources.legal' },
  { path: '/resources/trackers', translationKey: 'header.resources.trackers' },
];

interface ResourcesDropdownProps {
  activePage: string | null;
  onNavigate: (path: string) => void;
  layout: 'desktop' | 'mobile';
}

/**
 * Resources dropdown menu component
 *
 * Displays dropdown menu with 7 resource pages:
 * - Donate
 * - Organizations
 * - Research & Reports
 * - Media & Documentation
 * - Educational Resources
 * - Legal & Advocacy
 * - Other Heritage Trackers
 */
export function ResourcesDropdown({ activePage, onNavigate, layout }: ResourcesDropdownProps) {
  const t = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if any resource page is active
  const isResourceActive = activePage?.startsWith('resources/');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
    onNavigate(path);
    setIsOpen(false);
  };

  // Mobile layout: Full width button with dropdown
  if (layout === 'mobile') {
    return (
      <div ref={dropdownRef} className="relative w-full">
        <Button
          onClick={handleToggle}
          variant={isResourceActive ? 'danger' : 'ghost'}
          size="sm"
          lightText
          className={`w-full justify-between ${isResourceActive ? 'ring-2 ring-white/50' : ''}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>{t('header.resources.title')}</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div
            className="mt-1 bg-gray-900 rounded-md shadow-lg border border-gray-700 overflow-hidden"
            style={{ zIndex: Z_INDEX.HEADER_DROPDOWN }}
          >
            {RESOURCE_ITEMS.map(({ path, translationKey }) => {
              const pageKey = path.replace('/resources/', 'resources/');
              const isActive = activePage === pageKey;

              return (
                <button
                  key={path}
                  onClick={() => handleItemClick(path)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-[#ed3039] text-white'
                      : 'text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  {t(translationKey)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Desktop layout: Compact button with dropdown
  return (
    <div ref={dropdownRef} className="relative">
      <Button
        onClick={handleToggle}
        variant={isResourceActive ? 'danger' : 'ghost'}
        size="xs"
        lightText
        className={`flex items-center gap-1 ${isResourceActive ? 'ring-2 ring-white/50 border' : 'border-0'}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {t('header.resources.title')}
        <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div
          className="absolute top-full mt-1 bg-gray-900 rounded-md shadow-lg border border-gray-700 overflow-hidden min-w-[200px]"
          style={{ zIndex: Z_INDEX.HEADER_DROPDOWN }}
        >
          {RESOURCE_ITEMS.map(({ path, translationKey }) => {
            const pageKey = path.replace('/resources/', 'resources/');
            const isActive = activePage === pageKey;

            return (
              <button
                key={path}
                onClick={() => handleItemClick(path)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-[#ed3039] text-white'
                    : 'text-gray-200 hover:bg-gray-800'
                }`}
              >
                {t(translationKey)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
