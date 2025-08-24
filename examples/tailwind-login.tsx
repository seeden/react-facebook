import React from 'react';
import { FacebookProvider, FacebookLogin } from 'react-facebook';

// Example: Facebook Login with Tailwind CSS
export default function TailwindExample() {
  return (
    <FacebookProvider appId="your-app-id">
      {/* Basic Tailwind button */}
      <FacebookLogin
        onSuccess={(response) => console.log('Success:', response)}
        onFail={(error) => console.error('Error:', error)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-2 transition-colors"
      />

      {/* With icon using Tailwind */}
      <FacebookLogin
        onSuccess={(response) => console.log('Success:', response)}
        className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        }
      />

      {/* Custom loading state with Tailwind */}
      <FacebookLogin
        onSuccess={(response) => console.log('Success:', response)}
        render={({ onClick, isLoading, isDisabled }) => (
          <button
            onClick={onClick}
            disabled={isDisabled}
            className={`
              relative px-6 py-3 font-medium text-white transition-all duration-200 rounded-md
              ${isDisabled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }
              ${isLoading ? 'pl-12' : ''}
            `}
          >
            {isLoading && (
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 animate-spin h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Sign in with Facebook'}
          </button>
        )}
      />

      {/* Minimal ghost button */}
      <FacebookLogin
        onSuccess={(response) => console.log('Success:', response)}
        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2 px-4 rounded transition-colors duration-200"
        text="Facebook"
      />

      {/* Dark mode variant */}
      <FacebookLogin
        onSuccess={(response) => console.log('Success:', response)}
        className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 px-5 rounded-md border border-gray-700 transition-colors"
        icon={<span className="mr-2">f</span>}
        text="Continue with Facebook"
      />

      {/* With profile fetching */}
      <FacebookLogin
        fields={['name', 'email', 'picture']}
        onSuccess={(response) => console.log('Login success:', response)}
        onProfileSuccess={(profile, loginResponse) => {
          console.log('Profile:', profile);
          // Do something with profile data
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        Sign in with Facebook
      </FacebookLogin>
    </FacebookProvider>
  );
}

// Example: Using with a UI component library (like shadcn/ui)
export function ShadcnExample() {
  return (
    <FacebookLogin
      onSuccess={(response) => console.log('Success:', response)}
      render={({ onClick, isLoading, isDisabled }) => (
        <button
          onClick={onClick}
          disabled={isDisabled}
          // Using shadcn/ui button classes
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              Loading...
            </>
          ) : (
            'Continue with Facebook'
          )}
        </button>
      )}
    />
  );
}