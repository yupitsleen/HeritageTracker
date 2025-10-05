import { mockSites } from "./data/mockSites";
import { components, getStatusColor, cn } from "./styles/theme";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={components.header.base}>
        <div className={cn(components.container.base, "py-6")}>
          <h1 className={components.header.title}>Heritage Tracker</h1>
          <p className={components.header.subtitle}>
            Documenting the destruction of cultural heritage in Gaza (2023-2024)
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(components.container.base, components.container.section)}>
        {/* Stats Summary */}
        <div className={cn(components.card.base, components.card.padding, "mb-8")}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Heritage Sites ({mockSites.length} sample sites)
          </h2>
          <p className="text-gray-600">
            Displaying {mockSites.length} sample heritage sites for development. Interactive map
            coming next.
          </p>
        </div>

        {/* Sites List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockSites.map((site) => (
            <div key={site.id} className={components.card.base}>
              {/* Status Badge */}
              <div className={cn(getStatusColor(site.status), "px-4 py-2 text-sm font-semibold text-white")}>
                {site.status.toUpperCase().replace("-", " ")}
              </div>

              {/* Content */}
              <div className={components.card.padding}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{site.name}</h3>
                {site.nameArabic && (
                  <p className="text-gray-600 text-sm mb-3">{site.nameArabic}</p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>
                    <span className="font-semibold">Type:</span> {site.type.replace("-", " ")}
                  </p>
                  <p>
                    <span className="font-semibold">Built:</span> {site.yearBuilt}
                  </p>
                  {site.dateDestroyed && (
                    <p>
                      <span className="font-semibold">Destroyed:</span> {site.dateDestroyed}
                    </p>
                  )}
                </div>

                <p className="text-gray-700 text-sm line-clamp-3">{site.description}</p>

                {/* Verified By */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Verified by:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {site.verifiedBy.map((org) => (
                      <span key={org} className={components.badge.primary}>
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={components.footer.base}>
        <div className={cn(components.container.base, "py-6")}>
          <p className={components.footer.text}>
            Heritage Tracker • Evidence-based documentation • All data verified by UNESCO,
            Forensic Architecture, and Heritage for Peace
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
