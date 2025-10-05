import { mockSites } from "./data/mockSites";
import { components, cn } from "./styles/theme";
import { SiteCard } from "./components/SiteCard";

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
            <SiteCard key={site.id} site={site} />
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
