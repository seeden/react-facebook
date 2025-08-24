# React Facebook Components

<div align="center">
  <h3>Complete Facebook SDK Integration for React</h3>
  <p>Modern, TypeScript-ready, and feature-complete React components for Facebook integration</p>
</div>

<div align="center">

[![NPM version][npm-image]][npm-url]
[![Documentation](https://img.shields.io/badge/📖_Documentation-GitHub_Pages-blue.svg)](https://seeden.github.io/react-facebook)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/react-facebook.svg)](https://github.com/seeden/react-facebook/blob/master/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-facebook)](https://bundlephobia.com/package/react-facebook)

</div>

[npm-image]: https://img.shields.io/npm/v/react-facebook.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/react-facebook
[github-url]: https://github.com/seeden/react-facebook
[support-url]: https://github.com/sponsors/seeden

## Features

- **Complete Facebook SDK integration** - Like, Share, Comments, Videos, Login, and more
- **Modern React patterns** - Built with TypeScript, React Hooks, and children as function pattern
- **Dynamic locale support** - Change Facebook widget language on-the-fly without page reload
- **Facebook Pixel integration** - Built-in conversion tracking, analytics, and GDPR compliance
- **Flexible styling** - Works with any CSS framework (Tailwind, styled-components, etc.)
- **Tree-shakeable** - Import only what you need for optimal bundle size
- **Async initialization** - Proper lazy loading with error handling and retry logic
- **✨ v10.0.1 Updates** - Unified Login component, removed deprecated features, improved locale handling

## Installation

```bash
npm install react-facebook
# or
yarn add react-facebook
# or
pnpm add react-facebook
```

## 📚 Documentation

**📖 [Interactive Documentation](https://seeden.github.io/react-facebook)** - Live examples, playground, and complete API reference

Our documentation site includes:
- **Live Playground** - Test components with your own Facebook App ID
- **Interactive Examples** - Modify props and see results instantly  
- **Complete API Reference** - All components, hooks, and props documented
- **Copy-paste Examples** - Ready-to-use code snippets
- **Real Facebook Integration** - All examples work with actual Facebook APIs

## Quick Start

```tsx
import { FacebookProvider, Login } from 'react-facebook';

function App() {
  return (
    <FacebookProvider appId="YOUR_APP_ID">
      <Login
        onSuccess={(response) => console.log('Login success:', response)}
        onError={(error) => console.error('Login failed:', error)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Login with Facebook
      </Login>
    </FacebookProvider>
  );
}
```

## Table of Contents

- [Available Components](#available-components)
- [Core Components](#core-components)
- [Authentication](#authentication)
- [Social Features](#social-features)
- [Advanced Features](#advanced-features)
- [Facebook Pixel](#facebook-pixel)
- [Advanced Usage](#advanced-usage)
- [FAQ](#faq)

## Available Components

> ⚠️ **v10.0.1 Breaking Changes**: Removed deprecated Facebook components (CustomChat, MessageUs, MessengerCheckbox, SendToMessenger, Group, Save) and unified login components into a single `Login` component.

**Authentication & Social:**
- [`Login`](#login-component) - Modern unified login component with children as function pattern
- [`Like`](#like-button) - Facebook like button
- [`Share`](#share-components) - Share dialog component
- [`ShareButton`](#share-components) - Direct share button

**Content & Media:**
- [`EmbeddedPost`](#embedded-content) - Embed Facebook posts
- [`EmbeddedVideo`](#embedded-content) - Embed Facebook videos
- [`Comments`](#comments) - Comments plugin
- [`CommentsCount`](#comments) - Comment count display
- [`Page`](#page-plugin) - Facebook page plugin

**Core:**
- [`FacebookProvider`](#facebookprovider) - SDK initialization and context
- [`FacebookPixelProvider`](#facebook-pixel) - Standalone pixel provider
- [Parser](https://seeden.github.io/react-facebook) - Parse XFBML tags

**Removed in v10.0.1** (deprecated by Facebook):
- ~~CustomChat~~ - Customer chat (discontinued May 2024)
- ~~MessageUs~~ - Message button (deprecated Sept 2024)
- ~~MessengerCheckbox~~ - Opt-in checkbox (deprecating July 2025)
- ~~SendToMessenger~~ - Send to messenger (deprecated Sept 2024)
- ~~Group~~ - Facebook group plugin (deprecated)
- ~~Save~~ - Save button (deprecated)
- ~~FacebookLogin~~ & ~~LoginButton~~ - Unified into `Login` component

**Hooks:**
- [`useLogin`](#uselogin-hook) - Programmatic login control
- [`useProfile`](#useprofile) - Get user profile data
- [`useLoginStatus`](#useloginstatus) - Check authentication status
- [`useFacebook`](#usefacebook) - Direct Facebook SDK access
- [`useLocale`](#dynamic-locale-support) - Dynamic language switching
- [`usePixel`](#usepixel-hook) - Facebook Pixel tracking
- [`usePageView`](#usepageview-hook) - Automatic page view tracking
- [`useShare`](#share-components) - Share functionality

## Core Components

### FacebookProvider

The FacebookProvider component initializes the Facebook SDK and provides context to all child components.

```tsx
<FacebookProvider 
  appId="YOUR_APP_ID"     // Required
  version="v23.0"         // Optional, defaults to latest
  language="en_US"        // Optional, defaults to en_US
  lazy={false}            // Optional, load SDK on demand
  debug={false}           // Optional, enable debug mode
  pixel={{                // Optional, Facebook Pixel configuration
    pixelId: "YOUR_PIXEL_ID",
    debug: false,
    autoConfig: true
  }}
>
  {/* Your app */}
</FacebookProvider>
```

## Authentication

### Login Component

A modern, unified Facebook login component (replaces FacebookLogin and LoginButton):

```tsx
// Basic usage with Tailwind CSS
<Login
  onSuccess={(response) => console.log('Success:', response)}
  onError={(error) => console.error('Error:', error)}
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
>
  Continue with Facebook
</Login>

// With automatic profile fetching
<Login
  fields={['name', 'email', 'picture']}  // Specify which profile fields to fetch
  onSuccess={(response) => console.log('Login:', response)}
  onProfileSuccess={(profile) => {
    console.log('Profile:', profile);     // Receives the profile data automatically
  }}
  scope={['public_profile', 'email']}
  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg"
>
  Sign in with Facebook
</Login>

// Children as function pattern for complete control
<Login
  onSuccess={(response) => console.log('Success:', response)}
  onError={(error) => console.error('Error:', error)}
  scope={['public_profile', 'email']}
>
  {({ onClick, isLoading, isDisabled }) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-6 py-3 font-semibold rounded-lg transition-all ${
        isLoading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {isLoading ? 'Connecting...' : 'Continue with Facebook'}
    </button>
  )}
</Login>

// Using custom component (as prop)
<Login 
  as="a" 
  href="#" 
  className="text-blue-600 hover:underline"
  onSuccess={(response) => console.log('Success:', response)}
>
  Connect Facebook Account
</Login>
```

### useLogin Hook

For programmatic login control:

```tsx
function LoginComponent() {
  const { login, isLoading, error } = useLogin();
  
  async function handleLogin() {
    try {
      const response = await login({
        scope: 'email,user_friends',
        authType: ['rerequest'],
      });
      console.log('Logged in:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      Custom Login
    </button>
  );
}
```

## Social Features

### Like Button

```tsx
<Like 
  href="https://example.com" 
  colorScheme="dark" 
  showFaces 
  share 
/>
```

### Share Components

```tsx
// Using the share hook
function ShareExample() {
  const { share, isLoading } = useShare();
  
  return (
    <button onClick={() => share({ href: 'https://example.com' })}>
      Share
    </button>
  );
}

// Using the share button component
<ShareButton 
  href="https://example.com"
  className="my-share-button"
>
  Share this
</ShareButton>
```

### Comments

```tsx
<Comments 
  href="https://example.com/post" 
  numPosts={5}
  orderBy="reverse_time"
  width="100%"
/>
```

### Page Plugin

```tsx
<Page 
  href="https://www.facebook.com/YourPage" 
  tabs="timeline,events,messages"
  width={500}
  height={600}
/>
```

### Embedded Content

```tsx
// Embedded Post
<EmbeddedPost 
  href="https://www.facebook.com/FacebookDevelopers/posts/10151471074398553" 
  width="500" 
/>

// Embedded Video
<EmbeddedVideo 
  href="https://www.facebook.com/facebook/videos/10153231379946729/" 
  width="500" 
  showText 
/>
```

## Advanced Features

### Dynamic Locale Support

Change Facebook widget language dynamically:

```tsx
import { useLocale } from 'react-facebook';

function LocaleSwitcher() {
  const { locale, setLocale, isChangingLocale, availableLocales } = useLocale();
  
  return (
    <select 
      value={locale} 
      onChange={(e) => setLocale(e.target.value)}
      disabled={isChangingLocale}
    >
      {availableLocales.map(loc => (
        <option key={loc} value={loc}>{loc}</option>
      ))}
    </select>
  );
}
```

### Migration from v9.x to v10.0.1

If you were using the old components, here are the migration paths:

```tsx
// OLD: FacebookLogin or LoginButton
<FacebookLogin onSuccess={...} onFail={...} />
<LoginButton onSuccess={...} onError={...} />

// NEW: Login (unified component)
<Login onSuccess={...} onError={...} />

// Deprecated components (removed)
<CustomChat />     // ❌ Discontinued by Facebook (May 2024)
<MessageUs />      // ❌ Deprecated by Facebook (Sept 2024)
<Save />           // ❌ Deprecated by Facebook
<Group />          // ❌ Deprecated by Facebook
```

## Facebook Pixel

### 🎯 Quick Start

Get started with Facebook Pixel tracking in just a few lines:

```tsx
import { FacebookProvider, usePixel } from 'react-facebook';

// Option 1: With FacebookProvider (includes SDK + Pixel)
<FacebookProvider 
  appId="YOUR_APP_ID"
  pixel={{ pixelId: "YOUR_PIXEL_ID" }}
>
  <App />
</FacebookProvider>

// Option 2: Pixel only (no Facebook SDK)
<FacebookPixelProvider pixelId="YOUR_PIXEL_ID">
  <App />
</FacebookPixelProvider>

// Track events anywhere in your app
function TrackingComponent() {
  const { track, pageView, trackCustom } = usePixel();
  
  return (
    <div>
      <button onClick={() => track('Purchase', { value: 29.99, currency: 'USD' })}>
        Track Purchase
      </button>
      <button onClick={() => pageView()}>
        Track Page View
      </button>
      <button onClick={() => trackCustom('ButtonClick', { button: 'hero-cta' })}>
        Track Custom Event
      </button>
    </div>
  );
}
```

### Configuration

Facebook Pixel can be configured directly in the FacebookProvider:

```tsx
<FacebookProvider 
  appId="YOUR_APP_ID"
  pixel={{
    pixelId: "YOUR_PIXEL_ID",
    debug: true,
    autoConfig: true,
    advancedMatching: {
      // Add advanced matching parameters (hashed)
    }
  }}
>
  {/* Your app */}
</FacebookProvider>
```

### usePixel Hook

Access pixel functionality with a clean API:

```tsx
import { usePixel } from 'react-facebook';

function PixelExample() {
  const { track, trackCustom, grantConsent, revokeConsent } = usePixel();
  
  const handlePurchase = () => {
    track('Purchase', {
      value: 29.99,
      currency: 'USD',
      content_name: 'Premium Plan',
      content_category: 'Subscription'
    });
  };

  const handleCustomEvent = () => {
    trackCustom('UserAction', {
      action_type: 'button_click',
      button_name: 'custom_action'
    });
  };

  return (
    <div>
      <button onClick={handlePurchase}>Track Purchase</button>
      <button onClick={handleCustomEvent}>Track Custom Event</button>
    </div>
  );
}
```

### usePageView Hook

Automatically track page views:

```tsx
import { usePageView } from 'react-facebook';

function MyComponent() {
  // Track on mount
  usePageView({ trackOnMount: true });
  
  // Track on route changes
  usePageView({ trackOnRouteChange: true });
  
  return <div>My Component</div>;
}
```

### Standard Events

Facebook Pixel supports these standard events:

- PageView
- ViewContent
- Search
- AddToCart
- AddToWishlist
- InitiateCheckout
- AddPaymentInfo
- Purchase
- Lead
- CompleteRegistration

### Consent Management

GDPR-compliant consent handling:

```tsx
function ConsentManager() {
  const { grantConsent, revokeConsent } = usePixel();
  
  return (
    <div>
      <button onClick={grantConsent}>Accept Tracking</button>
      <button onClick={revokeConsent}>Decline Tracking</button>
    </div>
  );
}
```

## Hooks

### useProfile

```tsx
function ProfileDisplay() {
  const { profile, isLoading, error } = useProfile(['id', 'name', 'email']);
  
  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!profile) return <div>Not logged in</div>;
  
  return (
    <div>
      <img src={profile.picture.data.url} alt={profile.name} />
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
    </div>
  );
}
```

### useLoginStatus

```tsx
function AuthStatus() {
  const { status, isLoading } = useLoginStatus();
  
  return (
    <div>
      Status: {isLoading ? 'Checking...' : status}
    </div>
  );
}
```

### useFacebook

Direct access to the Facebook SDK for advanced use cases:

```tsx
import { useFacebook } from 'react-facebook';

function FacebookAPIExample() {
  const { api } = useFacebook();
  
  async function handleCustomAction() {
    if (!api) return;
    
    // Direct Graph API call
    const response = await api.api('/me/friends', 'GET');
    console.log(response);
    
    // Custom UI dialog
    await api.ui({
      method: 'share',
      href: 'https://example.com',
    });
  }
  
  return <button onClick={handleCustomAction}>Custom Action</button>;
}
```

## Advanced Usage

### Direct SDK Access

For advanced use cases, you can access the Facebook SDK directly:

```tsx
import { useFacebook } from 'react-facebook';

function AdvancedComponent() {
  const { api } = useFacebook();
  
  async function makeCustomCall() {
    if (!api) return;
    
    const response = await api.api('/me/friends', 'GET');
    console.log(response);
  }
  
  return <button onClick={makeCustomCall}>Custom API Call</button>;
}
```


## FAQ

### EU/EEA Region Limitations

**Important**: Like and Comments plugins are affected by Facebook's privacy changes in European regions:

**What's affected:**
- Like Button component
- Comments Plugin component

**Requirements for EU/EEA users:**
- Must be logged into Facebook
- Must have consented to "App and Website Cookies" in Facebook settings

**Result:** If these requirements aren't met, the components will not be visible to users.

**Affected regions:** All EU/EEA countries and the United Kingdom.

This is a Facebook platform limitation, not a library issue. Consider alternative engagement methods for European users.

### Styling

This library doesn't include default styles. Use any CSS framework or styling solution:

```tsx
// Tailwind CSS
<Login className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" />

// CSS Modules  
<Login className={styles.facebookButton} />

// Styled Components
<Login className={styledButton} />
```

### Multiple Providers

Use only one FacebookProvider instance per application. If you need Facebook Pixel separately, you can use FacebookPixelProvider:

```tsx
import { FacebookPixelProvider } from 'react-facebook';

<FacebookPixelProvider pixelId="YOUR_PIXEL_ID" debug={true}>
  {/* Components that need pixel access */}
</FacebookPixelProvider>
```

## Testing

```bash
# Run component tests
npm run test:component

# Run with UI
npm run test
```

## Who's Using This?

Are you using react-facebook in production? We'd love to showcase your success story!

**[Share your testimonial →](https://seeden.github.io/react-facebook/testimonials)**

## Support

If you find this project useful, please consider [becoming a sponsor][support-url].

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## License

MIT © [Zlatko Fedor](http://github.com/seeden)