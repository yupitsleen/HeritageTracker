# Review Log

## 2026-08-01 — feat/filter-sidebar-settings-tab (filter sidebar + Timeline tabs)
- **Scope**: 59 files (24 commits); UI (components/pages), Application (hooks), cross-cutting (types/i18n), tests
- **Atoms**: clean-code, architecture, test-quality
- **Result**: 0 critical, 4 warning, 6 suggestion
- **Key findings**: default destruction window (2023-10→2024-10) hides recent sites while reporting "no active filter"; `isDestructionDateFilterActive` treats a null start and a null end asymmetrically; `role="tab"` markup without `aria-controls`/`tabpanel` in FilterBar and Timeline
- **Strengths**: DataPage now routes through `useFilteredSites` (killed a duplicated, incomplete inline filter); `darkModeConvention.test.ts` is a real guardrail
- **Follow-up**: all 4 warnings and 5 of 6 suggestions fixed same-session, plus 3 pre-existing e2e failures the branch had introduced (sidebar/timeline tab defaults left the old specs asserting a hidden UI). Declined: splitting FilterBar.tsx — the variants share ~20 memoized handlers, so a split trades one long file for prop-drilling. Gates green: tsc, lint, 1370 unit, 20 e2e.
