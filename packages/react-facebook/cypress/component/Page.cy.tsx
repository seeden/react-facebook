import React from 'react';
import { Page, FacebookProvider } from '../../src/index';

describe('Page Component - Real Facebook SDK', () => {
  it('should render Facebook Page widget', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" debug>
        <Page 
          href="https://www.facebook.com/meta" 
          tabs="timeline"
          hideCover={false}
          showFacepile={true}
          data-testid="facebook-page"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="facebook-page"]').should('be.visible');
    cy.get('.fb-page').should('have.attr', 'data-href', 'https://www.facebook.com/meta');
    cy.get('.fb-page').should('have.attr', 'data-tabs', 'timeline');
    cy.get('.fb-page').should('have.attr', 'data-show-facepile', 'true');
    
    // Verify Facebook widget creation
    cy.get('.fb-page').should('have.class', 'fb_iframe_widget');
  });

  it('should render Page with different tabs', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <Page 
          href="https://www.facebook.com/meta"
          tabs="timeline,events,messages"
          width={400}
          height={300}
          data-testid="page-with-tabs"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="page-with-tabs"]').should('be.visible');
    cy.get('.fb-page').should('have.attr', 'data-tabs', 'timeline,events,messages');
    cy.get('.fb-page').should('have.attr', 'data-width', '400');
    cy.get('.fb-page').should('have.attr', 'data-height', '300');
    
    // Verify widget creation
    cy.get('.fb-page').should('have.class', 'fb_iframe_widget');
  });

  it('should handle Page with minimal configuration', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <Page 
          href="https://www.facebook.com/facebook"
          data-testid="minimal-page"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="minimal-page"]').should('be.visible');
    cy.get('.fb-page').should('have.attr', 'data-href', 'https://www.facebook.com/facebook');
    
    // Verify widget creation
    cy.get('.fb-page').should('have.class', 'fb_iframe_widget');
  });

  it('should handle Page with small header and adaptive width', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <Page 
          href="https://www.facebook.com/meta"
          smallHeader={true}
          adaptContainerWidth={true}
          hideCTA={true}
          data-testid="compact-page"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="compact-page"]').should('be.visible');
    cy.get('.fb-page').should('have.attr', 'data-small-header', 'true');
    cy.get('.fb-page').should('have.attr', 'data-adapt-container-width', 'true');
    cy.get('.fb-page').should('have.attr', 'data-hide-cta', 'true');
    
    // Verify widget creation
    cy.get('.fb-page').should('have.class', 'fb_iframe_widget');
  });
});