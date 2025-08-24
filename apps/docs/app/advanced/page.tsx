'use client'

import Navigation from '@/components/Navigation'
import CodeBlock from '@/components/CodeBlock'
import { motion } from 'framer-motion'
import { Shield, Zap, Globe, Settings, AlertTriangle, CheckCircle } from 'lucide-react'

const serverSideCode = `// Next.js App Router example
import { FacebookProvider } from 'react-facebook';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FacebookProvider 
          appId={process.env.NEXT_PUBLIC_FB_APP_ID}
          lazy={true} // Important for SSR
        >
          {children}
        </FacebookProvider>
      </body>
    </html>
  );
}

// pages/_app.js for Next.js Pages Router
import { FacebookProvider } from 'react-facebook';

function MyApp({ Component, pageProps }) {
  return (
    <FacebookProvider 
      appId={process.env.NEXT_PUBLIC_FB_APP_ID}
      lazy={typeof window === 'undefined'} // Skip on server
    >
      <Component {...pageProps} />
    </FacebookProvider>
  );
}`

const errorHandlingCode = `import { useFacebook, LoginButton } from 'react-facebook';
import { useEffect, useState } from 'react';

function RobustLoginComponent() {
  const { error: sdkError, init } = useFacebook();
  const [loginError, setLoginError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Handle SDK initialization errors
  useEffect(() => {
    if (sdkError) {
      console.error('Facebook SDK Error:', sdkError);
      
      // Retry logic
      if (retryCount < 3) {
        setTimeout(() => {
          init();
          setRetryCount(prev => prev + 1);
        }, 2000 * Math.pow(2, retryCount)); // Exponential backoff
      }
    }
  }, [sdkError, retryCount]);

  const handleLoginError = (error) => {
    setLoginError(error);
    
    // Handle specific error types
    if (error.code === 'FACEBOOK_SDK_NOT_LOADED') {
      // SDK not loaded, try initializing
      init();
    } else if (error.code === 'USER_CANCELLED') {
      // User cancelled login
      console.log('User cancelled login');
    } else {
      // Other errors
      console.error('Login error:', error);
    }
  };

  if (sdkError && retryCount >= 3) {
    return (
      <div className="error-fallback">
        <p>Unable to load Facebook login. Please try again later.</p>
        <button onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div>
      {loginError && (
        <div className="error-message">
          Login failed: {loginError.message}
        </div>
      )}
      
      <LoginButton
        scope="email,public_profile"
        onFail={handleLoginError}
        onSuccess={(response) => console.log('Success!', response)}
      >
        Login with Facebook
      </LoginButton>
    </div>
  );
}`

const performanceCode = `// Lazy loading Facebook SDK
import { FacebookProvider } from 'react-facebook';
import { lazy, Suspense } from 'react';

// Lazy load components that use Facebook SDK
const FacebookLogin = lazy(() => import('./FacebookLogin'));
const FacebookComments = lazy(() => import('./FacebookComments'));

function App() {
  return (
    <FacebookProvider 
      appId="YOUR_APP_ID" 
      lazy={true} // Don't load until needed
    >
      <div>
        {/* SDK loads when this component renders */}
        <Suspense fallback={<div>Loading...</div>}>
          <FacebookLogin />
        </Suspense>
        
        {/* Comments load on demand */}
        <Suspense fallback={<div>Loading comments...</div>}>
          <FacebookComments />
        </Suspense>
      </div>
    </FacebookProvider>
  );
}

// Code splitting with dynamic imports
function DynamicFacebookFeatures() {
  const [showComments, setShowComments] = useState(false);

  const loadComments = async () => {
    const { Comments } = await import('react-facebook');
    setShowComments(true);
  };

  return (
    <div>
      <button onClick={loadComments}>Load Comments</button>
      {showComments && <Comments href="..." />}
    </div>
  );
}`

const securityCode = `// Security best practices
import { useLogin } from 'react-facebook';

function SecureLogin() {
  const { login } = useLogin();

  const handleLogin = async () => {
    try {
      const response = await login({
        scope: 'email,public_profile',
        auth_type: 'rerequest', // Force re-authentication
        return_scopes: true      // Get actual granted permissions
      });

      if (response.authResponse) {
        // Send token to your backend for verification
        const verified = await verifyTokenOnServer(response.authResponse.accessToken);
        
        if (verified) {
          // Store session securely (not in localStorage!)
          // Use httpOnly cookies or secure session storage
          await createSecureSession(verified.sessionToken);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <button onClick={handleLogin}>Secure Login</button>;
}

// Backend token verification (Node.js example)
async function verifyTokenOnServer(accessToken) {
  const response = await fetch(
    \`https://graph.facebook.com/me?access_token=\${accessToken}&fields=id,name,email\`
  );
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error('Invalid token');
  }
  
  // Additional verification with app secret
  const appProof = crypto
    .createHmac('sha256', process.env.FB_APP_SECRET)
    .update(accessToken)
    .digest('hex');
    
  // Verify the token belongs to your app
  // Create secure session
  return { 
    userId: data.id, 
    sessionToken: generateSecureToken() 
  };
}`

const gdprCode = `// GDPR Compliance with consent management
import { FacebookProvider, usePixel } from 'react-facebook';
import { useState, useEffect } from 'react';

function GDPRCompliantApp() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const consent = localStorage.getItem('fb_tracking_consent');
    setHasConsent(consent === 'granted');
  }, []);

  const handleConsent = (granted) => {
    setHasConsent(granted);
    localStorage.setItem('fb_tracking_consent', granted ? 'granted' : 'denied');
  };

  return (
    <FacebookProvider 
      appId="YOUR_APP_ID"
      pixel={{
        pixelId: "YOUR_PIXEL_ID",
        autoConfig: false, // Don't auto-track
      }}
    >
      {!hasConsent && <ConsentBanner onConsent={handleConsent} />}
      <ConditionalPixelTracking enabled={hasConsent} />
      {/* Your app */}
    </FacebookProvider>
  );
}

function ConditionalPixelTracking({ enabled }) {
  const { grantConsent, revokeConsent, pageView } = usePixel();

  useEffect(() => {
    if (enabled) {
      grantConsent();
      pageView(); // Track after consent
    } else {
      revokeConsent();
    }
  }, [enabled]);

  return null;
}

function ConsentBanner({ onConsent }) {
  return (
    <div className="consent-banner">
      <p>We use cookies and similar technologies...</p>
      <button onClick={() => onConsent(true)}>Accept</button>
      <button onClick={() => onConsent(false)}>Decline</button>
    </div>
  );
}`

const testingCode = `// Testing with Jest and React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
import { FacebookProvider, LoginButton } from 'react-facebook';
import userEvent from '@testing-library/user-event';

// Mock Facebook SDK
jest.mock('react-facebook', () => ({
  FacebookProvider: ({ children }) => <div>{children}</div>,
  LoginButton: jest.fn(({ children, onSuccess, onFail }) => (
    <button onClick={() => onSuccess({ authResponse: mockAuthResponse })}>
      {children}
    </button>
  )),
}));

const mockAuthResponse = {
  accessToken: 'mock-token',
  userID: '123456',
  expiresIn: 3600,
  signedRequest: 'mock-signed-request',
};

describe('Facebook Login', () => {
  it('should handle successful login', async () => {
    const handleSuccess = jest.fn();
    
    render(
      <FacebookProvider appId="test-app-id">
        <LoginButton onSuccess={handleSuccess}>
          Login
        </LoginButton>
      </FacebookProvider>
    );
    
    const button = screen.getByText('Login');
    await userEvent.click(button);
    
    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith({
        authResponse: mockAuthResponse
      });
    });
  });
});

// E2E testing with Cypress
describe('Facebook Integration', () => {
  beforeEach(() => {
    cy.visit('/');
    // Stub Facebook SDK
    cy.window().then((win) => {
      win.FB = {
        init: cy.stub(),
        login: cy.stub().callsFake((callback) => {
          callback({ authResponse: mockAuthResponse });
        }),
      };
    });
  });

  it('should login with Facebook', () => {
    cy.get('[data-testid="fb-login-button"]').click();
    cy.get('[data-testid="user-profile"]').should('be.visible');
  });
});`

export default function AdvancedPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Advanced Usage & Best Practices</h1>
          
          {/* Server-Side Rendering */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Settings className="w-6 h-6 text-facebook mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Server-Side Rendering (SSR)</h2>
            </div>
            <p className="text-gray-600 mb-4">
              React Facebook works seamlessly with SSR frameworks like Next.js and Remix. 
              Use the lazy loading feature to prevent SDK initialization on the server.
            </p>
            <CodeBlock code={serverSideCode} language="tsx" title="SSR Setup" />
          </section>

          {/* Error Handling */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Error Handling & Recovery</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Implement robust error handling with retry logic and fallback UI for better user experience.
            </p>
            <CodeBlock code={errorHandlingCode} language="tsx" title="Error Handling" />
          </section>

          {/* Performance Optimization */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Performance Optimization</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Optimize bundle size and loading performance with lazy loading and code splitting.
            </p>
            <CodeBlock code={performanceCode} language="tsx" title="Performance Optimization" />
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Performance Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Use lazy loading for SDK initialization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Implement code splitting for Facebook components</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Load components on-demand with dynamic imports</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Use React.memo for components with Facebook plugins</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Security Best Practices */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Security Best Practices</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Implement proper authentication flow with server-side token verification for production applications.
            </p>
            <CodeBlock code={securityCode} language="tsx" title="Security Implementation" />
            
            <div className="mt-6 bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Security Checklist</h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• Never store access tokens in localStorage</li>
                <li>• Always verify tokens on your backend</li>
                <li>• Use HTTPS in production</li>
                <li>• Implement proper CORS policies</li>
                <li>• Request minimal permissions</li>
                <li>• Implement token refresh logic</li>
              </ul>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">GDPR & Privacy Compliance</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Implement consent management for Facebook Pixel and ensure GDPR compliance.
            </p>
            <CodeBlock code={gdprCode} language="tsx" title="GDPR Compliance" />
          </section>

          {/* Testing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Testing Strategies</h2>
            <p className="text-gray-600 mb-4">
              Comprehensive testing approach for Facebook integrations including unit and E2E tests.
            </p>
            <CodeBlock code={testingCode} language="tsx" title="Testing Examples" />
          </section>

          {/* Common Pitfalls */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Pitfalls to Avoid</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-900">Multiple SDK Initializations</h3>
                <p className="text-yellow-800 text-sm mt-1">
                  Ensure FacebookProvider is only used once at the root of your app. Multiple providers will cause conflicts.
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-900">Missing Domain Configuration</h3>
                <p className="text-yellow-800 text-sm mt-1">
                  Add all your domains (including localhost for development) to your Facebook App settings.
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-900">Incorrect App ID</h3>
                <p className="text-yellow-800 text-sm mt-1">
                  Use environment variables for App IDs and ensure you're using the correct ID for each environment.
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-900">Race Conditions</h3>
                <p className="text-yellow-800 text-sm mt-1">
                  Always check if the SDK is loaded before making API calls. Use the isLoading state from hooks.
                </p>
              </div>
            </div>
          </section>


          {/* Resources */}
          <section className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="https://developers.facebook.com/docs/facebook-login/web"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <span>Facebook Login Documentation</span>
                <span className="text-facebook">→</span>
              </a>
              <a 
                href="https://developers.facebook.com/tools/debug/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <span>Facebook Debugger Tool</span>
                <span className="text-facebook">→</span>
              </a>
              <a 
                href="https://github.com/seeden/react-facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <span>GitHub Repository</span>
                <span className="text-facebook">→</span>
              </a>
              <a 
                href="https://www.npmjs.com/package/react-facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <span>NPM Package</span>
                <span className="text-facebook">→</span>
              </a>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  )
}