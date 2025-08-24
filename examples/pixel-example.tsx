import React from 'react';
import { FacebookProvider, usePixel, usePageView } from '../src';

function PixelTracker() {
  const { track, trackCustom, grantConsent, revokeConsent } = usePixel();
  
  // Automatically track page views
  usePageView({ trackOnMount: true, trackOnRouteChange: true });

  const handlePurchase = () => {
    track('Purchase', {
      value: 29.99,
      currency: 'USD',
      content_name: 'Premium Plan',
      content_category: 'Subscription'
    });
  };

  const handleAddToCart = () => {
    track('AddToCart', {
      value: 19.99,
      currency: 'USD',
      content_name: 'Basic Plan',
      content_category: 'Subscription'
    });
  };

  const handleCustomEvent = () => {
    trackCustom('UserAction', {
      action_type: 'button_click',
      button_name: 'custom_action',
      timestamp: Date.now()
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Facebook Pixel Example</h2>
      
      <div className="space-y-3">
        <button
          onClick={handlePurchase}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Track Purchase ($29.99)
        </button>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Track Add to Cart ($19.99)
        </button>
        
        <button
          onClick={handleCustomEvent}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Track Custom Event
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={grantConsent}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Grant Consent
          </button>
          
          <button
            onClick={revokeConsent}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Revoke Consent
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <FacebookProvider 
      appId="YOUR_APP_ID"
      pixel={{
        pixelId: "YOUR_PIXEL_ID",
        debug: true, // Enable debug mode for development
        autoConfig: true,
        advancedMatching: {
          // Add any advanced matching parameters
          // em: 'user@example.com', // hashed email
          // ph: '1234567890', // hashed phone
        }
      }}
    >
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            React Facebook Pixel Demo
          </h1>
          <PixelTracker />
        </div>
      </div>
    </FacebookProvider>
  );
}

export default App;
