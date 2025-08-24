import React from 'react';
import { FacebookProvider, useLocale } from '../../src/index';

// Simple test component
function SimpleLocaleTest() {
  const { locale, setLocale, isChangingLocale } = useLocale();
  
  return (
    <div data-testid="simple-locale-test">
      <div data-testid="current-locale">{locale}</div>
      <div data-testid="is-changing">{isChangingLocale ? 'true' : 'false'}</div>
      <button 
        data-testid="change-to-spanish" 
        onClick={() => setLocale('es_ES')}
      >
        Spanish
      </button>
    </div>
  );
}

describe('Simple Locale Test', () => {
  it('should show current locale', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <SimpleLocaleTest />
      </FacebookProvider>
    );

    cy.get('[data-testid="simple-locale-test"]').should('be.visible');
    cy.get('[data-testid="current-locale"]').should('contain.text', 'en_US');
    cy.get('[data-testid="is-changing"]').should('contain.text', 'false');
  });
});