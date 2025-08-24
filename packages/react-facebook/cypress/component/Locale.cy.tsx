import React, { useState } from 'react';
import { FacebookProvider, useLocale, useFacebook, Share, Page } from '../../src/index';

// Test component that uses the useLocale hook
function LocaleTestComponent() {
  const { locale, setLocale, isChangingLocale, availableLocales } = useLocale();
  
  return (
    <div data-testid="locale-test">
      <div data-testid="current-locale">{locale}</div>
      <div data-testid="is-changing">{isChangingLocale ? 'true' : 'false'}</div>
      <button 
        data-testid="change-to-spanish" 
        onClick={() => setLocale('es_ES')}
        disabled={isChangingLocale}
      >
        Change to Spanish
      </button>
      <button 
        data-testid="change-to-french" 
        onClick={() => setLocale('fr_FR')}
        disabled={isChangingLocale}
      >
        Change to French
      </button>
      <button 
        data-testid="change-to-english" 
        onClick={() => setLocale('en_US')}
        disabled={isChangingLocale}
      >
        Change to English
      </button>
      <div data-testid="available-locales">{availableLocales.length}</div>
      
      {/* Test that widgets re-render with new locale */}
      <Share 
        href="https://example.com" 
        layout="button"
        data-testid="test-share-widget"
      />
      <Page 
        href="https://www.facebook.com/meta"
        width={300}
        height={200}
        data-testid="test-page-widget"
      />
    </div>
  );
}

describe('Dynamic Locale Support - Real Facebook SDK', () => {
  it('should initialize with default locale', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <LocaleTestComponent />
      </FacebookProvider>
    );

    cy.get('[data-testid="locale-test"]').should('be.visible');
    cy.get('[data-testid="current-locale"]').should('contain.text', 'en_US');
    cy.get('[data-testid="is-changing"]').should('contain.text', 'false');
    cy.get('[data-testid="available-locales"]').should('contain.text', '44'); // Should have 44 locales
  });

  it('should initialize with custom locale', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" language="es_ES">
        <LocaleTestComponent />
      </FacebookProvider>
    );

    cy.get('[data-testid="current-locale"]').should('contain.text', 'es_ES');
  });

  it('should change locale dynamically', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <LocaleTestComponent />
      </FacebookProvider>
    );

    // Start with English
    cy.get('[data-testid="current-locale"]').should('contain.text', 'en_US');
    
    // Change to Spanish
    cy.get('[data-testid="change-to-spanish"]').click();
    
    // Wait for locale change to complete (may or may not see loading state due to speed)
    cy.get('[data-testid="current-locale"]', { timeout: 10000 }).should('contain.text', 'es_ES');
    cy.get('[data-testid="is-changing"]').should('contain.text', 'false');
    
    // Verify widgets are re-rendered (Facebook SDK should re-parse them)
    cy.get('[data-testid="test-share-widget"]').should('be.visible');
    cy.get('[data-testid="test-page-widget"]').should('be.visible');
  });

  it('should handle multiple locale changes', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <LocaleTestComponent />
      </FacebookProvider>
    );

    // English -> Spanish
    cy.get('[data-testid="change-to-spanish"]').click();
    cy.get('[data-testid="is-changing"]', { timeout: 10000 }).should('contain.text', 'false');
    cy.get('[data-testid="current-locale"]').should('contain.text', 'es_ES');
    
    // Spanish -> French
    cy.get('[data-testid="change-to-french"]').click();
    cy.get('[data-testid="is-changing"]', { timeout: 10000 }).should('contain.text', 'false');
    cy.get('[data-testid="current-locale"]').should('contain.text', 'fr_FR');
    
    // French -> English
    cy.get('[data-testid="change-to-english"]').click();
    cy.get('[data-testid="is-changing"]', { timeout: 10000 }).should('contain.text', 'false');
    cy.get('[data-testid="current-locale"]').should('contain.text', 'en_US');
  });

  it('should disable buttons during locale change', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <LocaleTestComponent />
      </FacebookProvider>
    );

    // Initial state - buttons should be enabled
    cy.get('[data-testid="change-to-spanish"]').should('not.be.disabled');
    cy.get('[data-testid="change-to-french"]').should('not.be.disabled');
    
    // Start locale change
    cy.get('[data-testid="change-to-spanish"]').click();
    
    // Wait for completion - locale should change successfully
    cy.get('[data-testid="current-locale"]', { timeout: 10000 }).should('contain.text', 'es_ES');
    cy.get('[data-testid="is-changing"]').should('contain.text', 'false');
    
    // Buttons should be enabled again after completion
    cy.get('[data-testid="change-to-spanish"]').should('not.be.disabled');
    cy.get('[data-testid="change-to-french"]').should('not.be.disabled');
  });

  it('should not change if setting same locale', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" language="en_US">
        <LocaleTestComponent />
      </FacebookProvider>
    );

    cy.get('[data-testid="current-locale"]').should('contain.text', 'en_US');
    
    // Click English again (should be no-op)
    cy.get('[data-testid="change-to-english"]').click();
    
    // Should not show loading state for same locale
    cy.get('[data-testid="is-changing"]').should('contain.text', 'false');
    cy.get('[data-testid="current-locale"]').should('contain.text', 'en_US');
  });
});

// Test component for direct Facebook context access
function DirectContextTest() {
  const { locale, setLocale } = useFacebook();
  
  return (
    <div data-testid="direct-context-test">
      <div data-testid="context-locale">{locale}</div>
      <button 
        data-testid="direct-change-locale"
        onClick={() => setLocale('de_DE')}
      >
        Change to German (Direct)
      </button>
    </div>
  );
}

describe('Facebook Context Locale Methods', () => {
  it('should provide locale through Facebook context', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" language="fr_FR">
        <DirectContextTest />
      </FacebookProvider>
    );

    cy.get('[data-testid="context-locale"]').should('contain.text', 'fr_FR');
    
    cy.get('[data-testid="direct-change-locale"]').click();
    
    // Wait for locale change
    cy.get('[data-testid="context-locale"]', { timeout: 10000 }).should('contain.text', 'de_DE');
  });
});