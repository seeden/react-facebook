import React from 'react';
import { Like, Comments, FacebookProvider } from '../../src/index';

describe('Like & Comments - Requires Non-EU Location or Login', () => {
  beforeEach(() => {
    // Note: These tests may fail in EU region without Facebook login
    // Consider running with VPN to US/Asia or with logged-in Facebook user
  });

  it('should render Like button (may be blocked in EU)', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" debug>
        <Like 
          href="https://github.com/seeden/react-facebook" 
          colorScheme="dark" 
          data-testid="like-button"
        />
      </FacebookProvider>
    );

    // Verify the Like component renders with correct data attributes
    cy.get('[data-testid="like-button"]').should('be.visible');
    cy.get('.fb-like').should('have.attr', 'data-href', 'https://github.com/seeden/react-facebook');
    cy.get('.fb-like').should('have.attr', 'data-colorscheme', 'dark');
    
    // In EU: Widget may be created but not visible due to GDPR restrictions
    // In non-EU: Widget should be fully functional
    cy.get('.fb-like').should('exist');
    
    // Check if widget was processed by Facebook (even if restricted)
    cy.get('.fb-like').then(($element) => {
      if ($element.hasClass('fb_iframe_widget')) {
        // Widget was processed by Facebook SDK
        cy.log('Facebook Like widget processed successfully');
      } else {
        // Widget not processed (likely EU restrictions)
        cy.log('Like widget blocked (likely EU region without login)');
      }
    });
  });

  it('should render Like button with share enabled', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <Like 
          href="https://reactjs.org" 
          share={true}
          layout="button_count"
          data-testid="like-share-button"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="like-share-button"]').should('be.visible');
    cy.get('.fb-like').should('have.attr', 'data-share', 'true');
    cy.get('.fb-like').should('have.attr', 'data-layout', 'button_count');
    
    // Test component attributes regardless of EU restrictions
    cy.get('.fb-like').should('exist');
  });

  it('should render Comments widget (may be blocked in EU)', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" debug>
        <Comments 
          href="https://github.com/seeden/react-facebook"
          numPosts={5}
          width={500}
          colorScheme="dark"
          data-testid="comments-widget"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="comments-widget"]').should('be.visible');
    cy.get('.fb-comments').should('have.attr', 'data-href', 'https://github.com/seeden/react-facebook');
    cy.get('.fb-comments').should('have.attr', 'data-numposts', '5');
    cy.get('.fb-comments').should('have.attr', 'data-width', '500');
    cy.get('.fb-comments').should('have.attr', 'data-colorscheme', 'dark');
    
    // Check if widget exists (may be restricted in EU)
    cy.get('.fb-comments').should('exist');
  });

  it('should handle multiple Like buttons with different configurations', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <div>
          <Like 
            href="https://example.com" 
            layout="standard"
            data-testid="like-1"
          />
          <Like 
            href="https://github.com" 
            layout="box_count"
            colorScheme="dark"
            data-testid="like-2"
          />
          <Like 
            href="https://reactjs.org"
            layout="button"
            share={true}
            data-testid="like-3"
          />
        </div>
      </FacebookProvider>
    );

    // All components should render with correct attributes
    cy.get('[data-testid="like-1"]').should('be.visible');
    cy.get('[data-testid="like-2"]').should('be.visible');
    cy.get('[data-testid="like-3"]').should('be.visible');
    
    // Verify attributes
    cy.get('[data-testid="like-1"] .fb-like').should('have.attr', 'data-layout', 'standard');
    cy.get('[data-testid="like-2"] .fb-like').should('have.attr', 'data-layout', 'box_count');
    cy.get('[data-testid="like-2"] .fb-like').should('have.attr', 'data-colorscheme', 'dark');
    cy.get('[data-testid="like-3"] .fb-like').should('have.attr', 'data-share', 'true');
  });

  // This test could be used with VPN or in CI environment outside EU
  it.skip('should render functional Like button (VPN/Non-EU only)', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <Like 
          href="https://example.com" 
          data-testid="functional-like"
        />
      </FacebookProvider>
    );

    // This should work when not in EU region
    cy.get('[data-testid="functional-like"]').should('be.visible');
    cy.get('.fb-like').should('have.class', 'fb_iframe_widget');
    
    // Widget should have actual content/dimensions
    cy.get('.fb-like iframe').should('exist');
    cy.get('.fb-like iframe').should('be.visible');
  });
});