# StatsDashboard Hardcoded Data Audit

**Date:** October 21, 2025
**Issue:** Statistics page has mix of hardcoded data - some should be dynamic, some are historical facts

---

## 🔍 Analysis: What Should Be Dynamic vs. Hardcoded?

### ✅ KEEP HARDCODED - Historical Facts

These are **verifiable historical facts** about specific sites. They should NOT change even if the database grows:

**Site-Specific Details (Historical Facts):**
- ✅ "1,400 years old" - Great Omari Mosque (confirmed age)
- ✅ "62 rare manuscripts destroyed" - Great Omari Mosque (verified count)
- ✅ "1,580 years old (444 CE)" - Byzantine Church (historical date)
- ✅ "400 square meters of Byzantine mosaics" - Church measurement
- ✅ "16 religious texts" - Ancient Greek texts count
- ✅ "2,000+ years old" - Roman Cemetery age
- ✅ "125+ Roman tombs" - Excavated tomb count
- ✅ "3,000+ rare artifacts looted" - Al-Israa University (verified count)
- ✅ "150 years of Palestinian records" - Central Archives timespan
- ✅ "1,700 years old" - Saint Hilarion Monastery
- ✅ "1,600 years old" - Church of St. Porphyrius
- ✅ "4,000 years old" - Tell el-Ajjul
- ✅ "5,300 years old (3300 BCE)" - Tell es-Sakan

**Why keep these?** These are **documented historical facts** verified by UNESCO, archaeologists, and primary sources. Changing them would be factually incorrect.

---

### ❌ MAKE DYNAMIC - Dataset-Dependent Counts

These numbers **change as the database grows** and should use dynamic `stats` values:

**1. Hero Statistic (Line 50-51)**
```typescript
// ❌ CURRENT - Has fallback "5.3k"
{stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) / 10}k` : "5.3k"}

// ✅ FIX - Remove hardcoded fallback
{stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) / 10}k` : "—"}
```
**Reason:** If database is empty, show "—" not a fake number.

---

**2. Museums & Artifacts Context (Line 104)**
```typescript
// ❌ CURRENT - Hardcoded specifics
Including 3,000+ looted artifacts, tens of thousands of books burned, and 150 years
of archives deliberately destroyed.

// ✅ FIX - Make generic or remove
Including looted artifacts, burned archives, and destroyed library collections.
```
**Reason:** This text appears in a card showing `{stats.museumsDestroyed}/{stats.museums}`. The "3,000+" is about ONE specific site (Al-Israa), not all museums. This is misleading when it suggests it applies to all museums.

**Alternative:** Move this specific detail to the site-specific section (lines 181-198) where it already appears correctly.

---

**3. Final Summary (Line 560)**
```typescript
// ❌ CURRENT - Hardcoded "18 sites" and "110+"
These 18 sites are just the beginning—UNESCO has verified damage to 110+ cultural
sites in Gaza. The full scale of loss may never be fully documented.

// ✅ FIX - Use dynamic stats
These {stats.total} documented sites are just the beginning—UNESCO has verified damage
to 110+ cultural sites in Gaza. The full scale of loss may never be fully documented.
```
**Reason:**
- `{stats.total}` - Changes when database grows
- "110+" UNESCO count - This is external data, but could be made configurable

**Better Fix:**
```typescript
// Store UNESCO count in constants or fetch from external source
import { UNESCO_VERIFIED_SITES } from "../../constants/statistics";

These {stats.total} documented sites represent a subset of the {UNESCO_VERIFIED_SITES}+
cultural sites verified damaged by UNESCO. The full scale of loss may never be fully documented.
```

---

**4. "5,300 years" references (Lines 57, 512)**
```typescript
// ❌ CURRENT - Hardcoded "5,300 years"
over 5,300 years of continuous civilization
Gaza's 5,300-year cultural heritage

// ✅ FIX - Use dynamic oldest site age
over {Math.floor(stats.oldestSiteAge / 100) * 100} years of continuous civilization
Gaza's {Math.floor(stats.oldestSiteAge / 1000)}k+-year cultural heritage
```
**Reason:** If a site older than Tell es-Sakan (5,300 years) is added, this should update automatically.

---

## 📊 Summary of Changes Needed

### High Priority - Misleading Context
1. **Line 104** - Remove "3,000+ looted artifacts" from museums card (it's about ONE site, not all museums)

### Medium Priority - Dataset Growth
2. **Line 50-51** - Remove "5.3k" fallback, use "—" for empty data
3. **Line 560** - Replace "18 sites" with `{stats.total}`
4. **Lines 57, 512** - Replace "5,300" with `{Math.floor(stats.oldestSiteAge / 100) * 100}`

### Low Priority - External Data
5. **Line 560** - Make "110+" UNESCO count configurable

---

## 🎯 Implementation Plan

### Phase 1: Fix Misleading Context (Critical)
```typescript
// Line 104 - Make generic
{isDesktop && (
  <p className={`text-xs ${t.text.muted} leading-relaxed`}>
    Including looted artifacts, burned library collections, and destroyed archives
    representing centuries of cultural documentation.
  </p>
)}
```

### Phase 2: Fix Dataset-Dependent Counts
```typescript
// Line 50 - Remove fake fallback
{stats.oldestSiteAge > 0 ? `${Math.floor(stats.oldestSiteAge / 100) / 10}k` : "—"}

// Line 57 - Dynamic heritage age
over {Math.floor(stats.oldestSiteAge / 100) * 100} years of continuous civilization

// Line 512 - Dynamic heritage age
Gaza's {Math.floor(stats.oldestSiteAge / 1000)}k+-year cultural heritage

// Line 560 - Dynamic site count
These {stats.total} documented sites are just the beginning—UNESCO has verified...
```

### Phase 3: Create Statistics Constants
```typescript
// src/constants/statistics.ts
export const UNESCO_VERIFIED_SITES = 110;
export const EXTERNAL_SOURCES = {
  unesco: "https://whc.unesco.org/en/news/2697",
  forensicArchitecture: "https://forensic-architecture.org/",
  heritageForPeace: "https://www.heritageforpeace.org/",
} as const;
```

---

## ✅ What Should NOT Change

### Historical Facts - Keep Hardcoded
All site-specific details should remain hardcoded because they are **verified historical facts**:

- Site ages (1,400 years, 1,580 years, etc.)
- Artifact counts for specific sites (62 manuscripts, 125 tombs, etc.)
- Physical measurements (400 sq meters of mosaics)
- Historical dates (444 CE, 3300 BCE)

**Why?** These are immutable facts. The Great Omari Mosque will always be 1,400 years old, even if we add 500 more sites to the database.

---

## 🚨 Critical Issue: Line 104

**Current code:**
```typescript
<p className={`text-xs ${t.text.muted} leading-relaxed`}>
  Including 3,000+ looted artifacts, tens of thousands of books burned, and 150 years
  of archives deliberately destroyed.
</p>
```

**Location:** Inside the Museums card showing `{stats.museumsDestroyed}/{stats.museums}`

**Problem:** This makes it sound like ALL museums had 3,000+ artifacts looted. But the 3,000+ is specifically from Al-Israa University (lines 189, 233, 370).

**Impact:**
- **Misleading** - Suggests all museums lost 3,000+ artifacts
- **Factually incorrect** - Only Al-Israa University had this specific count
- **Will be worse when database grows** - If you add 10 more museums, this text still says "3,000+"

**Fix:** Make it generic or remove it:
```typescript
<p className={`text-xs ${t.text.muted} leading-relaxed`}>
  Including looted rare artifacts, burned library collections, and destroyed
  archival records representing centuries of cultural documentation.
</p>
```

---

## 📁 Files to Change

- [ ] `src/components/Stats/StatsDashboard.tsx` (4-5 changes)
- [ ] `src/constants/statistics.ts` (NEW - UNESCO count)

---

## ⏱️ Estimated Time

- Phase 1 (Critical fix): 10 minutes
- Phase 2 (Dynamic counts): 15 minutes
- Phase 3 (Constants): 5 minutes
- Testing: 10 minutes

**Total:** 40 minutes

---

Would you like me to implement these fixes now?
