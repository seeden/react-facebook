import React from 'react';
import { LoginButton, FacebookProvider } from '../../src/index';

describe('Login Components - Real Facebook SDK', () => {
  it('should render LoginButton with correct attributes', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954" debug>
        <LoginButton 
          scope="email,user_friends"
          onSuccess={(response) => console.log('Login success:', response)}
          onError={(error) => console.log('Login error:', error)}
          data-testid="login-button"
        >
          Login with Facebook
        </LoginButton>
      </FacebookProvider>
    );

    cy.get('[data-testid="login-button"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('contain.text', 'Login with Facebook');
    cy.get('[data-testid="login-button"]').should('have.prop', 'tagName', 'BUTTON');
  });

  it('should handle LoginButton click (will open Facebook login popup)', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <LoginButton 
          scope="email"
          data-testid="clickable-login"
        >
          Click to Login
        </LoginButton>
      </FacebookProvider>
    );

    cy.get('[data-testid="clickable-login"]').should('be.visible');
    cy.get('[data-testid="clickable-login"]').should('not.be.disabled');
    
    // Note: Clicking will open Facebook login popup in real scenario
    // In tests, this would need to be mocked or handled specially
    cy.get('[data-testid="clickable-login"]').click();
    
    // In a real test environment, you might check for popup or stub the FB.login call
  });

  it('should render LoginButton with custom element type', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <LoginButton 
          asChild="div"
          scope="email,public_profile"
          data-testid="div-login"
          style={{ cursor: 'pointer', padding: '10px', background: '#1877f2', color: 'white' }}
        >
          Custom Login Element
        </LoginButton>
      </FacebookProvider>
    );

    cy.get('[data-testid="div-login"]').should('be.visible');
    cy.get('[data-testid="div-login"]').should('have.prop', 'tagName', 'DIV');
    cy.get('[data-testid="div-login"]').should('contain.text', 'Custom Login Element');
    cy.get('[data-testid="div-login"]').should('have.css', 'cursor', 'pointer');
  });

  it('should handle disabled state during loading', () => {
    // This would typically be tested with a loading state
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <LoginButton 
          disabled={true}
          data-testid="disabled-login"
        >
          Loading...
        </LoginButton>
      </FacebookProvider>
    );

    cy.get('[data-testid="disabled-login"]').should('be.visible');
    cy.get('[data-testid="disabled-login"]').should('be.disabled');
    cy.get('[data-testid="disabled-login"]').should('contain.text', 'Loading...');
  });

  it('should render multiple LoginButtons with different configurations', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <div>
          <LoginButton 
            scope="email"
            data-testid="email-login"
          >
            Login for Email
          </LoginButton>
          
          <LoginButton 
            scope="email,user_friends,user_posts"
            returnScopes={true}
            data-testid="extended-login"
          >
            Extended Permissions
          </LoginButton>
          
          <LoginButton 
            scope="email"
            rerequest={true}
            data-testid="rerequest-login"
          >
            Re-request Permissions
          </LoginButton>
        </div>
      </FacebookProvider>
    );

    // All buttons should render
    cy.get('[data-testid="email-login"]').should('be.visible');
    cy.get('[data-testid="extended-login"]').should('be.visible');
    cy.get('[data-testid="rerequest-login"]').should('be.visible');
    
    // Check text content
    cy.get('[data-testid="email-login"]').should('contain.text', 'Login for Email');
    cy.get('[data-testid="extended-login"]').should('contain.text', 'Extended Permissions');
    cy.get('[data-testid="rerequest-login"]').should('contain.text', 'Re-request Permissions');
  });
});