# Redesign Test Plan

**Goal:** Build a test safety net that survives a UX/UI redesign — so we can freely change *how the app looks* while proving *what the app does* still works.

**Status:** Draft for review. Nothing here is executed yet. Approve sections and I'll implement.

---

## The one idea this plan is built on

A redesign changes markup, class names, layout, and copy. That means tests split into two kinds:

- **Behavior tests** — drive the app the way a *user* does (by role, label, visible text) and assert on *observable outcomes* (results changed, date moved, panel opened). These **survive** a redesign. This is our target.
- **Structure tests** — assert on specific DOM shape, CSS classes, or exact markup. These **break** on a redesign even when nothing is actually broken — or worse, silently pass while testing nothing.

Lattice `test-quality` names the two traps we already have:
- **Testing Implementation Details** → "breaks on refactor with same behavior." Fix: assert observable behavior.
- **Conditional Test Logic** → tests with `if`/`loop`/`try` inside. Fix: remove the logic, let assertions fail naturally.

We have both. This plan trades them for behavior tests.

---

## Are "renders without crashing" tests bad?

Not worthless — but the **weakest tier**, and dangerous as a component's *only* test.

**What they catch:** a component that throws on mount — a bad import, a null deref in initial render, broken context wiring. Cheap smoke value.

**What they miss:** everything a redesign actually risks. A component can render a blank, broken, unusable page and still "not crash." `expect(container).toBeInTheDocument()` passes on a white screen.

**Verdict:**
- As the *sole* test for a component → false comfort. This is why the deleted `DashboardPage.test.tsx` (just "renders without crashing" + "has h1") was correctly removed — a real page-load journey covers the same ground and asserts more.
- As a *cheap first assertion alongside real behavior checks* → fine, keep them.

Rule of thumb: if the only way a test fails is a thrown exception, it's a smoke test, not a safety net.

---

## Where we stand today

Coverage (v8, `npm run test:coverage`):

| Metric | Now | Threshold in config |
|---|---|---|
| Lines | 65.4% | 80% |
| Statements | 64.6% | 80% |
| Branches | 61.1% | 80% |
| Functions | 59.8% | 80% |

1327 unit tests / 79 files, ~15 e2e tests. Thresholds are aspirational — they don't gate `npm test` (which skips coverage).

**Strong (redesign-proof, keep as-is):** the filter and timeline *engines* — `useFilteredSites`, `siteFilters`, `filterStateAdapter`, `timelineCalculations`, `intervalCalculations`, `useTimelineData`, `heritageMetrics`. The hard logic is protected. Good.

**Weak (the redesign risk):**
1. **E2E journeys are thin and partly fake.** Only the filter dropdown *visibility* is checked, not filtering. Several tests hide assertions behind `if (count > 0)` — rename a class and they skip silently, still green.
2. **Mobile has zero active coverage.** The Playwright mobile project is commented out (`playwright.config.ts:65`); the 517-line mobile suite was deleted.
3. **No end-to-end proof of any cross-component workflow** (filter → results, scrubber → map, calendar toggle, language/RTL, theme, export).

---

## Quick wins — ✅ DONE

Executed. Result: the three affected e2e specs run **10 passing / 0 failing / 4 skipped**, and the skips are now *visible* (`test.fixme`) instead of silently green. Unit suite unaffected; lint clean.

| # | Fix | Outcome |
|---|---|---|
| QW1 | Replace `if (count > 0)` guards with direct assertions across `smoke`, `timeline`, `comparison` | Done — and it surfaced that the guards were hiding **more than expected** (below) |
| QW2 | Rewrite the flaky `timeline.spec.ts` load test to wait on the real `data-testid="wayback-slider"` signal; drop `.text-red-600` coupling and HTML-dump debug logic | Done — passes reliably |
| QW3 | Rebuild the dark-mode **convention** guardrail as `src/__tests__/darkModeConvention.test.ts` (fails if any component/page uses a Tailwind `dark:` modifier) | Done — passes (0 offenders today). Dropped the old file's two no-op tests (`expect(true).toBe(true)`) |

**What the guards were hiding (worse than the plan assumed):** nearly every guarded test was *hollow* — its selector never matched, so it had been green while asserting nothing:
- `smoke` nav test queried `getByRole('link')`, but header nav items are `<button>`s → never matched.
- `smoke` marker-click ran on `/` (Timeline landing, markers hidden) → no markers to click.
- `timeline` dashboard-nav guarded on `.timeline-scrubber` → the scrubber is `role="region" aria-label="Timeline Scrubber"`; class doesn't exist.
- `comparison` site-selection (×3) guarded on `.timeline-dot` → dots are D3-rendered inside an `aria-hidden` SVG; that selector doesn't exist.

**Deferred to the workflow phase (now `test.fixme`, visibly pending, not silently green):**
- Marker tap → site detail: dashboard markers render fine, but they're SVG CircleMarkers a plain Playwright `.click()` can't action (hangs to the 60s test cap). Needs force/coordinate click.
- Comparison site-selection (×3): real selection is via the Prev/Next event buttons + async Wayback load. Build with the other journeys.

**Also de-flaked:** the pre-existing `map shows site markers` timeout (15s → 30s) — the heavy lazy map chunk exceeds 15s on a cold dev server under parallel load. (Not in original scope; same fix class as QW2.)

---

## Workflows that need real e2e coverage

The core deliverable. Each is a user journey driven by roles/text, asserting an observable state change. Ordered by redesign-risk. **Review this list — add/cut before I build.**

| Workflow | What a redesign can silently break | Assert (observable) | Today |
|---|---|---|---|
| **Apply a type filter** | Filter control moves into a drawer/menu; wiring lost | Result count / visible rows actually change | ✗ (only visibility) |
| **Apply year + date range** | Slider/inputs restyled | Rows outside range disappear | ✗ |
| **Clear / remove a filter tag** | Tag UI redesigned | Removed filter's results return | ✗ |
| **Combine filters (multi)** | Layout reflow | AND-logic result set correct | partial (unit only) |
| **Timeline scrubber drag** | Scrubber rebuilt | Active date changes *and* map/markers update | ✗ (silent-skip) |
| **Timeline play/pause/next/prev/reset** | Controls relocated | Date advances/resets | partial (unit only) |
| **Select site → comparison view** | Panel/layout change | Before/after maps show, site name shows | partial |
| **Calendar toggle (Gregorian ↔ Islamic)** | Toggle moves | Displayed dates switch systems | ✗ |
| **Language switch + RTL (en/ar/it)** | Header/nav restyled | Text translates; `dir=rtl` applies for Arabic | ✗ |
| **Theme toggle (light/dark)** | Theme control moves | Theme attribute/class flips; app still readable | ✗ |
| **Export (CSV/JSON/GeoJSON)** | Export button relocated | Download triggers with expected filename/rows | ✗ (logic only) |
| **Mobile: hamburger nav** | Responsive breakpoints change | Menu opens, link navigates, menu closes | ✗ (deleted) |
| **Mobile: filter drawer** | Drawer redesigned | Opens, applies a filter, closes | ✗ (deleted) |
| **Mobile: map marker tap** | Touch targets change | Tap marker → detail shows | ✗ (deleted) |

Mobile rows require **re-enabling the Playwright mobile project** (`playwright.config.ts`) — a prerequisite, not optional, if we want mobile protected.

---

## Deleted tests — what to do with each

Checked the delete history. Verdicts:

| Deleted | Verdict |
|---|---|
| `Timeline.sync.test.tsx`, `DashboardPage/DataPage/App.test.tsx` (c72aa6b) | **Leave deleted.** Timeline.sync tested a *pasted copy* of the algorithm, not the real function; the rest were pure smoke tests. |
| `mobile.spec.ts` — 517 lines (ca2efdc) | **Rebuild scenarios, don't restore file.** Great *checklist* (see mobile rows above), but same `if (count>0)` flaw and needs the mobile project re-enabled. |
| `darkModeAutomated.test.tsx` — 231 lines (136e4d3) | **Rebuild** as QW3 — genuine guardrail. |
| config/*.test.ts, tooltip, per-icon `toBeDefined` (various) | **Leave deleted.** Circular constant-value / registry assertions, correctly pruned. |

---

## Deliberately NOT doing

- **Not chasing 80% line coverage.** Coverage % is not the goal; behavior protection is. We could hit 80% with useless smoke tests and be no safer.
- **Not blindly restoring deleted files.** Most were deleted for good reason.
- **Not adding unit tests that assert DOM structure/class names.** Those are the tests we're trying to get *away* from.

---

## Proposed sequence

1. **Quick wins (QW1–QW3)** — honest existing tests + theming guardrail. (~½ day)
2. **Desktop workflow e2e** — filters, timeline, calendar, i18n/RTL, theme, export. (~1 day)
3. **Re-enable mobile project + mobile workflow e2e.** (~½ day)
4. Redesign begins against a green, meaningful suite.

Stack confirmed for all of the above: Vitest + Testing Library (unit/component), Playwright chromium (e2e), MSW (network mocks) — per `.lattice/standards/language-idioms.md`.
