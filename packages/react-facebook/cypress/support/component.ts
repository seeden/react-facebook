// Import commands
import './commands';

import { mount } from 'cypress/react18';

// Add mount command
Cypress.Commands.add('mount', mount);

// Load real Facebook SDK for component tests
beforeEach(() => {
  cy.window().then((win) => {
    // Only load Facebook SDK if not already loaded
    if (!win.FB && !win.document.getElementById('facebook-jssdk')) {
      // Create Facebook SDK script
      const script = win.document.createElement('script');
      script.id = 'facebook-jssdk';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      
      // Add script to document
      win.document.head.appendChild(script);
      
      // Set up fbAsyncInit callback
      win.fbAsyncInit = function() {
        win.FB.init({
          appId: '671184534658954', // Your test app ID
          version: 'v23.0',
          xfbml: true,
          cookie: false, // Disable cookies in test environment
          status: false  // Disable status checking in test environment
        });
      };
    }
  });
  
  // Wait for Facebook SDK to load
  cy.waitForFacebookSDK();
});