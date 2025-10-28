/**
 * Pagination Component
 *
 * Renders page navigation controls with:
 * - Previous/Next buttons
 * - Smart page number display (1 ... 5 6 [7] 8 9 ... 100)
 * - Current page stats
 * - Disabled states during loading
 */

import { useTranslation } from "../../contexts/LocaleContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/**
 * Pagination controls for paginated data views
 *
 * @param currentPage Current page number (1-indexed)
 * @param totalPages Total number of pages
 * @param totalItems Total number of items across all pages
 * @param onPageChange Callback when page changes
 * @param isLoading Optional loading state to disable buttons
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={3}
 *   totalPages={10}
 *   totalItems={500}
 *   onPageChange={goToPage}
 *   isLoading={false}
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const translate = useTranslation();
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      {/* Stats */}
      <div className="text-sm text-gray-700">
        {translate("pagination.showingPage")} <span className="font-semibold">{currentPage}</span> {translate("pagination.of")}{' '}
        <span className="font-semibold">{totalPages}</span> ({totalItems} {translate("pagination.totalSites")})
      </div>

      {/* Page controls */}
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          aria-label={translate("pagination.previous")}
        >
          {translate("pagination.previous")}
        </button>

        {pageNumbers.map((pageNum, idx) =>
          pageNum === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(Number(pageNum))}
              disabled={isLoading}
              className={`px-3 py-1 rounded border transition-colors ${
                pageNum === currentPage
                  ? 'bg-palestine-red text-white border-palestine-red'
                  : 'border-gray-300 hover:bg-gray-100 disabled:opacity-50'
              }`}
              aria-label={`${translate("pagination.goToPage")} ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          aria-label={translate("pagination.next")}
        >
          {translate("pagination.next")}
        </button>
      </div>
    </div>
  );
}

/**
 * Generate smart page number array
 * Shows: 1 ... 5 6 [7] 8 9 ... 100
 *
 * @param current Current page number
 * @param total Total number of pages
 * @returns Array of page numbers and ellipsis strings
 */
function getPageNumbers(current: number, total: number): (number | string)[] {
  // If 7 or fewer pages, show all
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  // Add ellipsis if current page is far from start
  if (current > 3) {
    pages.push('...');
  }

  // Add pages around current (current-1, current, current+1)
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  // Add ellipsis if current page is far from end
  if (current < total - 2) {
    pages.push('...');
  }

  // Always show last page
  pages.push(total);

  return pages;
}
