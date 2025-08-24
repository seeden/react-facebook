/// <reference types="cypress" />

// Custom command to wait for Facebook SDK to load
Cypress.Commands.add('waitForFacebookSDK', () => {
  cy.window().should('have.property', 'FB');
  cy.window().its('FB').should('be.an', 'object');
  cy.window().its('FB').should('have.property', 'init');
  cy.window().its('FB').should('have.property', 'XFBML');
});

// Custom command to wait for Facebook widget to render
Cypress.Commands.add('waitForFacebookWidget', (selector: string) => {
  cy.get(selector).should('be.visible');
  cy.get(selector).within(() => {
    // Wait for Facebook iframe to load
    cy.get('iframe', { timeout: 15000 }).should('be.visible');
  });
});

// Custom command to mock Facebook API responses
Cypress.Commands.add('mockFacebookAPI', (endpoint: string, response: any) => {
  cy.intercept('GET', `**/graph.facebook.com${endpoint}*`, response).as(`facebook-${endpoint.replace('/', '')}`);
});

// Add type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      waitForFacebookSDK(): Chainable<Window>;
      waitForFacebookWidget(selector: string): Chainable<Element>;
      mockFacebookAPI(endpoint: string, response: any): Chainable<Element>;
      loadFacebookSDK?(): Chainable<Window>;
      mockFacebookLogin?(status?: string): Chainable<Window>;
    }
  }
}