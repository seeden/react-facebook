'use client'

import Navigation from '@/components/Navigation'
import CodeBlock from '@/components/CodeBlock'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

const installCode = `npm install react-facebook
# or
yarn add react-facebook
# or
pnpm add react-facebook`

const basicSetupCode = `import { FacebookProvider } from 'react-facebook';

function App() {
  return (
    <FacebookProvider appId="YOUR_FACEBOOK_APP_ID">
      {/* Your app components */}
    </FacebookProvider>
  );
}`

const providerOptionsCode = `<FacebookProvider 
  appId="YOUR_FACEBOOK_APP_ID"
  version="v18.0"           // SDK version
  language="en_US"          // Locale
  debug={true}              // Enable debug mode
  xfbml={true}              // Parse XFBML tags
  cookie={true}             // Enable cookies
  lazy={false}              // Load SDK immediately
>`

const loginExampleCode = `import { Login } from 'react-facebook';

function LoginComponent() {
  const handleSuccess = (response) => {
    console.log('Login Success:', response);
    // response.authResponse contains:
    // - accessToken
    // - userID
    // - expiresIn
    // - signedRequest
  };

  const handleError = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <Login
      scope="email,public_profile"
      onSuccess={handleSuccess}
      onError={handleError}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Login with Facebook
    </Login>
  );
}`

const hooksExampleCode = `import { useFacebook } from 'react-facebook';

function MyComponent() {
  const { isLoading, error, init, api } = useFacebook();

  useEffect(() => {
    if (api) {
      // Facebook SDK is ready
      api.getLoginStatus((response) => {
        console.log('Login status:', response);
      });
    }
  }, [api]);

  if (isLoading) return <div>Loading Facebook SDK...</div>;
  if (error) return <div>Error loading Facebook SDK</div>;

  return <div>Facebook SDK loaded!</div>;
}`

const pixelSetupCode = `<FacebookProvider 
  appId="YOUR_FACEBOOK_APP_ID"
  pixel={{
    pixelId: "YOUR_PIXEL_ID",
    autoConfig: true,
    debug: false,
  }}
>
  {/* Your app */}
</FacebookProvider>`

const pixelTrackingCode = `import { usePixel } from 'react-facebook';

function ProductPage({ product }) {
  const { pageView, track } = usePixel();

  useEffect(() => {
    // Track page view
    pageView();
    
    // Track custom event
    track('ViewContent', {
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'USD'
    });
  }, [product]);

  return <div>{/* Product details */}</div>;
}`

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Getting Started</h1>
          
          {/* Prerequisites */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-blue-900 font-medium mb-2">Before you begin, you'll need:</p>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span>A Facebook App ID from the <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Facebook Developers Console</a></span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span>React 16.8+ (for hooks support)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Installation */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Installation</h2>
            <p className="text-gray-600 mb-4">
              Install the react-facebook package using your preferred package manager:
            </p>
            <CodeBlock code={installCode} language="bash" title="Terminal" />
          </section>

          {/* Basic Setup */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Basic Setup</h2>
            <p className="text-gray-600 mb-4">
              Wrap your application with the FacebookProvider component and provide your Facebook App ID:
            </p>
            <CodeBlock code={basicSetupCode} language="tsx" title="App.tsx" />
          </section>

          {/* Provider Options */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Provider Options</h2>
            <p className="text-gray-600 mb-4">
              The FacebookProvider accepts several configuration options:
            </p>
            <CodeBlock code={providerOptionsCode} language="tsx" title="Provider Configuration" />
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm mr-3">appId</code>
                <span className="text-gray-600">Required. Your Facebook App ID</span>
              </div>
              <div className="flex items-start">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm mr-3">version</code>
                <span className="text-gray-600">Facebook SDK version (default: v18.0)</span>
              </div>
              <div className="flex items-start">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm mr-3">language</code>
                <span className="text-gray-600">Locale for SDK (default: en_US)</span>
              </div>
              <div className="flex items-start">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm mr-3">debug</code>
                <span className="text-gray-600">Enable debug mode for development</span>
              </div>
              <div className="flex items-start">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm mr-3">lazy</code>
                <span className="text-gray-600">Delay SDK loading until needed</span>
              </div>
            </div>
          </section>

          {/* First Component */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your First Component</h2>
            <p className="text-gray-600 mb-4">
              Let's create a simple login button using the Login component:
            </p>
            <CodeBlock code={loginExampleCode} language="tsx" title="LoginComponent.tsx" />
          </section>

          {/* Using Hooks */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Using Hooks</h2>
            <p className="text-gray-600 mb-4">
              React Facebook provides several hooks for programmatic access to the SDK:
            </p>
            <CodeBlock code={hooksExampleCode} language="tsx" title="Using useFacebook Hook" />
          </section>

          {/* Facebook Pixel */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Facebook Pixel Integration</h2>
            <p className="text-gray-600 mb-4">
              To enable Facebook Pixel tracking, add the pixel configuration to your provider:
            </p>
            <CodeBlock code={pixelSetupCode} language="tsx" title="Pixel Setup" />
            
            <p className="text-gray-600 mt-6 mb-4">
              Then use the usePixel hook to track events:
            </p>
            <CodeBlock code={pixelTrackingCode} language="tsx" title="Tracking Events" />
          </section>

          {/* Next Steps */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-facebook/10 to-cyan-500/10 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Next Steps</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  href="/playground"
                  className="flex items-center justify-between bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">Try Interactive Demo</h3>
                    <p className="text-sm text-gray-600">Play with real Facebook components</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-facebook" />
                </Link>
                
                <Link 
                  href="/api"
                  className="flex items-center justify-between bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">API Reference</h3>
                    <p className="text-sm text-gray-600">Explore all components and hooks</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-facebook" />
                </Link>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://github.com/seeden/react-facebook/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-facebook hover:text-facebook-dark"
              >
                Report an Issue →
              </a>
              <a 
                href="https://github.com/seeden/react-facebook/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-facebook hover:text-facebook-dark"
              >
                Join Discussions →
              </a>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  )
}