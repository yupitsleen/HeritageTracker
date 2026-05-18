---
language: typescript
version: "5.9"
---

# Language Idioms: TypeScript

## Error Handling

TypeScript uses try/catch with custom typed error interfaces (not Error subclasses). Errors are normalized to `ApiError` (from `src/types/errors.ts`) using `toApiError(err)`. Unknown errors use `unknown` type and are narrowed with `instanceof Error` checks before use. Error codes are `as const` objects (`ErrorCode`). No Result/Either pattern — errors throw or surface via hook state (`error: Error | null`).

## Type System & Object Model

Strict TypeScript (no `any`, `unknown` for untyped boundaries). Domain objects modeled as interfaces and type aliases — not classes. Functional React components only (no class components). Enums replaced by `as const` objects with `keyof typeof` derived types. Union and discriminated union types for state variants. Composition via custom hooks and props, not inheritance. Absence modeled as `null` (not `undefined`) for explicit nullable state.

## Naming Conventions

- `camelCase` — variables, functions, hooks (`useFilteredSites`)
- `PascalCase` — types, interfaces, components (`FilterState`, `AppHeader`)
- `SCREAMING_SNAKE_CASE` — constants (`Z_INDEX`, `ERROR_MESSAGES`)
- No `I` prefix on interfaces (`FilterState` not `IFilterState`)
- Hooks prefixed with `use` (`useAppState`, `useWaybackReleases`)
- Test files co-located with `Component.test.tsx` naming

## Testing Patterns

Vitest (not Jest) with `describe`/`it` blocks. `@testing-library/react` for component and hook tests (`renderHook`, `act`). Mocks via `vi.fn()`, timers via `vi.useFakeTimers()`. MSW 2.11.6 for API mocking at the network layer. Setup/teardown with `beforeEach`/`afterEach`. E2E via Playwright (chromium only). Backend tests use Vitest with Jest-compatible API. Test files are co-located (`Component.test.tsx` alongside `Component.tsx`).

## Parameter & Function Design

Component props as named interfaces with `Props` suffix (e.g. `FilterBarProps`). Hook options as named interfaces with `Options` suffix (e.g. `UseAsyncQueryOptions`). Destructured parameters with defaults at call site. Stable callbacks wrapped in `useCallback`. Optional chaining (`?.`) and nullish coalescing (`??`) for safe access. Generic hooks typed with explicit type parameters (`useAsyncQuery<TData, TParams>`). No method overloading — use union types or optional params.

## Dependency Management

No DI container. Dependencies flow via props (shallow) or React Context (cross-cutting: theme, locale, animation, calendar). Shared stateful logic extracted into custom hooks. API adapters instantiated at module level via the 3-mode adapter pattern (`MockAdapter`, `LocalBackendAdapter`, `SupabaseAdapter`) — selected by env vars, not at runtime. Named exports throughout (no default exports). Contexts consumed via `use*` hooks (`useTheme`, `useTranslation`).

---
*Generated for Heritage Tracker on 2026-05-18. Language: TypeScript 5.9.*
*Produced by the language-idioms-refiner skill.*
