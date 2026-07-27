---
feature: UX/UI Redesign
requirement_doc: null
created: 2026-07-27
---

# UX/UI Redesign

> Simplify the app's most complex, hard-to-discover features (filters and the timeline) so its capabilities actually get used — without breaking any existing functionality.

## Decisions Log

<!-- Add new at bottom. Never remove. -->

| Date | Decision | Reasoning | Alternatives Considered |
|------|----------|-----------|------------------------|
| 2026-07-27 | Build a behavior-focused test safety net *before* redesigning | A visual redesign changes markup/classes/copy; only tests that drive the app by user-facing roles/text and assert observable outcomes survive it | Redesign first, fix tests after (rejected — no way to prove functionality preserved); chase 80% line coverage (rejected, see below) |
| 2026-07-27 | Do **not** chase the config's 80% coverage threshold | Coverage % measures lines executed, not behavior protected; 80% is reachable with useless smoke tests | Enforcing the 80% gate as the goal (rejected) |
| 2026-07-27 | E2E journeys select by accessible role/text, never by CSS class or DOM structure | Structure-coupled selectors break — or silently pass — on a redesign; roles/text are redesign-proof | `data-testid` selectors (kept only where no accessible role exists, e.g. `wayback-slider`) |
| 2026-07-27 | Remove all `if (count>0)` e2e guards; convert unproven interactions to `test.fixme`, not silent skips | A guarded assertion that never runs is false confidence (lattice "Conditional Test Logic" anti-pattern); `fixme` keeps the gap visible | Leave guards (rejected); delete hollow tests outright (rejected — fixme documents the gap) |
| 2026-07-27 | Keep the previously-deleted page/sync smoke tests deleted; rebuild only the dark-mode convention test + (later) mobile scenarios | `Timeline.sync` tested a pasted copy of the algorithm; page tests were "renders without crashing"; mobile + dark-mode covered redesign-sensitive areas | Restore all deleted tests (rejected — most were correctly pruned) |
| 2026-07-27 | Dark mode stays context-based (`isDark`/`useThemeClasses`); a guardrail test fails if any component/page uses a Tailwind `dark:` modifier | `darkMode` is not configured, so `dark:` silently does nothing; a redesign touches every component and could reintroduce it | Configure Tailwind `darkMode` (rejected — established pattern is context-based) |
| 2026-07-27 | Defer marker→detail and comparison site-selection e2e to the workflow-build phase (now `test.fixme`) | Dashboard markers are SVG CircleMarkers a plain Playwright `.click()` can't action (hangs to the 60s cap); comparison selection needs Prev/Next buttons + async Wayback load | Force them into the quick-win batch (rejected — flaky/hanging tests) |

## Open Questions

<!-- When resolved, capture as decision above and remove from here. -->

- Is **mobile** in scope for the redesign safety net? Requires re-enabling the commented-out Playwright mobile project (`playwright.config.ts`).
- Which of the 14 workflow-table rows in `docs/REDESIGN_TEST_PLAN.md` are in/out of scope? (Awaiting review.)
- What is the actual redesign *direction* — which "complicated functions" get simplified first, and how? Filters and the timeline page are flagged as the hardest to understand.

## Constraints

<!-- Non-negotiable once recorded. Add only when confirmed. -->

- **WCAG 2.1 AA**: ARIA labels, keyboard nav (Tab/Enter/Escape), focus management, AA contrast — must hold through every visual change.
- **Trilingual + RTL**: en / ar (RTL) / it must all keep working; use original Arabic names where available.
- **Theme-aware**: light/dark via React context only — no Tailwind `dark:` modifiers (enforced by `darkModeConvention.test.ts`).
- **Cultural sensitivity**: evidence-based only (UNESCO, Forensic Architecture, Heritage for Peace); factual language ("destruction" not "damage"); all sources linked and dated.
- **No hardcoded counts** in docs or UI copy — the data is the source of truth.
- **TypeScript strict**: no `any`, explicit return types; lint must stay zero-warning.
- **Free/public-domain only**: Leaflet, D3, ESRI Wayback, Supabase free tier — no paid deps.

## Key Files

<!-- Add as dev progresses. List paths with brief role note. -->

- `docs/REDESIGN_TEST_PLAN.md` — the safety-net plan + 14-row workflow table (the "what to protect" companion to this doc).
- `e2e/*.spec.ts` — user-journey safety net (`smoke`, `timeline`, `comparison`, `filters`).
- `src/__tests__/darkModeConvention.test.ts` — dark-mode `dark:`-modifier guardrail.
- `src/hooks/useFilteredSites.ts`, `src/utils/siteFilters.ts` — filter engine (redesign-proof logic, well tested).
- `src/components/FilterBar/` — filter UI (flagged complex; redesign target).
- `src/components/Timeline/`, `src/components/AdvancedTimeline/` — timeline UI (flagged complex; redesign target).
- `.lattice/standards/` — knowledge-base, language-idioms, architecture (stable project conventions).
