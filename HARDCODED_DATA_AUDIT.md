# Hardcoded Data Audit - Heritage Tracker

**Date:** October 21, 2025
**Issue:** Frontend has hardcoded references to data counts that will become obsolete as database grows

---

## 🔴 Critical Issues - User-Facing Hardcoded Text

### 1. **"150+ Historical Imagery Versions" - Hardcoded in UI**

**Problem:** The "150+" is hardcoded but should reflect actual `releases.length`

**Locations:**
```typescript
// ❌ src/pages/AdvancedAnimation.tsx:44
<div>150+ Historical Imagery Versions</div>

// ❌ src/pages/AdvancedAnimation.tsx:59 (loading state)
<div>Fetching 150+ historical imagery versions</div>

// ❌ src/components/Layout/AppHeader.tsx:65 (tooltip)
title="View 150+ historical satellite imagery versions"

// ❌ src/__tests__/navigation.test.tsx:84 (test assertion)
expect(screen.getByText("150+ Historical Imagery Versions")).toBeInTheDocument();
```

**Impact:**
- When ESRI adds more Wayback releases (currently ~180+), UI will show wrong count
- Misleading to users
- Tests will fail if we fix the UI

**Fix Required:** Use `releases.length` dynamically

---

## 🟡 Medium Priority - Comments & Documentation

### 2. **Site Count References in Comments**

**Locations:**
```typescript
// ⚠️ src/components/SitesTable/VirtualizedTableBody.tsx:3
// This component is prepared for future use (100+ sites) but not activated yet (current: 45 sites)

// ⚠️ src/components/SitesTable/SitesTableDesktop.tsx:136
// Current count: 45 sites - standard rendering is sufficient
```

**Impact:**
- Comments will become outdated when site count increases
- Developers might make wrong assumptions based on stale comments

**Fix Required:** Remove hardcoded "45 sites" reference, make it clear this is a design decision based on threshold

---

### 3. **Wayback Release References in Comments**

**Locations:**
```typescript
// ⚠️ src/contexts/WaybackContext.tsx:8
// Manages manual navigation through 150+ satellite imagery versions

// ⚠️ src/contexts/WaybackContext.tsx:13
// All available Wayback releases (150+)

// ⚠️ src/components/AdvancedTimeline/NavigationControls.tsx:10
// Better performance (12 jumps vs 150+ renders)

// ⚠️ src/components/AdvancedTimeline/WaybackSlider.tsx:19
// Better suited for discrete releases (150+) vs continuous date range

// ⚠️ src/services/waybackService.test.ts:17
// Should have multiple releases (fallback has 3, real API has 150+)
```

**Impact:**
- Documentation becomes stale
- Minor issue (comments are informational)

**Fix Required:** Use more generic language like "many releases" or "100+ releases"

---

## ✅ Already Dynamic - Good Examples

### Data-Driven UI (No Issues)
```typescript
// ✅ src/pages/AdvancedAnimation.tsx:94
{releases.length} Releases • {releases[0]?.releaseDate} → {releases[releases.length - 1]?.releaseDate}

// ✅ All site counting is dynamic
{mockSites.length} sites displayed
{filteredSites.length} results
```

These are already using `.length` properties - perfect! 🎉

---

## 📊 Database Growth Scenarios

### Current State (Static Data)
- **Sites:** 45 (mockSites.ts)
- **Wayback Releases:** ~180 (ESRI API)
- **Hardcoded references:** "150+", "45 sites"

### Future State (Database Integration)
- **Sites:** 110+ (UNESCO verified) → 500+ (community contributed)
- **Wayback Releases:** Will grow over time as ESRI adds more
- **Need:** All counts must be dynamic

### What Breaks When Database Grows?

| Scenario | Current Behavior | Desired Behavior |
|----------|-----------------|------------------|
| ESRI adds 50 more releases (now 230) | Still shows "150+" | Shows "230 Releases" |
| Site count reaches 100 | Comments say "45 sites" | Comments don't mention count |
| Site count reaches 1000 | Virtual scroll not enabled | Auto-enables at threshold |

---

## 🔧 Recommended Fixes

### Priority 1: Fix User-Facing Text

**AdvancedAnimation.tsx:**
```typescript
// BEFORE (line 44)
<div>150+ Historical Imagery Versions</div>

// AFTER
<div>{releases.length} Historical Imagery Versions</div>

// BEFORE (line 59)
<div>Fetching 150+ historical imagery versions</div>

// AFTER
<div>Fetching historical imagery versions...</div>
```

**AppHeader.tsx:**
```typescript
// BEFORE (line 65)
title="View 150+ historical satellite imagery versions"

// AFTER
title="View historical satellite imagery timeline"
// OR if we want to be specific:
title={`View ${releases.length} historical satellite imagery versions`}
// But this requires passing releases to header, not ideal
```

**Problem:** AppHeader doesn't have access to `releases` from WaybackContext!

**Solution Options:**
1. **Simple:** Remove the count from tooltip (just say "View historical satellite imagery timeline")
2. **Complex:** Pass releases count as prop to AppHeader (requires context lifting)
3. **Best:** Make tooltip generic, show count in the page itself (already done in line 94!)

### Priority 2: Fix Comments

**VirtualizedTableBody.tsx:**
```typescript
// BEFORE
// This component is prepared for future use (100+ sites) but not activated yet (current: 45 sites)

// AFTER
// This component is prepared for future use when site count exceeds VIRTUAL_SCROLL_THRESHOLD
// Currently not activated because standard rendering performs well for our dataset
```

**SitesTableDesktop.tsx:**
```typescript
// BEFORE
// Current count: 45 sites - standard rendering is sufficient

// AFTER
// Standard rendering is used when site count < VIRTUAL_SCROLL_THRESHOLD (50)
// Virtual scrolling will auto-activate when threshold is exceeded
```

### Priority 3: Update Tests

**navigation.test.tsx:**
```typescript
// BEFORE
expect(screen.getByText("150+ Historical Imagery Versions")).toBeInTheDocument();

// AFTER
expect(screen.getByText(/\d+ Historical Imagery Versions/)).toBeInTheDocument();
// OR check for the actual count:
expect(screen.getByText(`${mockReleases.length} Historical Imagery Versions`)).toBeInTheDocument();
```

---

## 🎯 Implementation Plan

### Phase 1: Critical User-Facing Fixes (30 min)
1. ✅ Update AdvancedAnimation.tsx header (line 44)
2. ✅ Update AdvancedAnimation.tsx loading state (line 59)
3. ✅ Update AppHeader.tsx tooltip (line 65) - make generic
4. ✅ Update navigation.test.tsx assertion (line 84)

### Phase 2: Documentation Cleanup (15 min)
5. ✅ Update VirtualizedTableBody.tsx comment
6. ✅ Update SitesTableDesktop.tsx comment
7. ✅ Update WaybackContext.tsx comments (use "many" instead of "150+")

### Phase 3: Verification (15 min)
8. ✅ Run tests to ensure nothing broke
9. ✅ Visually verify UI with different release counts
10. ✅ Document changes in commit

**Total Estimated Time:** 1 hour

---

## 🚨 Why This Matters

### Scalability Issues
- When database integration happens (Supabase), site count will jump from 45 → 110+
- ESRI adds new Wayback releases monthly (~5-10 per year)
- Community contributions could push site count to 500+

### User Trust
- Showing "150+" when there are actually 180+ versions looks outdated
- Users might think the app isn't being maintained

### Developer Confusion
- New developers will read comments saying "45 sites" and make wrong assumptions
- Virtual scroll threshold logic is unclear without dynamic references

---

## 📋 Files Requiring Changes

### User-Facing (Critical)
- [ ] `src/pages/AdvancedAnimation.tsx` (2 instances)
- [ ] `src/components/Layout/AppHeader.tsx` (1 instance)
- [ ] `src/__tests__/navigation.test.tsx` (1 instance)

### Documentation (Medium)
- [ ] `src/components/SitesTable/VirtualizedTableBody.tsx` (1 comment)
- [ ] `src/components/SitesTable/SitesTableDesktop.tsx` (1 comment)
- [ ] `src/contexts/WaybackContext.tsx` (2 comments)
- [ ] `src/components/AdvancedTimeline/NavigationControls.tsx` (1 comment)
- [ ] `src/components/AdvancedTimeline/WaybackSlider.tsx` (1 comment)
- [ ] `src/services/waybackService.test.ts` (1 comment)

**Total Files:** 9 files
**Total Changes:** ~13 instances

---

## ✅ Conclusion

**Original Code Review:** Did NOT explicitly check for hardcoded data ❌

**This Audit:** Found 13 instances of hardcoded references to data counts ✅

**Severity:**
- 🔴 Critical: 4 user-facing instances
- 🟡 Medium: 9 documentation/comment instances

**Recommendation:** Fix all critical issues immediately (30 min effort), documentation cleanup can be done later.

Would you like me to implement these fixes now?
