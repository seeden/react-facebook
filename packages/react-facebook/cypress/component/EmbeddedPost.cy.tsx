import React from 'react';
import { EmbeddedPost, EmbeddedVideo, FacebookProvider } from '../../src/index';

describe('Embedded Content - Real Facebook SDK', () => {
  it('should render EmbeddedPost', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" debug>
        <EmbeddedPost 
          href="https://www.facebook.com/meta/posts/10158744293761729"
          width={500}
          showText={true}
          data-testid="embedded-post"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="embedded-post"]').should('be.visible');
    cy.get('.fb-post').should('have.attr', 'data-href', 'https://www.facebook.com/meta/posts/10158744293761729');
    cy.get('.fb-post').should('have.attr', 'data-width', '500');
    cy.get('.fb-post').should('have.attr', 'data-show-text', 'true');
    
    // Verify Facebook widget creation
    cy.get('.fb-post').should('have.class', 'fb_iframe_widget');
  });

  it('should render EmbeddedVideo', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <EmbeddedVideo 
          href="https://www.facebook.com/meta/videos/10155278353316729"
          width={640}
          allowFullScreen={true}
          autoPlay={false}
          data-testid="embedded-video"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="embedded-video"]').should('be.visible');
    cy.get('.fb-video').should('have.attr', 'data-href', 'https://www.facebook.com/meta/videos/10155278353316729');
    cy.get('.fb-video').should('have.attr', 'data-width', '640');
    cy.get('.fb-video').should('have.attr', 'data-allowfullscreen', 'true');
    cy.get('.fb-video').should('have.attr', 'data-autoplay', 'false');
    
    // Verify Facebook widget creation
    cy.get('.fb-video').should('have.class', 'fb_iframe_widget');
  });

  it('should handle EmbeddedPost with minimal configuration', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <EmbeddedPost 
          href="https://www.facebook.com/facebook/posts/10158832657416729"
          data-testid="minimal-post"
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="minimal-post"]').should('be.visible');
    cy.get('.fb-post').should('have.attr', 'data-href', 'https://www.facebook.com/facebook/posts/10158832657416729');
    
    // Verify widget creation
    cy.get('.fb-post').should('have.class', 'fb_iframe_widget');
  });

  it('should handle multiple embedded content together', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <div>
          <EmbeddedPost 
            href="https://www.facebook.com/meta/posts/10158744293761729"
            width={400}
            data-testid="post-1"
          />
          <EmbeddedVideo 
            href="https://www.facebook.com/meta/videos/10155278353316729"
            width={400}
            showCaptions={true}
            data-testid="video-1"
          />
        </div>
      </FacebookProvider>
    );

    // Both should render
    cy.get('[data-testid="post-1"]').should('be.visible');
    cy.get('[data-testid="video-1"]').should('be.visible');
    
    // Verify widgets are created
    cy.get('[data-testid="post-1"] .fb-post').should('have.class', 'fb_iframe_widget');
    cy.get('[data-testid="video-1"] .fb-video').should('have.class', 'fb_iframe_widget');
    
    // Check specific attributes
    cy.get('[data-testid="video-1"] .fb-video').should('have.attr', 'data-show-captions', 'true');
  });
});