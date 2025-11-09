# Implementation Guide - Adding 25 New Heritage Sites

**Date:** 2025-11-09
**Status:** Ready for Implementation
**Sites to Add:** 25 (Sites 46-70)

---

## Quick Summary

✅ **Research Complete:** 25 new sites fully formatted
✅ **UNESCO Coverage:** Exceeds 114-site target (representing 140-160 buildings)
✅ **Data Quality:** All fields populated with verified sources
✅ **Files Ready:** NEW_SITES_FORMATTED.md contains copy-paste ready TypeScript

---

## Implementation Steps

### Step 1: Check TypeScript Types

The grouped collections use a `metadata` field that may not exist in the current `GazaSite` type.

**Check if needed:**
```bash
grep -n "metadata" src/types/index.ts
```

**If not present, add to GazaSite type:**
```typescript
// src/types/index.ts

export interface GazaSite {
  // ... existing fields ...
  metadata?: {
    isCollection?: boolean;
    estimatedBuildingCount?: string;
    collectionRationale?: string;
  };
}
```

### Step 2: Add Sites to mockSites.ts

**File:** `src/data/mockSites.ts`

**Instructions:**
1. Open `docs/research/NEW_SITES_FORMATTED.md`
2. Copy sites 46-70 (formatted TypeScript objects)
3. Paste into `mockSites` array in `src/data/mockSites.ts`
4. Ensure proper array syntax (comma after each entry)

**Expected result:**
```typescript
export const mockSites: GazaSite[] = [
  // ... existing 45 sites ...

  // NEW SITES START (Site 46)
  {
    id: "ibn-othman-mosque",
    name: "Ibn Othman Mosque",
    // ... rest of Site 46
  },
  // ... Sites 47-70 ...
  // NEW SITES END
];
```

**Verification:**
```typescript
// At the end of mockSites.ts, add temporary check:
console.log(`Total sites: ${mockSites.length}`); // Should be 70
```

### Step 3: Handle "historic_building" Type

Check if `historic_building` type exists:

```bash
grep -n "historic_building" src/types/index.ts
```

**If not present, add to GazaSite type definition:**
```typescript
export type SiteType =
  | "mosque"
  | "church"
  | "archaeological_site"
  | "museum"
  | "library"
  | "monument"
  | "palace"
  | "cemetery"
  | "archive"
  | "historic_building"; // ADD THIS
```

### Step 4: Update Filter Configuration (Optional)

If you want "historic_building" to appear in filter dropdowns:

**File:** `src/config/filters.ts`

```typescript
export const SITE_TYPE_OPTIONS = [
  // ... existing types ...
  { value: "historic_building", label: "Historic Building", labelAr: "مبنى تاريخي" },
];
```

### Step 5: Run Tests

```bash
# Run all tests
npm test

# If tests fail due to hardcoded site count (45), update:
# - Find tests that check mockSites.length === 45
# - Change to mockSites.length === 70
```

**Common test files to check:**
- `src/data/mockSites.test.ts` (if it exists)
- `src/hooks/useFilteredSites.test.tsx`
- Any snapshot tests

### Step 6: Update Database Seeds (If Using Local Backend)

```bash
# Auto-generate new seed file from mockSites.ts
npm run db:generate-seed

# Apply seeds to local database
npm run db:seed

# Verify
npm run server:dev
# Check http://localhost:5000/api/sites (should return 70 sites)
```

### Step 7: Test in Dev Environment

```bash
# Start dev server
npm run dev

# Verify:
# 1. Dashboard shows 70 sites
# 2. Filter by "Historic Building" type works
# 3. Map displays all sites
# 4. Timeline shows destruction dates
# 5. Data page table shows 70 rows
# 6. Search works for new site names
```

### Step 8: Update E2E Tests (If Needed)

```bash
# Run E2E tests
npm run e2e

# If tests expect 45 sites, update:
# e2e/smoke.spec.ts or similar files
```

**Example fix:**
```typescript
// Before
expect(await page.locator('[data-testid="site-count"]')).toHaveText('45');

// After
expect(await page.locator('[data-testid="site-count"]')).toHaveText('70');
```

### Step 9: Commit Changes

```bash
# Stage changes
git add src/data/mockSites.ts
git add src/types/index.ts
git add src/config/filters.ts
git add docs/research/

# Commit with conventional format
git commit -m "feat: expand heritage tracker from 45 to 70 sites

- Add 21 individual UNESCO-verified sites (mosques, monuments, archaeological sites, etc.)
- Add 4 grouped collections representing 70-90 unnamed historic buildings
- Exceed UNESCO target of 114 sites (now representing 140-160 buildings)
- All sites verified by UNESCO Gaza Heritage Damage Assessment (Oct 6, 2025)
- Coordinates are estimates pending validation
- Research documented in docs/research/

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Potential Issues & Solutions

### Issue 1: TypeScript Errors for `metadata` Field

**Error:** `Property 'metadata' does not exist on type 'GazaSite'`

**Solution:** Add metadata to GazaSite interface (Step 1)

### Issue 2: Filter Doesn't Show "Historic Building"

**Error:** New sites with type "historic_building" don't appear in filter dropdown

**Solution:**
1. Add to type union (Step 3)
2. Add to filter config (Step 4)

### Issue 3: Tests Fail Due to Site Count

**Error:** `Expected 45 sites, got 70`

**Solution:** Update test assertions to expect 70 sites

### Issue 4: Coordinates Look Wrong on Map

**Note:** All coordinates are estimates. This is expected.

**Solution (Optional):**
- Phase 2: Validate coordinates using satellite imagery
- For now, add note in UI: "Coordinates are approximate"

### Issue 5: Seed Script Fails

**Error:** Database seed fails due to missing fields

**Solution:**
1. Ensure all required fields are present in new sites
2. Check database migration schema matches GazaSite type
3. Re-run: `npm run db:reset && npm run db:setup`

---

## Testing Checklist

Before considering this complete, verify:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] All 1034 tests pass (`npm test`)
- [ ] E2E tests pass (`npm run e2e`)
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Dashboard displays 70 sites
- [ ] All site types filter correctly
- [ ] Map shows all sites with markers
- [ ] Timeline displays destruction events
- [ ] Data table shows all 70 rows
- [ ] Search works for new site names (e.g., "Ibn Othman")
- [ ] Site detail modals open correctly
- [ ] Grouped collections display properly
- [ ] No console errors in browser

---

## Validation Queries

### Check Site Count
```typescript
// In browser console on http://localhost:5173
console.log(mockSites.length); // Should be 70
```

### Check New Sites Exist
```typescript
// Check first new site exists
mockSites.find(s => s.id === 'ibn-othman-mosque'); // Should return object

// Check collection exists
mockSites.find(s => s.id === 'historic-gaza-old-city-residential-a'); // Should return object
```

### Check Types
```typescript
// Get all unique types
const types = [...new Set(mockSites.map(s => s.type))];
console.log(types); // Should include 'historic_building'
```

---

## Rollback Plan

If something goes wrong:

```bash
# Revert mockSites.ts
git checkout HEAD -- src/data/mockSites.ts

# Revert types
git checkout HEAD -- src/types/index.ts

# Revert filters
git checkout HEAD -- src/config/filters.ts

# Reset database (if needed)
npm run db:reset
npm run db:setup
```

---

## Post-Implementation Tasks

After successfully adding sites:

### 1. Update Documentation
- [ ] Update CLAUDE.md with new site count (70)
- [ ] Update README.md if it mentions site count

### 2. Coordinate Validation (Phase 2)
- [ ] Use satellite imagery to validate coordinates
- [ ] Update estimated coordinates with precise ones
- [ ] Document coordinate sources

### 3. Image Research (Phase 3)
- [ ] Find before/after images for new sites
- [ ] Follow IMAGE_SOURCES.md methodology
- [ ] Ensure proper attribution

### 4. Deploy to Production
- [ ] Build production bundle (`npm run build`)
- [ ] Test production build (`npm run preview`)
- [ ] Deploy to Vercel/Netlify
- [ ] Verify on production URL

---

## Files Modified

### Required Changes
- `src/data/mockSites.ts` - Add 25 new sites
- `src/types/index.ts` - Add metadata field, historic_building type

### Optional Changes
- `src/config/filters.ts` - Add historic_building to filter options
- `database/seeds/heritage_sites_seed.sql` - Auto-generated if using local backend

### Test Updates (As Needed)
- Any test files checking `mockSites.length === 45`
- Any snapshot tests
- E2E tests checking site counts

---

## Success Criteria

✅ TypeScript compiles
✅ All tests pass
✅ 70 sites display in UI
✅ Filters work correctly
✅ No runtime errors
✅ Database seeds successfully (if using local backend)
✅ E2E tests pass
✅ Code committed with proper message

---

## Support Resources

**Research Documents:**
- `docs/research/NEW_SITES_FORMATTED.md` - All 25 formatted sites
- `docs/research/RESEARCH_PROGRESS.md` - Session log
- `docs/research/SESSION_SUMMARY.md` - Overview
- `docs/research/SOURCES.md` - Source bibliography

**Testing:**
- Run specific test file: `npm test src/data/mockSites.test.ts`
- Run E2E for specific page: `npm run e2e -- e2e/smoke.spec.ts`
- Debug mode: `npm run e2e:debug`

**Questions?**
Check CLAUDE.md or SESSION_SUMMARY.md for context.

---

**Ready to Implement!**

Estimated time: 30-45 minutes
Risk level: Low (all changes are additive, easy to rollback)

**Start with Step 1 and work through sequentially.**
