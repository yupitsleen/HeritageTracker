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
| 2026-07-28 | **Filters** is the first redesign target; **desktop first, mobile deferred** | FilterBar is a self-contained 485-line single file (lowest blast radius); mobile needs the Playwright mobile project re-enabled — a separate pass | Timeline first (rejected — spans 2 folders + map-sync); full 14-workflow safety net first (rejected — builds guardrails for areas we won't touch this pass) |
| 2026-07-28 | Build the safety net **per-area, just-in-time**, not the whole 14-workflow suite up front | Characterizing only the area we're about to change is cheaper and just as safe; matches refactor-safely's slice loop | Original test-plan sequence: full desktop+mobile suite before any redesign (rejected as over-building) |
| 2026-07-28 | Filters slice 1 = **behavior-preserving dedupe** (kill desktop/mobile double-declaration), *then* UX direction as a separate gated step | The duplicated filter trees ARE the "hard to understand"; a clean single-source structure makes the later visual redesign a one-place edit. Pure refactor first keeps behavior provably intact | Redesign visuals immediately (rejected — no clean structure to redesign against, and mixes behavior change into a refactor) |
| 2026-07-28 | Characterize Headless UI **widget interaction** (Popover/Dialog filters) in **e2e**, not jsdom component tests | In jsdom the Headless UI Popover renders its panel but never delivers inner click/change events, and its Dialog re-commits on open (detaching captured nodes → flaky). Fighting this is over-investment; a real browser runs the widgets correctly | Force component-level interaction (rejected — 0-call failures + irreducible flakiness); skip the wiring proof entirely (rejected — it's the dedupe's main risk) |

## Open Questions

<!-- When resolved, capture as decision above and remove from here. -->

- **Filters UX direction** (slice 2, after the dedupe): what does "more discoverable" concretely mean — surface the most-used filters inline, add active-filter chips, progressive disclosure? To be designed together once the structure is clean.
- Timeline redesign direction (deferred until Filters is done).
- Mobile safety net + mobile redesign (deferred; requires re-enabling the Playwright mobile project, `playwright.config.ts:65`).

## Active Refactor — Filters (slice 1: behavior-preserving dedupe)

**Preservation boundary (must NOT change):**
- `FilterBarProps` contract is identical for all 3 consumers (`DataPage`, `DesktopLayout`, `Timeline`). Every user action fires `onFilterChange(partial)` with the same keys: `searchTerm`, `selectedTypes`, `selectedStatuses`, `destructionDateStart/End`, `creationYearStart/End`, `showUnknownDates`; `onClearAll` clears.
- Search debounce stays 300ms; local input resyncs when `searchTerm` is reset externally.
- Count badges per filter; type/status counts from `sites`; **statuses with 0 count stay hidden**.
- Both surfaces keep working: desktop inline popovers (md+), mobile drawer (<md). A11y (ARIA, `aria-pressed`, keyboard/focus, AA contrast), trilingual + RTL, no Tailwind `dark:` modifiers.

**Out of scope:** new filters, filter-*logic* changes (lives in `useFilteredSites`/`siteFilters`, already tested), visual redesign, mobile-project re-enable.

**Target structure:** declare each filter's content **once** as a `filterSections` array `[{ key, label, count, content }]` built inside the component (keeps handler closures); desktop `.map`s it into `<FilterButton>` popovers, mobile `.map`s it into drawer `<section>`s. Kills ~100 lines of duplicated JSX. Containers stay layout-specific; content is single-source.

**Safety net (characterization) — ✅ GREEN (18/18 unit, 2/2 e2e, lint clean, stable over 8 runs):**
- `src/components/FilterBar/FilterBar.baseline.test.tsx` — search debounce→`onFilterChange`, clear-search, show-unknown-dates→callback, Clear All→`onClearAll`, type popover renders a checkbox per type, status popover hides 0-count statuses, mobile drawer opens, all controls present. (Reliable, no-Headless-UI-event assertions.)
- `e2e/filters.spec.ts` — rewritten honest (dropped the false "73 unit tests" comment + the `if (count>0)` guard); adds the real wiring proof: open type filter + apply → "Showing X of Y sites" count changes.
- Removed one hollow test (`bodyText.length > 20`) from `FilterBar.test.tsx`.

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
