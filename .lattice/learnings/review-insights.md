# Review Insights

- 2026-08-01 [filter-sidebar]: Non-empty default filter values ship with no visual "filter active" signal — any default that hides data needs either a badge or a visible "showing X of Y since <date>" line.
- 2026-08-01 [filter-sidebar]: New tabbed UIs reach for `role="tablist"/"tab"` but stop before `aria-controls` + `role="tabpanel"` — either complete the pattern or use plain buttons.
- 2026-08-01 [testing]: `tsconfig.app.json` excludes `*.test.tsx`, so test fixtures typed as domain types are never checked — fixtures drift from the interfaces they claim (e.g. `releaseNumber` vs `releaseNum`).
- 2026-08-01 [ui]: Hardcoded English keeps re-entering via placeholders and button text (`"From"`, `"Apply"`, `"Filters"`) while labels go through `translate()`.
