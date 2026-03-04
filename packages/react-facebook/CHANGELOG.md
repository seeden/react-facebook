# Changelog

## 11.0.0

### Breaking Changes

- **`isLoading` renamed to `loading`** — All hooks, context interfaces, and render props use `loading` instead of `isLoading`.
- **`LoginRenderProps.isLoading` renamed to `loading`** — The `Login` component's children-as-function pattern passes `loading` instead of `isLoading`.
- **`availableLocales` removed from `useLocale`** — The hook no longer returns `availableLocales`. Facebook supports 100+ locales; pass any valid locale string to `setLocale`.

### Migration from 10.x

```diff
- const { login, isLoading } = useLogin();
+ const { login, logout, loading } = useLogin();

- const { locale, setLocale, availableLocales } = useLocale();
+ const { locale, setLocale, isChangingLocale } = useLocale();
```

### New Features

- **`useGraphAPI` hook** — Typed hook for arbitrary Graph API calls with loading/error/data states, auto-fetch, transform, and manual fetch/reset
- **`logout` in `useLogin`** — `logout` is now part of `useLogin` with shared `loading`/`error` state
- **`FacebookErrorBoundary` component** — Error boundary for Facebook SDK errors (ad blockers, network failures) with customizable fallback UI
- **`useDialog` hook** — Generic hook for opening Facebook dialogs programmatically
- **`ReactPixel` standalone API** — Imperative Pixel API that works without a provider: `ReactPixel.init()`, `ReactPixel.track()`, `ReactPixel.pageView()`
- **`FacebookLocale` type relaxed** — Changed from a union of 44 strings to `string`, supporting all 100+ Facebook locales
- **`useFeed` and `useSend` hooks** — Now exported from the main entry point

### Bug Fixes

- **SSR safety** — All `window`/`document` access is now guarded; no more `window is not defined` errors in Next.js or any SSR environment
- **Next.js App Router** — Added `'use client'` directives to all components and hooks; banner preserved in bundled output
- **Script load failures** — Added 10-second timeout and `onerror` handler to Facebook SDK script loading; descriptive errors mentioning ad blockers; retry support after failure
- **Facebook Pixel error handling** — Changed silent failure (`resolve()`) to proper `reject()` with descriptive error on pixel script load failure
- **`useProfile` race conditions** — Stabilized `fields` dependency with `fieldsKey`; added `cancelled` flag pattern to prevent state updates after unmount
- **`ShareButton` type name** — Renamed incorrect `LoginButton` type to `ShareButtonProps`
- **Context re-renders** — Memoized context values in `FacebookProvider` and `FacebookPixelProvider` with `useMemo`/`useCallback`

### Developer Experience

- **TypeScript** — Added explicit return types (`UseLoginReturn`, `UseShareReturn`, `UseFeedReturn`, `UseSendReturn`, `UseGraphAPIReturn`) to all hooks
- **Type exports** — All public types exported from main entry point: `FBError`, `FacebookOptions`, `LoginResponse`, `AuthResponse`, `Method`, `PixelOptions`, `PixelEventName`, `PixelEventData`
- **JSDoc** — Added comprehensive JSDoc with `@example` blocks to all hooks and key components
- **Error messages** — All errors prefixed with `[react-facebook]`; actionable messages mentioning `<FacebookProvider>` or `<FacebookPixelProvider>` when context is missing
- **Consistent error handling** — Action hooks (useLogin, useShare, useFeed, useSend) set error state AND rethrow; data hooks set error state only

### Accessibility

- **Login component** — Added `aria-busy` and `aria-label` attributes

### Testing

- **Unit tests** — 73 Vitest tests covering Facebook SDK, FacebookPixel, ReactPixel, FacebookErrorBoundary, and utilities
- **Updated size-limit** — Increased to 15KB gzipped to match actual bundle size

### Documentation

- **Migration guides** — Step-by-step migration docs for users coming from other packages (see [seeden.github.io/react-facebook/docs/migration](https://seeden.github.io/react-facebook/docs/migration))
- **README** — Rewritten with value-first positioning, comprehensive API overview, and links to documentation site

## 10.0.1

- Unified Login component (removed FacebookLogin and LoginButton)
- Removed deprecated Facebook components (CustomChat, MessageUs, MessengerCheckbox, SendToMessenger, Group, Save)
- Improved locale handling
- Facebook Pixel integration
