# Refactor DashboardPage and Timeline to Use SharedLayout

**Status:** Not Started
**Priority:** Medium
**Estimated Effort:** 2-3 hours
**Risk:** Medium (these are complex pages with custom help modals)

---

## Current State

### Pages Using SharedLayout ✅
- [AboutPage.tsx](../src/pages/AboutPage.tsx) - Uses SharedLayout directly
- [StatsPage.tsx](../src/pages/StatsPage.tsx) - Uses SharedLayout directly
- [DataPage.tsx](../src/pages/DataPage.tsx) - Uses SharedLayout directly
- [DonatePage.tsx](../src/pages/DonatePage.tsx) - Uses SharedLayout via ResourcePageLayout

### Pages with Custom Layout ❌
- [DashboardPage.tsx](../src/pages/DashboardPage.tsx) - 408 lines, custom layout with DashboardHelpModal
- [Timeline.tsx](../src/pages/Timeline.tsx) - 361 lines, custom layout with TimelineHelpModal

---

## Problem

Both `DashboardPage` and `Timeline` duplicate the following SharedLayout elements:
- Red vertical bar (with z-index)
- Skip to content link
- AppHeader
- AppFooter
- Theme wrapper div
- Help modal state management

**Duplication leads to:**
- Inconsistency risk (already happened with z-index)
- More code to maintain
- Harder to add new pages
- Repeated patterns

---

## Solution Overview

Refactor both pages to use `SharedLayout` with custom help content.

### SharedLayout Already Supports

```typescript
interface SharedLayoutProps {
  children: ReactNode;
  showFooter?: boolean;        // Control footer visibility
  isMobile?: boolean;           // Footer responsiveness
  helpContent?: ReactNode;      // Custom help modal content
}
```

### What Needs to Change

Replace the custom layout wrapper with `<SharedLayout>` and pass custom help content.

---

## Step-by-Step Refactor Plan

### Phase 1: DashboardPage

**Current Structure:**
```typescript
export function DashboardPage() {
  // ... state and hooks ...

  return (
    <div data-theme={...} className="min-h-screen relative ...">
      <a href="#main-content">Skip to content</a>
      <div className="fixed top-0 left-0">{/* Red bar */}</div>
      <AppHeader onOpenHelp={() => appState.setIsHelpOpen(true)} />
      <main id="main-content">
        {/* Page content */}
      </main>
      <AppFooter isMobile={isMobile} />
      <DashboardHelpModal
        isOpen={appState.isHelpOpen}
        onClose={() => appState.setIsHelpOpen(false)}
      />
    </div>
  );
}
```

**After Refactor:**
```typescript
export function DashboardPage() {
  // ... state and hooks ...

  return (
    <SharedLayout
      showFooter={true}
      isMobile={isMobile}
      helpContent={<DashboardHelpModal />}
    >
      {/* Page content only - no wrapper elements */}
      {isLoading ? (
        <LoadingSpinner fullScreen message="Loading heritage sites..." />
      ) : (
        <Suspense fallback={<LoadingSpinner fullScreen message="Loading dashboard..." />}>
          <DesktopLayout {...props} />
        </Suspense>
      )}

      {/* Modals */}
      <Modal isOpen={appState.selectedSite !== null} onClose={appState.clearSelectedSite}>
        <Suspense fallback={<LoadingSpinner message="Loading site details..." />}>
          <SiteDetailPanel ... />
        </Suspense>
      </Modal>
    </SharedLayout>
  );
}
```

**Changes Required:**
1. Import `SharedLayout`
2. Remove custom layout wrapper (div, red bar, skip link, header, footer)
3. Convert `DashboardHelpModal` to accept no props (modal state managed by SharedLayout)
4. Remove `isHelpOpen` state from `useAppState` hook
5. Update tests to expect SharedLayout wrapper

**Files to Modify:**
- `src/pages/DashboardPage.tsx` (main refactor)
- `src/components/Help/DashboardHelpModal.tsx` (remove modal wrapper, just return content)
- `src/hooks/useAppState.ts` (remove isHelpOpen state)
- `src/pages/DashboardPage.test.tsx` (update assertions)

---

### Phase 2: Timeline Page

**Current Structure:**
```typescript
export function Timeline() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div data-theme={...} className="min-h-screen relative ...">
      <div className="fixed top-0 left-0">{/* Red bar */}</div>
      <AppHeader onOpenHelp={() => setIsHelpOpen(true)} />
      <main className="h-[calc(100vh-58px)] p-4 pb-8 ...">
        {/* Page content */}
      </main>
      <AppFooter isMobile={false} />
      <TimelineHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
```

**After Refactor:**
```typescript
export function Timeline() {
  return (
    <SharedLayout
      showFooter={true}
      isMobile={false}
      helpContent={<TimelineHelpModal />}
    >
      {/* Page content only */}
      <main className="h-[calc(100vh-58px)] p-4 pb-8 ...">
        {isLoading && <LoadingSpinner />}

        <Suspense fallback={<LoadingSpinner />}>
          <ComparisonMapView ... />
        </Suspense>

        {/* Modals and other content */}
      </main>
    </SharedLayout>
  );
}
```

**Changes Required:**
1. Import `SharedLayout`
2. Remove custom layout wrapper (div, red bar, header, footer)
3. Convert `TimelineHelpModal` to return content only (no Modal wrapper)
4. Remove local `isHelpOpen` state
5. Keep `main` element with custom height calculations
6. Update tests

**Files to Modify:**
- `src/pages/Timeline.tsx` (main refactor)
- `src/components/Help/TimelineHelpModal.tsx` (remove modal wrapper)
- `src/pages/__tests__/Timeline.sync.test.tsx` (update assertions if needed)

---

## Help Modal Pattern Change

### Current Pattern (Bad)
```typescript
// Component manages Modal wrapper AND content
export function DashboardHelpModal({ isOpen, onClose }: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} zIndex={...}>
      <div className="p-6">
        {/* Help content */}
      </div>
    </Modal>
  );
}
```

### New Pattern (Good)
```typescript
// Component only returns content, SharedLayout handles Modal wrapper
export function DashboardHelpModal() {
  const t = useThemeClasses();

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>
        Dashboard Help
      </h2>
      {/* Help content */}
    </div>
  );
}
```

**Why This is Better:**
- SharedLayout manages all modal state
- Help components are pure content
- Consistent modal behavior across all pages
- No prop drilling

---

## Testing Strategy

### 1. Unit Tests
- Verify SharedLayout renders correctly
- Verify custom help content appears
- Verify footer visibility controls work
- Verify isMobile prop is passed to footer

### 2. E2E Tests (Optional)
- Smoke test: All pages load without errors
- Help button opens modal on each page
- Custom help content renders correctly

### 3. Manual Testing Checklist
- [ ] Dashboard page loads correctly
- [ ] Timeline page loads correctly
- [ ] Help button works on all pages
- [ ] Red vertical bar appears consistently (z-index 1250)
- [ ] Header and footer render correctly
- [ ] Skip to content link works
- [ ] Theme switching works
- [ ] Mobile view works (if applicable)

---

## Risks & Mitigation

### Risk 1: Breaking Existing Tests
**Likelihood:** High
**Impact:** Medium
**Mitigation:**
- Run full test suite before commit
- Update test assertions to expect SharedLayout wrapper
- May need to update snapshot tests

### Risk 2: Layout/Spacing Issues
**Likelihood:** Medium
**Impact:** Medium
**Mitigation:**
- Test on multiple screen sizes
- Compare before/after screenshots
- Keep main content wrapper classes the same

### Risk 3: Modal State Bugs
**Likelihood:** Low
**Impact:** High
**Mitigation:**
- Test help modal opening/closing thoroughly
- Verify modal state doesn't conflict with other modals
- Check z-index layering

---

## Success Criteria

✅ All 6 pages use SharedLayout
✅ All tests pass (1464 unit + 16 E2E)
✅ No visual regressions
✅ Help button works on all pages
✅ Code is DRYer (less duplication)
✅ New pages are easier to add

---

## Alternative Approach (Not Recommended)

Instead of refactoring to use SharedLayout, we could:
1. Extract shared elements into a `usePageLayout` hook
2. Keep custom layout code in each page
3. Just ensure z-index consistency

**Why this is worse:**
- Still have duplication
- More complex hook API
- Harder to maintain
- Doesn't solve the root problem

---

## Related Files

### Core Files
- [src/components/Layout/SharedLayout.tsx](../src/components/Layout/SharedLayout.tsx) - Already updated to support custom help content
- [src/constants/layout.ts](../src/constants/layout.ts) - Z-index constants

### Pages to Refactor
- [src/pages/DashboardPage.tsx](../src/pages/DashboardPage.tsx)
- [src/pages/Timeline.tsx](../src/pages/Timeline.tsx)

### Help Modals to Update
- [src/components/Help/DashboardHelpModal.tsx](../src/components/Help/DashboardHelpModal.tsx)
- [src/components/Help/TimelineHelpModal.tsx](../src/components/Help/TimelineHelpModal.tsx)

### Tests to Update
- [src/pages/DashboardPage.test.tsx](../src/pages/DashboardPage.test.tsx)
- [src/pages/__tests__/Timeline.sync.test.tsx](../src/pages/__tests__/Timeline.sync.test.tsx)

---

## Notes

- This refactor doesn't need to block other work
- Can be done in separate PRs (DashboardPage first, then Timeline)
- Low priority but high value for long-term maintainability
- Good opportunity to add more E2E tests for visual regression
