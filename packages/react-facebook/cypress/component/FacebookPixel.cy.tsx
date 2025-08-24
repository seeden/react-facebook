import React from 'react';
import { FacebookProvider, usePixel } from '../../src';

function PixelTestComponent() {
  const { track, trackCustom, pageView } = usePixel();
  
  return (
    <div>
      <button 
        data-testid="track-purchase" 
        onClick={() => track('Purchase', { value: 29.99 })}
      >
        Track Purchase
      </button>
      <button 
        data-testid="track-custom" 
        onClick={() => trackCustom('CustomEvent', { data: 'test' })}
      >
        Track Custom
      </button>
      <button 
        data-testid="page-view" 
        onClick={pageView}
      >
        Track Page View
      </button>
    </div>
  );
}

describe('Facebook Pixel', () => {
  beforeEach(() => {
    // Mock fbq function
    (window as any).fbq = cy.stub().as('fbq');
    (window as any)._fbq = cy.stub().as('_fbq');
  });

  it('should initialize pixel when provider is mounted', () => {
    cy.mount(
      <FacebookProvider 
        appId="test-app-id"
        pixel={{
          pixelId: "test-pixel-id",
          debug: false
        }}
      >
        <PixelTestComponent />
      </FacebookProvider>
    );

    // Wait for initialization
    cy.wait(100);
    
    // Check if fbq was called with init
    cy.get('@fbq').should('have.been.calledWith', 'init', 'test-pixel-id', {});
  });

  it('should track purchase event', () => {
    cy.mount(
      <FacebookProvider 
        appId="test-app-id"
        pixel={{
          pixelId: "test-pixel-id",
          debug: false
        }}
      >
        <PixelTestComponent />
      </FacebookProvider>
    );

    cy.wait(100);
    cy.get('[data-testid="track-purchase"]').click();
    
    cy.get('@fbq').should('have.been.calledWith', 'track', 'Purchase', { value: 29.99 });
  });

  it('should track custom event', () => {
    cy.mount(
      <FacebookProvider 
        appId="test-app-id"
        pixel={{
          pixelId: "test-pixel-id",
          debug: false
        }}
      >
        <PixelTestComponent />
      </FacebookProvider>
    );

    cy.wait(100);
    cy.get('[data-testid="track-custom"]').click();
    
    cy.get('@fbq').should('have.been.calledWith', 'trackCustom', 'CustomEvent', { data: 'test' });
  });

  it('should track page view', () => {
    cy.mount(
      <FacebookProvider 
        appId="test-app-id"
        pixel={{
          pixelId: "test-pixel-id",
          debug: false
        }}
      >
        <PixelTestComponent />
      </FacebookProvider>
    );

    cy.wait(100);
    cy.get('[data-testid="page-view"]').click();
    
    cy.get('@fbq').should('have.been.calledWith', 'track', 'PageView');
  });
});
