# Claude Context: Theme & Styling Guide

**Purpose:** Optimal context for Claude sessions focused on website theme and styling work.

---

## 1. Theme Architecture Overview

### Where Theme Colors Are Defined

```
src/config/colorThemes.ts
  └─ Palestinian flag colors and theme registry (BASE definitions)

src/hooks/useThemeClasses.ts
  └─ Runtime theme class resolution (ACTUAL source of truth)
  └─ ⚠️ KEY INSIGHT: This file OVERRIDES colorThemes.ts values!
```

### Theme System Hierarchy

```
colorThemes.ts
  ↓ defines the palette
useThemeClasses.ts
  ↓ applies the palette (with potential overrides)
Components
  ↓ use t.layout.appBackground, t.border.primary, etc.
```

---

## 2. Critical Components for Theme Changes

| Component | File | What It Controls |
|-----------|------|------------------|
| Footer | `AppFooter.tsx` | Uses `COLORS` directly for background |
| Background | All pages | Use `t.layout.appBackground` |
| Borders | Major components | Use `t.border.primary` / `t.border.primary2` |
| Red Bar | `DashboardPage.tsx`, `Timeline.tsx`, `SharedLayout.tsx` | Inline `rgba()` styles |

---

## 3. Key Color Values

### Palestinian Flag Colors

```typescript
// Light Mode
FLAG_GREEN: '#009639'
FLAG_RED: '#ed3039'
BACKGROUND: '#fefefe' (off-white)

// Dark Mode
FLAG_GREEN_DARK: '#2d5a38'
FLAG_RED_DARK: '#8b2a30'
BACKGROUND: '#121212' (dark gray, Material Design standard)
```

### Location in Code

```typescript
// src/config/colorThemes.ts
export const COLORS = {
  FLAG_RED: '#ed3039',
  FLAG_RED_DARK: '#8b2a30',
  FLAG_GREEN: '#009639',
  FLAG_GREEN_DARK: '#2d5a38',
  // ...
}

// src/hooks/useThemeClasses.ts
layout: {
  appBackground: isDark ? "bg-[#121212]" : "bg-[#fefefe]",
}
```

---

## 4. Common Gotchas & Lessons Learned

### 🔴 Critical Issue: useThemeClasses.ts Overrides

**Problem:** Changes to `colorThemes.ts` may not appear because `useThemeClasses.ts` has hardcoded overrides.

**Solution:** When changing theme colors:
1. Check `colorThemes.ts` first
2. **Then check `useThemeClasses.ts`** for overrides
3. Update both files if necessary

**Example from this session:**
```typescript
// colorThemes.ts had:
darkScheme: {
  layout: {
    appBackground: "bg-black"  // Changed this
  }
}

// But useThemeClasses.ts still had:
layout: {
  appBackground: isDark ? "bg-[#fefefe] text-black" : "bg-[#fefefe]"  // Hardcoded!
}
// Result: Background didn't change until we updated useThemeClasses.ts
```

### 🟡 Other Important Details

**Text Color Overrides (CRITICAL):**
- ⚠️ **Never use** `className="[&_*]:!text-black"` to force text color
- This breaks dark mode by overriding all theme classes
- Always rely on `t.text.heading`, `t.text.body`, etc. from `useThemeClasses()`
- If you find `[&_*]:!text-black` in any component, remove it immediately

**Red Vertical Bar:**
- Uses inline `rgba()` for opacity control (not Tailwind classes)
- Located in 3 files: `DashboardPage.tsx`, `Timeline.tsx`, `SharedLayout.tsx`
- Current opacity: `0.98` (98%)

**Footer:**
- Uses `COLORS` constant directly (not theme classes)
- Has `transparent` prop for conditional styling
- Must update both light and dark mode colors

**Borders:**

- Dark mode: `border-2 border-white` (2px white borders)
- Light mode: `border-2 border-black` (2px black borders)
- All major component borders use 2px width for consistency
- Default border class (`t.border.default`) now includes `border-2` by default
- Subtle/muted borders use 1px width (`border` class)

**Spacing & Layout:**

- Red bar clearance: All pages use `pl-14` (56px) on main content
- Component margins: Use `mr-4` for right margin, NOT `mx-4` (to avoid double left spacing)
- Footer clearance: Components use `mb-8` (32px) for consistent spacing above footer
- FilterBar top spacing: `mt-4` (16px) on Dashboard/Data pages to match Timeline
- Height calculations: Timeline/Data pages use `h-[calc(100vh-58px)]` to account for header

---

## 5. Testing Checklist

After making theme changes, verify:

- [ ] Light mode appearance
- [ ] Dark mode appearance (toggle in UI)
- [ ] Footer consistency across all pages:
  - [ ] Dashboard
  - [ ] Timeline
  - [ ] About
  - [ ] Stats
  - [ ] Data
- [ ] Border colors on major components
- [ ] Red vertical bar opacity and color
- [ ] Background color (both modes)
- [ ] Text contrast/readability

---

## 6. Quick Reference Commands

```bash
# Development
npm run dev              # See changes live at localhost:5173

# Quality Checks
npm run lint            # ESLint check (must pass before commit)
npm test                # Run unit tests
npm run e2e             # Run E2E tests

# Git Workflow
git status              # See what changed
git add <files>         # Stage changes
git commit -m "..."     # Commit with conventional format
```

---

## 7. File Structure Reference

```
src/
├── config/
│   └── colorThemes.ts              # Base color definitions
├── hooks/
│   └── useThemeClasses.ts          # Runtime theme resolution (OVERRIDES!)
├── components/
│   └── Layout/
│       ├── AppFooter.tsx           # Footer with theme colors
│       └── SharedLayout.tsx        # Shared layout wrapper (red bar)
└── pages/
    ├── DashboardPage.tsx           # Red bar + footer
    └── Timeline.tsx                # Red bar + footer
```

---

## 8. Theme Change Workflow

### Step-by-Step Process

1. **Identify what needs to change**
   - Background? → `useThemeClasses.ts` (`layout.appBackground`)
   - Borders? → `useThemeClasses.ts` (`border.primary/primary2`)
   - Footer? → `AppFooter.tsx` (uses `COLORS` directly)
   - Red bar? → Search for `RED_VERTICAL_LINE` in pages

2. **Make the changes**
   - Update `colorThemes.ts` if defining new colors
   - Update `useThemeClasses.ts` for runtime behavior
   - Update component files for inline styles

3. **Test both modes**
   - Run `npm run dev`
   - Toggle dark mode in UI
   - Check all pages listed in Testing Checklist

4. **Run quality checks**
   ```bash
   npm run lint    # Must pass
   npm test        # Must pass
   ```

5. **Commit**
   ```bash
   git add <files>
   git commit -m "style: descriptive message"
   ```

---

## 9. Example: Changing Background Color

**Goal:** Change dark mode background to dark gray

**Files to update:**
1. `src/config/colorThemes.ts` (line 325)
   ```typescript
   darkScheme: {
     layout: {
       appBackground: "bg-[#121212]",  // Material Design dark gray
     }
   }
   ```

2. `src/hooks/useThemeClasses.ts` (line 148)
   ```typescript
   layout: {
     appBackground: isDark ? "bg-[#121212]" : "bg-[#fefefe]",  // Update isDark case
   }
   ```

**Testing:**
- Light mode: Should be `#fefefe` (off-white)
- Dark mode: Should be `#121212` (dark gray)

---

## 10. Session Summary (November 25, 2025)

### Session 1: Theme Consistency (Morning)

**Changes Made:**
1. **Footer Consistency**
   - Made footer color consistent across all pages
   - Light mode: `#009639`, Dark mode: `#2d5a38`

2. **Red Vertical Bar**
   - Set opacity to 98% (`rgba(..., 0.98)`)

3. **Dark Mode Improvements**
   - Background: Changed to pure black (`#000000`)
   - Borders: Changed to white (`border-white`)

4. **Light Mode Fix**
   - Restored background to off-white (`#fefefe`)

**Files Modified:**
- `AppFooter.tsx`
- `SharedLayout.tsx`
- `colorThemes.ts`
- `useThemeClasses.ts`
- `DashboardPage.tsx`
- `Timeline.tsx`

**Commit:** `fade475` - style: improve theme consistency and dark mode styling

---

### Session 2: Dark Mode Text Color Fix (Evening)

**Problem Found:**
- About, Stats, and Donate pages had hardcoded `className="[&_*]:!text-black"`
- This forced ALL text to black regardless of theme
- Dark mode was unusable on these pages

**Changes Made:**
1. **About.tsx** (line 46)
   - Removed `className="[&_*]:!text-black"` override
   - Now respects `t.text.heading` and `t.text.body` theme classes

2. **StatsDashboard.tsx** (line 25)
   - Removed `className="[&_*]:!text-black"` override
   - Now respects theme classes for all text

3. **ResourcePageLayout.tsx** (line 21-26)
   - Fixed to use `t.text.body` instead of invalid `${bg} ${text}`
   - Proper theme class implementation

**Result:**
- About, Stats, and Donate pages now show white text in dark mode
- Dashboard, Data, and Timeline pages unchanged (already correct)
- All 1,464 tests passing, lint clean

**Files Modified:**
- `src/components/About/About.tsx`
- `src/components/Stats/StatsDashboard.tsx`
- `src/components/Resources/ResourcePageLayout.tsx`

---

### Session 3: Spacing Consistency & Dark Mode Refinement (Afternoon)

**Changes Made:**

1. **Spacing Consistency (Commit: `ef2c824`)**
   - Fixed spacing between red vertical bar and page components
   - Changed horizontal margins from `mx-4` to `mr-4` (removes double left spacing)
   - Updated FilterBar top margin: `mt-2` → `mt-4` in DesktopLayout
   - Increased timeline-footer spacing: `mb-6` → `mb-8` on Dashboard
   - Fixed Data page height: `h-[calc(100vh-100px)]` → `h-[calc(100vh-58px)]` with `pb-8`
   - **Result:** All pages now have consistent 56px left spacing and 32px footer clearance

2. **Dark Mode Background Refinement (Commit: `8d6ed02`)**
   - Changed from pure black `#000000` to dark gray `#121212`
   - Uses Material Design recommended color
   - Provides softer viewing experience (7% brightness)
   - Discernibly different from pure black but maintains dark aesthetic

3. **Translation Fixes (Commit: `1bfcaf6`)**
   - Added missing `donate` translation keys: `organizationsSection`, `unrwaDesc`, `mapDesc`, `pcrfDesc`, `msfDesc`
   - Updated `src/types/i18n.ts` interface
   - Added Italian translations
   - Fixed TypeScript build errors in production

**Files Modified:**

- `src/components/Layout/DesktopLayout.tsx`
- `src/pages/DataPage.tsx`
- `src/config/colorThemes.ts`
- `src/hooks/useThemeClasses.ts`
- `src/types/i18n.ts`
- `src/i18n/it.ts`

**Key Insights:**

- Always use `mr-4` instead of `mx-4` for components inside `pl-14` containers to avoid double left margin
- Height calculations should use `h-[calc(100vh-58px)]` for Timeline/Data pages to match header height
- Use `mb-8` (32px) for bottom spacing before footer across all pages for consistency

---

### Session 4: Border Consistency (Evening)

**Changes Made:**

1. **Border Thickness Standardization**
   - Updated `t.border.default` to use `border-2` in both light and dark modes
   - Changed from `border-white` (1px) to `border-2 border-white` (2px) in dark mode
   - Changed from custom color (1px) to `border-2 border-black` (2px) in light mode
   - Result: All major component borders now have consistent 2px thickness across themes

2. **Code Cleanup**
   - Removed redundant `border` and `border-2` classes throughout the codebase
   - Updated components: About, Donate, StatusLegend, ExportControls, StatsDashboard
   - Simplified class usage: `border ${t.border.default}` → `${t.border.default}`

3. **Border Class Semantics**
   - `t.border.default`: 2px borders (black in light mode, white in dark mode)
   - `t.border.primary` / `t.border.primary2`: 2px borders (same as default)
   - `t.border.subtle` / `t.border.muted`: 1px borders (gray colors)

**Files Modified:**
- `src/hooks/useThemeClasses.ts` (border definitions)
- `src/components/About/About.tsx`
- `src/components/Donate/DonateModal.tsx`
- `src/components/Map/StatusLegend.tsx`
- `src/components/SitesTable/ExportControls.tsx`
- `src/components/Stats/StatsDashboard.tsx`

**Testing:**
- All 1464 tests passing
- Lint clean (zero warnings)
- Border thickness now consistent: 2px white (dark mode) matches 2px black (light mode)

---

**Last Updated:** November 25, 2025

**Latest Commits:**

- `1bfcaf6` - fix: add missing translation keys for DonatePage
- `8d6ed02` - style: change dark mode background from pure black to dark gray
- `ef2c824` - style: improve spacing consistency across Dashboard, Data, and Timeline pages
