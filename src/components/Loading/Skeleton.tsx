/**
 * Skeleton loading components for better UX during content loading
 * Replaces "Loading..." text with animated placeholders
 */

export function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-3 p-4 bg-white rounded-xl border border-gray-100">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

export function SkeletonMap() {
  return (
    <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-xl" />
  );
}

export function SkeletonTable() {
  return (
    <div className="animate-pulse space-y-2 p-4">
      {/* Header */}
      <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
      {/* Rows */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
      ))}
    </div>
  );
}

export function SkeletonText({ className = "" }: { className?: string }) {
  return <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}></div>;
}