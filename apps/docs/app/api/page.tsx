'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import CodeBlock from '@/components/CodeBlock'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const apiReference: any = {
  notice: {
    title: "⚠️ Version 10.0.1 Breaking Changes",
    content: `Several components have been removed due to Facebook deprecation:
    
**Removed Components:**
• CustomChat - Discontinued by Facebook (May 2024)
• MessageUs - Deprecated by Facebook (Sept 2024)  
• MessengerCheckbox - Deprecating (July 2025)
• SendToMessenger - Deprecated by Facebook (Sept 2024)
• Group - Deprecated by Facebook
• Save - Deprecated by Facebook

**Unified Login:**
• FacebookLogin & LoginButton merged into single Login component

**EU/EEA Region Limitations:**
Like and Comments components require users to be logged into Facebook AND have consented to cookies. Components will not be visible to EU/EEA/UK users who don't meet both requirements.`
  },
  components: [
    {
      name: 'FacebookProvider',
      description: 'Root provider component that initializes Facebook SDK',
      props: [
        { name: 'appId', type: 'string', required: true, description: 'Your Facebook App ID' },
        { name: 'version', type: 'string', default: 'v18.0', description: 'Facebook SDK version' },
        { name: 'language', type: 'string', default: 'en_US', description: 'Locale for SDK' },
        { name: 'debug', type: 'boolean', default: 'false', description: 'Enable debug mode' },
        { name: 'xfbml', type: 'boolean', default: 'true', description: 'Parse XFBML tags' },
        { name: 'cookie', type: 'boolean', default: 'true', description: 'Enable cookies' },
        { name: 'lazy', type: 'boolean', default: 'false', description: 'Lazy load SDK' },
        { name: 'pixel', type: 'PixelOptions', required: false, description: 'Facebook Pixel configuration' },
      ],
      example: `<FacebookProvider 
  appId="123456789"
  version="v18.0"
  language="en_US"
  pixel={{ pixelId: "987654321" }}
>
  {children}
</FacebookProvider>`
    },
    {
      name: 'Login',
      description: 'Modern unified Facebook login component (replaces LoginButton and FacebookLogin)',
      props: [
        { name: 'scope', type: 'string[]', default: "['public_profile', 'email']", description: 'Array of permissions' },
        { name: 'fields', type: 'string[]', default: '[]', description: 'Profile fields to fetch' },
        { name: 'onSuccess', type: '(response) => void', required: false, description: 'Success callback' },
        { name: 'onError', type: '(error) => void', required: false, description: 'Error callback' },
        { name: 'onProfileSuccess', type: '(profile) => void', required: false, description: 'Profile success callback' },
        { name: 'children', type: 'ReactNode | Function', required: false, description: 'Content or render function' },
        { name: 'as', type: 'ElementType | ComponentType', default: 'button', description: 'Component to render as' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable login' },
        { name: 'className', type: 'string', required: false, description: 'CSS class name' },
        { name: 'returnScopes', type: 'boolean', default: 'false', description: 'Return granted scopes' },
        { name: 'authType', type: 'string[]', required: false, description: 'Auth type parameters' },
        { name: 'rerequest', type: 'boolean', default: 'false', description: 'Re-request permissions' },
        { name: 'reauthorize', type: 'boolean', default: 'false', description: 'Re-authorize permissions' },
      ],
      example: `// Basic usage with Tailwind
<Login
  scope={['email', 'public_profile']}
  onSuccess={(response) => console.log('Success:', response)}
  onError={(error) => console.error('Error:', error)}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
  Continue with Facebook
</Login>

// Children as function pattern
<Login
  scope={['public_profile', 'email']}
  fields={['name', 'email', 'picture']}
  onSuccess={handleSuccess}
  onProfileSuccess={(profile) => console.log('Profile:', profile)}
>
  {({ onClick, isLoading, isDisabled }) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={\`btn \${isLoading ? 'loading' : ''}\`}
    >
      {isLoading ? 'Connecting...' : 'Login with Facebook'}
    </button>
  )}
</Login>

// Custom element
<Login 
  as="a" 
  href="#" 
  className="text-blue-600 hover:underline"
>
  Connect Facebook Account
</Login>`
    },
    {
      name: 'Share',
      description: 'Share dialog component',
      props: [
        { name: 'href', type: 'string', required: true, description: 'URL to share' },
        { name: 'hashtag', type: 'string', required: false, description: 'Hashtag for the post' },
        { name: 'quote', type: 'string', required: false, description: 'Quote to include' },
        { name: 'onSuccess', type: '() => void', required: false, description: 'Success callback' },
        { name: 'onError', type: '(error) => void', required: false, description: 'Error callback' },
        { name: 'children', type: 'RenderProp', required: true, description: 'Render function' },
      ],
      example: `<Share href="https://example.com">
  {({ handleClick }) => (
    <button onClick={handleClick}>Share</button>
  )}
</Share>`
    },
    {
      name: 'Like',
      description: 'Facebook like button',
      warning: '⚠️ EU/EEA/UK users will not see this component unless logged into Facebook and have consented to cookies.',
      props: [
        { name: 'href', type: 'string', required: true, description: 'URL to like' },
        { name: 'layout', type: 'LikeLayout', default: 'standard', description: 'Button layout style' },
        { name: 'size', type: '"small" | "large"', default: 'small', description: 'Button size' },
        { name: 'showFaces', type: 'boolean', default: 'false', description: 'Show profile photos' },
        { name: 'share', type: 'boolean', default: 'false', description: 'Include share button' },
        { name: 'colorScheme', type: '"light" | "dark"', default: 'light', description: 'Color scheme' },
      ],
      example: `<Like 
  href="https://example.com"
  layout="button_count"
  size="large"
  showFaces={true}
  share={true}
/>`
    },
    {
      name: 'Comments',
      description: 'Embedded Facebook comments',
      warning: 'EU/EEA/UK users must be logged into Facebook AND have consented to cookies. Component will not be visible otherwise.',
      props: [
        { name: 'href', type: 'string', required: true, description: 'URL for comments' },
        { name: 'numPosts', type: 'number', default: '10', description: 'Number of posts to show' },
        { name: 'orderBy', type: '"social" | "reverse_time" | "time"', default: 'social', description: 'Sort order' },
        { name: 'width', type: 'string | number', default: '550', description: 'Plugin width' },
        { name: 'colorScheme', type: '"light" | "dark"', default: 'light', description: 'Color scheme' },
      ],
      example: `<Comments 
  href="https://example.com/article"
  numPosts={20}
  orderBy="social"
/>`
    },
    {
      name: 'Page',
      description: 'Embed a Facebook page in your website',
      props: [
        { name: 'href', type: 'string', required: true, description: 'Facebook page URL' },
        { name: 'tabs', type: 'string', default: 'timeline', description: 'Comma-separated list of tabs' },
        { name: 'width', type: 'number', default: '340', description: 'Plugin width' },
        { name: 'height', type: 'number', default: '500', description: 'Plugin height' },
        { name: 'smallHeader', type: 'boolean', default: 'false', description: 'Use small header' },
        { name: 'hideCover', type: 'boolean', default: 'false', description: 'Hide cover photo' },
        { name: 'showFacepile', type: 'boolean', default: 'true', description: 'Show friends faces' },
      ],
      example: `<Page 
  href="https://www.facebook.com/YourPage"
  tabs="timeline,events,messages"
  width={500}
  height={600}
/>`
    },
    {
      name: 'EmbeddedPost',
      description: 'Embed a Facebook post in your website',
      props: [
        { name: 'href', type: 'string', required: true, description: 'Facebook post URL' },
        { name: 'width', type: 'number', default: '500', description: 'Plugin width' },
        { name: 'showText', type: 'boolean', default: 'true', description: 'Show post text' },
      ],
      example: `<EmbeddedPost 
  href="https://www.facebook.com/user/posts/123456789"
  width={500}
  showText={true}
/>`
    },
    {
      name: 'EmbeddedVideo',
      description: 'Embed a Facebook video in your website',
      props: [
        { name: 'href', type: 'string', required: true, description: 'Facebook video URL' },
        { name: 'width', type: 'number', default: '500', description: 'Plugin width' },
        { name: 'showText', type: 'boolean', default: 'true', description: 'Show video description' },
        { name: 'allowFullScreen', type: 'boolean', default: 'true', description: 'Allow fullscreen' },
      ],
      example: `<EmbeddedVideo 
  href="https://www.facebook.com/facebook/videos/123456789"
  width={500}
  showText={true}
/>`
    },
    {
      name: 'CommentsCount',
      description: 'Display the number of comments for any URL',
      props: [
        { name: 'href', type: 'string', required: true, description: 'URL to count comments for' },
      ],
      example: `<CommentsCount href="https://example.com/article" />`
    },
    {
      name: 'ShareButton',
      description: 'Alternative share button implementation',
      props: [
        { name: 'href', type: 'string', required: true, description: 'URL to share' },
        { name: 'layout', type: 'string', default: 'button', description: 'Button layout' },
        { name: 'size', type: '"small" | "large"', default: 'small', description: 'Button size' },
        { name: 'children', type: 'ReactNode', required: false, description: 'Button content' },
      ],
      example: `<ShareButton href="https://example.com">
  Share this content
</ShareButton>`
    },
    {
      name: 'FacebookPixelProvider',
      description: 'Standalone Facebook Pixel provider (can be used independently)',
      props: [
        { name: 'pixelId', type: 'string', required: true, description: 'Facebook Pixel ID' },
        { name: 'autoConfig', type: 'boolean', default: 'true', description: 'Enable automatic configuration' },
        { name: 'debug', type: 'boolean', default: 'false', description: 'Enable debug logging' },
        { name: 'advancedMatching', type: 'Record<string, any>', required: false, description: 'Advanced matching parameters' },
        { name: 'lazy', type: 'boolean', default: 'false', description: 'Delay initialization' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Child components' },
      ],
      example: `<FacebookPixelProvider
  pixelId="123456789"
  autoConfig={true}
  debug={true}
  advancedMatching={{
    em: 'user@example.com', // hashed email
    ph: '+1234567890'       // hashed phone
  }}
>
  {children}
</FacebookPixelProvider>`
    },
  ],
  hooks: [
    {
      name: 'useFacebook',
      description: 'Access Facebook SDK instance and state',
      returns: [
        { name: 'isLoading', type: 'boolean', description: 'SDK loading state' },
        { name: 'error', type: 'Error | undefined', description: 'Loading error if any' },
        { name: 'init', type: '() => Promise<void>', description: 'Initialize SDK manually' },
        { name: 'api', type: 'Facebook | undefined', description: 'Facebook SDK instance' },
        { name: 'parse', type: '(element) => Promise<void>', description: 'Parse XFBML elements' },
      ],
      example: `const { isLoading, error, api } = useFacebook();

useEffect(() => {
  if (api) {
    api.getLoginStatus((response) => {
      console.log(response);
    });
  }
}, [api]);`
    },
    {
      name: 'useLogin',
      description: 'Facebook login functionality',
      returns: [
        { name: 'login', type: '(options?) => Promise<LoginResponse>', description: 'Login function' },
        { name: 'logout', type: '() => Promise<void>', description: 'Logout function' },
        { name: 'isLoading', type: 'boolean', description: 'Loading state' },
        { name: 'error', type: 'Error | undefined', description: 'Error state' },
      ],
      example: `const { login, logout, isLoading } = useLogin();

const handleLogin = async () => {
  const response = await login({ 
    scope: 'email,public_profile' 
  });
  console.log(response);
};`
    },
    {
      name: 'useProfile',
      description: 'Fetch user profile data',
      returns: [
        { name: 'profile', type: 'UserProfile | null', description: 'User profile data' },
        { name: 'loading', type: 'boolean', description: 'Loading state' },
        { name: 'error', type: 'Error | undefined', description: 'Error state' },
        { name: 'fetchProfile', type: '() => Promise<void>', description: 'Refetch profile' },
      ],
      example: `const { profile, loading, fetchProfile } = useProfile();

if (profile) {
  console.log(profile.name, profile.email);
}`
    },
    {
      name: 'usePixel',
      description: 'Facebook Pixel tracking with comprehensive event support',
      returns: [
        { name: 'isLoading', type: 'boolean', description: 'Pixel initialization state' },
        { name: 'error', type: 'Error | undefined', description: 'Loading error if any' },
        { name: 'init', type: '() => Promise<void>', description: 'Initialize pixel manually' },
        { name: 'pixel', type: 'FacebookPixel | undefined', description: 'Pixel instance' },
        { name: 'pageView', type: '() => void', description: 'Track page view event' },
        { name: 'track', type: '(event: PixelEventName, data?: object) => void', description: 'Track standard Facebook event' },
        { name: 'trackCustom', type: '(eventName: string, data?: object) => void', description: 'Track custom event' },
        { name: 'grantConsent', type: '() => void', description: 'Grant GDPR tracking consent' },
        { name: 'revokeConsent', type: '() => void', description: 'Revoke GDPR tracking consent' },
        { name: 'fbq', type: '(...args: any[]) => void', description: 'Direct access to fbq function' },
      ],
      example: `const { track, trackCustom, pageView, grantConsent } = usePixel();

// Track standard Facebook events
track('Purchase', {
  value: 25.00,
  currency: 'USD',
  contents: [{ id: 'product-123', quantity: 1 }]
});

track('ViewContent', {
  content_ids: ['product-123'],
  content_type: 'product',
  value: 25.00,
  currency: 'USD'
});

// Track custom events
trackCustom('NewsletterSignup', {
  email_domain: 'gmail.com'
});

// GDPR compliance
grantConsent();

// Manual page view tracking
pageView();`
    },
    {
      name: 'usePageView',
      description: 'Automatic page view tracking with route change support',
      returns: [
        { name: 'pageView', type: '() => void', description: 'Manual page view trigger' },
        { name: 'isLoading', type: 'boolean', description: 'Loading state' },
      ],
      example: `// Auto-track on mount
usePageView();

// Custom configuration
usePageView({
  trackOnMount: true,
  trackOnRouteChange: true,
  data: { custom_param: 'value' }
});

// Manual tracking only
const { pageView } = usePageView({ trackOnMount: false });
pageView(); // Trigger manually`
    },
    {
      name: 'useLocale',
      description: 'Dynamic locale management',
      returns: [
        { name: 'locale', type: 'string', description: 'Current locale' },
        { name: 'setLocale', type: '(locale: string) => Promise<void>', description: 'Change locale' },
      ],
      example: `const { locale, setLocale } = useLocale();

await setLocale('es_ES');`
    },
    {
      name: 'useShare',
      description: 'Share dialog functionality',
      returns: [
        { name: 'share', type: '(options) => Promise<void>', description: 'Open share dialog' },
        { name: 'isLoading', type: 'boolean', description: 'Loading state' },
        { name: 'error', type: 'Error | undefined', description: 'Error state' },
      ],
      example: `const { share } = useShare();

await share({
  href: 'https://example.com',
  hashtag: '#react'
});`
    },
  ],
  types: [
    {
      name: 'FacebookOptions',
      description: 'Configuration options for Facebook SDK',
      definition: `interface FacebookOptions {
  appId: string;
  version?: string;
  language?: string;
  debug?: boolean;
  xfbml?: boolean;
  cookie?: boolean;
  lazy?: boolean;
}`
    },
    {
      name: 'PixelOptions',
      description: 'Facebook Pixel configuration',
      definition: `interface PixelOptions {
  pixelId: string;
  autoConfig?: boolean;
  debug?: boolean;
  advancedMatching?: Record<string, any>;
}`
    },
    {
      name: 'PixelEventName',
      description: 'Standard Facebook Pixel event names',
      definition: `type PixelEventName = 
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Schedule'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe';`
    },
    {
      name: 'PixelEventData',
      description: 'Event data for Facebook Pixel tracking',
      definition: `interface PixelEventData {
  // Standard parameters
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{
    id: string;
    quantity?: number;
    item_price?: number;
  }>;
  
  // E-commerce specific
  num_items?: number;
  search_string?: string;
  status?: string;
  
  // Custom parameters
  [key: string]: any;
}`
    },
    {
      name: 'LoginResponse',
      description: 'Facebook login response',
      definition: `interface LoginResponse {
  authResponse?: {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
  };
  status: 'connected' | 'not_authorized' | 'unknown';
}`
    },
    {
      name: 'FacebookPixelContextInterface',
      description: 'Context interface for Facebook Pixel provider',
      definition: `interface FacebookPixelContextInterface {
  isLoading: boolean;
  error: Error | undefined;
  init: () => Promise<void>;
  pixel: FacebookPixel | undefined;
  pageView: () => void;
  track: (eventName: PixelEventName, data?: PixelEventData) => void;
  trackCustom: (eventName: string, data?: PixelEventData) => void;
  grantConsent: () => void;
  revokeConsent: () => void;
  fbq: (...args: any[]) => void;
}`
    },
  ]
}

export default function ApiReferencePage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filterItems = (items: any[]) => {
    if (!searchTerm) return items
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Reference</h1>
          <p className="text-lg text-gray-600 mb-8">
            Complete reference for all components, hooks, and types
          </p>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search API..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-facebook"
            />
          </div>

          {/* Components */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Components</h2>
            <div className="space-y-8">
              {filterItems(apiReference.components).map((component) => (
                <motion.div
                  key={component.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{component.name}</h3>
                  <p className="text-gray-600 mb-4">{component.description}</p>
                  
                  {component.warning && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-800">{component.warning}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Props</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {component.props.map((prop: any) => (
                            <tr key={prop.name}>
                              <td className="px-4 py-2 text-sm font-mono text-gray-900">{prop.name}</td>
                              <td className="px-4 py-2 text-sm font-mono text-gray-600">{prop.type}</td>
                              <td className="px-4 py-2 text-sm">
                                {prop.required ? (
                                  <span className="text-red-600">Yes</span>
                                ) : (
                                  <span className="text-gray-400">{prop.default || 'No'}</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">{prop.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <CodeBlock code={component.example} language="tsx" title="Example" showLineNumbers={false} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Hooks */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hooks</h2>
            <div className="space-y-8">
              {filterItems(apiReference.hooks).map((hook) => (
                <motion.div
                  key={hook.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{hook.name}</h3>
                  <p className="text-gray-600 mb-4">{hook.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Returns</h4>
                    <div className="space-y-2">
                      {hook.returns.map((ret: any) => (
                        <div key={ret.name} className="flex items-start">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm mr-3">{ret.name}</code>
                          <div>
                            <span className="text-sm text-gray-600 font-mono mr-2">{ret.type}</span>
                            <span className="text-sm text-gray-600">- {ret.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <CodeBlock code={hook.example} language="tsx" title="Example" showLineNumbers={false} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Types */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">TypeScript Types</h2>
            <div className="space-y-6">
              {filterItems(apiReference.types).map((type) => (
                <motion.div
                  key={type.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <CodeBlock code={type.definition} language="typescript" showLineNumbers={false} />
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  )
}