import { useThemeClasses } from "../../../hooks/useThemeClasses";

/**
 * ResponsibilitySection - Identifies parties responsible for heritage destruction
 * Documents Israeli military actions and US material/political support
 */
export function ResponsibilitySection() {
  const t = useThemeClasses();

  return (
    <section className="mb-8">
      <h2 className={`text-2xl font-bold ${t.text.heading} mb-4`}>Who's Responsible</h2>

      {/* Israeli Military Operations */}
      <div className={`${t.bg.tertiary} rounded-lg p-6 mb-4`}>
        <h3 className={`text-lg font-bold ${t.text.heading} mb-3`}>Israel</h3>
        <div className={`space-y-3 text-sm ${t.text.body}`}>
          <p>
            The Israeli military has conducted systematic bombing campaigns across Gaza since October 2023,
            resulting in widespread destruction of civilian infrastructure and cultural heritage sites.
            International law experts and UN officials have documented numerous violations of the laws of war.
          </p>

          <div className={`border-l-4 border-[#ed3039] pl-4 my-3`}>
            <p className={`text-xs ${t.text.muted} mb-2`}>
              <strong>Legal Framework:</strong>
            </p>
            <ul className={`list-disc list-inside space-y-1 text-xs ${t.text.muted}`}>
              <li><strong>1954 Hague Convention:</strong> Prohibits deliberate targeting of cultural property during armed conflict</li>
              <li><strong>Rome Statute Article 8(2)(b)(ix):</strong> Intentionally directing attacks against cultural heritage constitutes a war crime</li>
              <li><strong>UN Genocide Convention Article II(e):</strong> Destruction of cultural heritage as part of destroying a group's identity</li>
            </ul>
          </div>

          <p>
            <strong>Documented Patterns:</strong> Satellite imagery, witness testimony, and forensic analysis
            show deliberate targeting of mosques, churches, museums, libraries, and archaeological sites—many
            with no military presence or justification. UNESCO, Human Rights Watch, and Amnesty International
            have all documented these destructions.
          </p>

          <p>
            <strong>Scale:</strong> Beyond the heritage sites documented here, Israel has destroyed over 60%
            of all buildings in Gaza, displaced 90% of the population, killed over 45,000 Palestinians
            (70% women and children), and rendered the territory largely uninhabitable.
          </p>
        </div>
      </div>

      {/* United States Complicity */}
      <div className={`${t.bg.tertiary} rounded-lg p-6`}>
        <h3 className={`text-lg font-bold ${t.text.heading} mb-3`}>United States</h3>
        <div className={`space-y-3 text-sm ${t.text.body}`}>
          <p>
            The United States has provided critical material, financial, and political support enabling
            these operations, making it directly complicit in the destruction.
          </p>

          <div className={`border-l-4 border-[#009639] pl-4 my-3`}>
            <p className={`text-xs ${t.text.muted} mb-2`}>
              <strong>Material Support:</strong>
            </p>
            <ul className={`list-disc list-inside space-y-1 text-xs ${t.text.muted}`}>
              <li><strong>$18+ billion</strong> in military aid to Israel since October 2023</li>
              <li><strong>Weapons transfers:</strong> 2,000-pound bombs, F-35 fighter jets, artillery shells, and precision-guided munitions</li>
              <li><strong>Emergency resupply:</strong> Multiple expedited weapons deliveries bypassing normal Congressional review</li>
              <li><strong>Intelligence sharing:</strong> Satellite imagery, targeting data, and operational support</li>
            </ul>
          </div>

          <div className={`border-l-4 border-[#009639] pl-4 my-3`}>
            <p className={`text-xs ${t.text.muted} mb-2`}>
              <strong>Political Support:</strong>
            </p>
            <ul className={`list-disc list-inside space-y-1 text-xs ${t.text.muted}`}>
              <li><strong>UN Security Council:</strong> Vetoed multiple ceasefire resolutions</li>
              <li><strong>ICC obstruction:</strong> Threatened sanctions against International Criminal Court prosecutors investigating war crimes</li>
              <li><strong>Diplomatic cover:</strong> Blocked international intervention and accountability measures</li>
              <li><strong>Leahy Law violations:</strong> Continued aid despite credible reports of gross human rights violations</li>
            </ul>
          </div>

          <p>
            <strong>Legal Implications:</strong> Under international law, providing weapons and material support
            with knowledge they will be used for war crimes creates complicity. The US obligation to prevent
            genocide (established in the Genocide Convention) is violated by actively enabling it.
          </p>

          <p>
            <strong>Historical Pattern:</strong> This support continues a decades-long pattern of unconditional
            US military aid to Israel totaling over $260 billion, enabling systematic displacement, occupation,
            and now the destruction documented here.
          </p>
        </div>
      </div>

      {/* Accountability Note */}
      <div className={`mt-4 p-4 rounded-lg ${t.bg.tertiary} border-l-4 border-[#ed3039]`}>
        <p className={`text-xs ${t.text.muted}`}>
          <strong>Note on Documentation:</strong> This project documents verifiable heritage destruction using
          authoritative sources (UNESCO, Forensic Architecture, Heritage for Peace). Attribution of responsibility
          is based on documented military operations, weapons transfers, and established legal frameworks.
          All claims are evidenced and citations are provided throughout the site.
        </p>
      </div>
    </section>
  );
}
