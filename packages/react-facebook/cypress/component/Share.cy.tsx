import React from 'react';
import { Share, ShareButton, FacebookProvider } from '../../src/index';

describe('Share Components - Real Facebook SDK', () => {
  it('should render Share widget (works in EU)', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" debug>
        <Share 
          href="https://github.com/seeden/react-facebook" 
          layout="button_count"
          data-testid="share-widget"
        />
      </FacebookProvider>
    );

    // Verify the Share component renders with correct data attributes
    cy.get('[data-testid="share-widget"]').should('be.visible');
    cy.get('.fb-share-button').should('have.attr', 'data-href', 'https://github.com/seeden/react-facebook');
    cy.get('.fb-share-button').should('have.attr', 'data-layout', 'button_count');
    
    // Verify Facebook widget creation
    cy.get('.fb-share-button').should('have.class', 'fb_iframe_widget');
  });

  it('should render ShareButton component (works in EU)', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <ShareButton 
          href="https://reactjs.org"
          data-testid="share-button"
        >
          Share React
        </ShareButton>
      </FacebookProvider>
    );

    cy.get('[data-testid="share-button"]').should('be.visible');
    cy.get('[data-testid="share-button"]').should('contain.text', 'Share React');
    
    // Test click functionality (should trigger Facebook share dialog)
    cy.get('[data-testid="share-button"]').click();
  });

  it('should handle multiple Share components together', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <div>
          <Share 
            href="https://example.com" 
            layout="button"
            data-testid="share-1"
          />
          <ShareButton 
            href="https://github.com"
            data-testid="share-button-1"
          >
            Share GitHub
          </ShareButton>
          <Share 
            href="https://reactjs.org"
            layout="box_count"
            data-testid="share-2"
          />
        </div>
      </FacebookProvider>
    );

    // All components should render
    cy.get('[data-testid="share-1"]').should('be.visible');
    cy.get('[data-testid="share-button-1"]').should('be.visible');
    cy.get('[data-testid="share-2"]').should('be.visible');
    
    // Verify widgets are created by Facebook SDK
    cy.get('.fb-share-button').should('have.length', 2);
    cy.get('.fb-share-button').each(($el) => {
      cy.wrap($el).should('have.class', 'fb_iframe_widget');
    });
    
    // Test ShareButton functionality
    cy.get('[data-testid="share-button-1"]').should('contain.text', 'Share GitHub');
  });
});
