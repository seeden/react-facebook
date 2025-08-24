import React from 'react';
import {   
  FacebookProvider,
  ShareButton,
  Comments,
  Like,
  Page,
  Share,
} from '../../src/index';

describe('Facebook Components Integration', () => {
  it('should render all Facebook components together', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" debug>
        <div data-testid="facebook-components">
          <section data-testid="page-section">
            <h3>Page:</h3>
            <Page 
              href="https://www.facebook.com/facebook" 
              tabs="timeline"
              data-testid="facebook-page"
            />
          </section>

          <section data-testid="like-section">
            <h3>Like:</h3>
            <Like 
              href="https://www.facebook.com/facebook" 
              share 
              data-testid="facebook-like"
            />
          </section>

          <section data-testid="share-button-section">
            <h3>Share Button:</h3>
            <ShareButton 
              href="https://www.facebook.com"
              data-testid="facebook-share-button"
            >
              Share Button
            </ShareButton>
          </section>

          <section data-testid="share-section">
            <h3>Share Widget:</h3>
            <Share 
              href="https://developers.facebook.com/docs/plugins/" 
              layout="button_count"
              data-testid="facebook-share"
            />
          </section>

          <section data-testid="comments-section">
            <h3>Comments:</h3>
            <Comments 
              href="http://www.facebook.com"
              data-testid="facebook-comments"
            />
          </section>
        </div>
      </FacebookProvider>
    );

    // Verify all components render
    cy.get('[data-testid="facebook-components"]').should('be.visible');
    
    // Test individual components
    cy.get('[data-testid="facebook-page"]').should('be.visible');
    cy.get('.fb-page').should('have.attr', 'data-href', 'https://www.facebook.com/facebook');
    cy.get('.fb-page').should('have.attr', 'data-tabs', 'timeline');

    cy.get('[data-testid="facebook-like"]').should('be.visible');
    cy.get('.fb-like').should('have.attr', 'data-share', 'true');

    cy.get('[data-testid="facebook-share-button"]').should('be.visible');
    cy.get('[data-testid="facebook-share-button"]').should('contain.text', 'Share Button');

    cy.get('[data-testid="facebook-share"]').should('be.visible');
    cy.get('.fb-share-button').should('have.attr', 'data-layout', 'button_count');

    cy.get('[data-testid="facebook-comments"]').should('be.visible');
    cy.get('.fb-comments').should('have.attr', 'data-href', 'http://www.facebook.com');
  });

  it('should handle FacebookProvider without debug mode', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <Like 
          href="https://www.facebook.com/test"
          data-testid="production-like"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="production-like"]').should('be.visible');
    cy.get('.fb-like').should('be.visible');
  });
});

