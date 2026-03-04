# React Facebook

<div align="center">
  <h3>The Facebook SDK for React</h3>
  <p>Login, Pixel, Share, Like, Comments, Graph API — one package, fully typed, SSR-safe.</p>
</div>

<div align="center">

[![NPM version][npm-image]][npm-url]
[![NPM downloads](https://img.shields.io/npm/dm/react-facebook.svg?style=flat-square)](https://www.npmjs.com/package/react-facebook)
[![GitHub stars](https://img.shields.io/github/stars/seeden/react-facebook.svg?style=flat-square)](https://github.com/seeden/react-facebook)
[![Last commit](https://img.shields.io/github/last-commit/seeden/react-facebook.svg?style=flat-square)](https://github.com/seeden/react-facebook/commits/main)
[![Documentation](https://img.shields.io/badge/docs-react--facebook.dev-blue.svg)](https://seeden.github.io/react-facebook)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/react-facebook.svg)](https://github.com/seeden/react-facebook/blob/master/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-facebook)](https://bundlephobia.com/package/react-facebook)

</div>

[npm-image]: https://img.shields.io/npm/v/react-facebook.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/react-facebook
[github-url]: https://github.com/seeden/react-facebook
[support-url]: https://github.com/sponsors/seeden

## Why react-facebook?

- **All-in-one** — Login, Pixel tracking, Share, Like, Comments, Embedded Posts/Videos, Page plugin, Graph API
- **TypeScript-first** — Every component, hook, and return type is fully typed
- **SSR & Next.js ready** — `'use client'` directives and `window` guards built in. No `window is not defined` errors
- **Modern React** — Hooks API (`useLogin`, `usePixel`, `useGraphAPI`, `useLocale`, ...) and Context-based provider
- **Small footprint** — Tree-shakeable, under 15 KB gzipped
- **Error resilient** — `FacebookErrorBoundary` gracefully handles ad blockers and network failures
- **GDPR compliant** — Built-in consent management for Pixel tracking

## Installation

```bash
npm install react-facebook
```

## Quick Start

```tsx
import { FacebookProvider, Login } from 'react-facebook';

function App() {
  return (
    <FacebookProvider appId="YOUR_APP_ID">
      <Login
        onSuccess={(response) => console.log('Login success:', response)}
        onError={(error) => console.error('Login failed:', error)}
      >
        Login with Facebook
      </Login>
    </FacebookProvider>
  );
}
```

## Documentation

**[seeden.github.io/react-facebook](https://seeden.github.io/react-facebook)** — Full docs with examples, API reference, and guides.

- [Getting Started](https://seeden.github.io/react-facebook/docs/getting-started) — Installation, provider setup, first component
- [Components](https://seeden.github.io/react-facebook/docs/components) — Login, Like, Share, Comments, Embeds, Page
- [Hooks](https://seeden.github.io/react-facebook/docs/hooks) — useLogin, useGraphAPI, useShare, useLocale, and more
- [Facebook Pixel](https://seeden.github.io/react-facebook/docs/pixel) — Tracking, page views, custom events, GDPR consent
- [Guides](https://seeden.github.io/react-facebook/docs/migration) — Facebook Login setup, Pixel setup, version upgrades

## What's Included

### Components

| Component                        | Description                                               |
| -------------------------------- | --------------------------------------------------------- |
| `FacebookProvider`               | SDK initialization and context provider                   |
| `Login`                          | Facebook Login with render props and children as function |
| `Like`                           | Like button with layout, color scheme, and share options  |
| `Share` / `ShareButton`          | Share dialog and inline share button                      |
| `Comments` / `CommentsCount`     | Comments plugin and count display                         |
| `EmbeddedPost` / `EmbeddedVideo` | Embed Facebook posts and videos                           |
| `Page`                           | Facebook Page plugin with tabs                            |
| `FacebookPixelProvider`          | Standalone Pixel provider (no SDK required)               |
| `FacebookErrorBoundary`          | Catches SDK failures with customizable fallback           |

### Hooks

| Hook                               | Description                                          |
| ---------------------------------- | ---------------------------------------------------- |
| `useLogin`                         | Programmatic login and logout                        |
| `useProfile`                       | Fetch user profile fields                            |
| `useLoginStatus`                   | Check authentication status                          |
| `useGraphAPI`                      | Typed Graph API calls with loading/error/data states |
| `useShare` / `useFeed` / `useSend` | Share, Feed, and Send dialogs                        |
| `usePixel` / `usePageView`         | Pixel event tracking and automatic page views        |
| `useLocale`                        | Dynamic language switching without page reload       |
| `useFacebook`                      | Direct access to the Facebook SDK instance           |

## Examples

### Facebook Pixel

```tsx
import { FacebookProvider, usePixel } from 'react-facebook';

function App() {
  return (
    <FacebookProvider appId="YOUR_APP_ID" pixelId="YOUR_PIXEL_ID">
      <TrackingExample />
    </FacebookProvider>
  );
}

function TrackingExample() {
  const { track, pageView, grantConsent, revokeConsent } = usePixel();

  return <button onClick={() => track('Purchase', { value: 29.99, currency: 'USD' })}>Buy Now</button>;
}
```

Or use the drop-in imperative API (no provider needed):

```tsx
import { ReactPixel } from 'react-facebook';

ReactPixel.init('YOUR_PIXEL_ID');
ReactPixel.pageView();
ReactPixel.track('Purchase', { value: 29.99, currency: 'USD' });
```

### Graph API

```tsx
import { useGraphAPI } from 'react-facebook';

function UserProfile() {
  const { data, loading, error } = useGraphAPI({
    path: '/me',
    params: { fields: 'name,email,picture' },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>Welcome, {(data as { name: string })?.name}</p>;
}
```

### Login with Hooks

```tsx
import { useLogin, useProfile } from 'react-facebook';

function AuthFlow() {
  const { login, logout, loading } = useLogin();
  const { profile } = useProfile(['name', 'email', 'picture']);

  if (profile) {
    return (
      <div>
        <p>Welcome, {profile.name}</p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return (
    <button onClick={() => login({ scope: 'email,public_profile' })} disabled={loading}>
      Continue with Facebook
    </button>
  );
}
```

### Error Boundary

```tsx
import { FacebookProvider, FacebookErrorBoundary, Login } from 'react-facebook';

<FacebookProvider appId="YOUR_APP_ID">
  <FacebookErrorBoundary
    fallback={(error, reset) => (
      <div>
        <p>Facebook failed to load: {error.message}</p>
        <button onClick={reset}>Try again</button>
      </div>
    )}
  >
    <Login onSuccess={handleSuccess}>Login with Facebook</Login>
  </FacebookErrorBoundary>
</FacebookProvider>;
```

### Dynamic Locale

```tsx
import { useLocale } from 'react-facebook';

function LocaleSwitcher() {
  const { locale, setLocale, isChangingLocale } = useLocale();

  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)} disabled={isChangingLocale}>
      <option value="en_US">English</option>
      <option value="es_ES">Spanish</option>
      <option value="fr_FR">French</option>
      <option value="de_DE">German</option>
    </select>
  );
}
```

## Support

If you find this project useful, please consider [becoming a sponsor][support-url].

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/seeden/react-facebook).

## License

MIT
