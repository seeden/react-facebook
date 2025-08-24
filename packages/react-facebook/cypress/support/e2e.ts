// Import commands
import './commands';

// Use real Facebook SDK for e2e tests
beforeEach(() => {
  // Allow real Facebook SDK to load
  cy.intercept('GET', '**/connect.facebook.net/**').as('facebookSDK');
});

// Custom commands for e2e testing
Cypress.Commands.add('loadFacebookSDK', () => {
  cy.window().then((win) => {
    // Only load if not already loaded
    if (!win.FB) {
      const script = win.document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      win.document.head.appendChild(script);
      
      // Set up fbAsyncInit
      win.fbAsyncInit = function() {
        win.FB.init({
          appId: '671184534658954',
          version: 'v23.0',
          xfbml: true,
          cookie: false, // Disable cookies in test environment
          status: false  // Disable status checking in test environment
        });
      };
      
      return cy.window().should('have.property', 'FB');
    }
  });
});

// For e2e tests, you might want to test real login flows
// but be careful with credentials in CI environments
Cypress.Commands.add('mockFacebookLogin', (status = 'connected') => {
  cy.window().then((win) => {
    if (win.FB) {
      // For real testing, you could interact with actual Facebook login
      // For now, stub for safety in automated tests
      cy.stub(win.FB, 'login').resolves({
        status,
        authResponse: status === 'connected' ? {
          accessToken: 'test-access-token',
          userID: 'test-user-id',
        } : null,
      });
    }
  });
});