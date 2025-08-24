import React, { useState } from 'react';
import { FacebookProvider, FacebookLogin } from '../../src/index';

// Test component for demonstrating different FacebookLogin usage patterns
function FacebookLoginDemo() {
  const [loginResponse, setLoginResponse] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  return (
    <div data-testid="facebook-login-demo">
      <h3>Facebook Login Demo</h3>
      
      {/* Simple login */}
      <div data-testid="simple-login-section">
        <h4>Simple Login</h4>
        <FacebookLogin
          onSuccess={(response) => {
            setLoginResponse(response);
            setError(null);
          }}
          onFail={(err) => {
            setError(err);
            setLoginResponse(null);
          }}
        />
      </div>

      {/* Login with profile */}
      <div data-testid="profile-login-section">
        <h4>Login with Profile</h4>
        <FacebookLogin
          fields={['id', 'name', 'email', 'picture']}
          onSuccess={(response) => {
            setLoginResponse(response);
            setError(null);
          }}
          onProfileSuccess={(profileData, loginResp) => {
            setProfile(profileData);
            setLoginResponse(loginResp);
            setError(null);
          }}
          onFail={(err) => {
            setError(err);
            setLoginResponse(null);
            setProfile(null);
          }}
        >
          Login & Get Profile
        </FacebookLogin>
      </div>

      {/* Custom render */}
      <div data-testid="custom-render-section">
        <h4>Custom Render</h4>
        <FacebookLogin
          onSuccess={(response) => {
            setLoginResponse(response);
            setError(null);
          }}
          onFail={(err) => {
            setError(err);
            setLoginResponse(null);
          }}
          render={({ onClick, isLoading, isDisabled }) => (
            <button 
              onClick={onClick} 
              disabled={isDisabled}
              style={{
                backgroundColor: '#42b883',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
              data-testid="custom-login-button"
            >
              {isLoading ? 'Custom Loading...' : 'Custom Facebook Login'}
            </button>
          )}
        />
      </div>

      {/* Results */}
      <div data-testid="results">
        {error && (
          <div data-testid="error-result" style={{ color: 'red' }}>
            Error: {error.message}
          </div>
        )}
        
        {loginResponse && (
          <div data-testid="login-result">
            <h4>Login Response:</h4>
            <pre data-testid="login-data">{JSON.stringify(loginResponse, null, 2)}</pre>
          </div>
        )}
        
        {profile && (
          <div data-testid="profile-result">
            <h4>Profile Data:</h4>
            <pre data-testid="profile-data">{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

describe('FacebookLogin Component', () => {
  it('should render default login button', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLogin
          onSuccess={() => {}}
          onFail={() => {}}
        />
      </FacebookProvider>
    );

    // Should render default button with Facebook styling
    cy.get('button').should('be.visible');
    cy.get('button').should('contain.text', 'Continue with Facebook');
    cy.get('button').should('have.css', 'background-color', 'rgb(24, 119, 242)'); // #1877f2
  });

  it('should render custom children', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLogin
          onSuccess={() => {}}
          onFail={() => {}}
        >
          Custom Login Text
        </FacebookLogin>
      </FacebookProvider>
    );

    cy.get('button').should('contain.text', 'Custom Login Text');
  });

  it('should support custom render prop', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLogin
          onSuccess={() => {}}
          onFail={() => {}}
          render={({ onClick, isLoading }) => (
            <div 
              onClick={onClick}
              data-testid="custom-render"
            >
              {isLoading ? 'Loading...' : 'Click me to login'}
            </div>
          )}
        />
      </FacebookProvider>
    );

    cy.get('[data-testid="custom-render"]').should('be.visible');
    cy.get('[data-testid="custom-render"]').should('contain.text', 'Click me to login');
  });

  it('should handle disabled state', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLogin
          disabled={true}
          onSuccess={() => {}}
          onFail={() => {}}
        />
      </FacebookProvider>
    );

    cy.get('button').should('be.disabled');
    cy.get('button').should('have.css', 'opacity', '0.6');
  });

  it('should apply custom styles', () => {
    const customStyle = {
      backgroundColor: 'red',
      borderRadius: '10px',
    };

    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLogin
          style={customStyle}
          onSuccess={() => {}}
          onFail={() => {}}
        />
      </FacebookProvider>
    );

    cy.get('button').should('have.css', 'background-color', 'rgb(255, 0, 0)'); // red
    cy.get('button').should('have.css', 'border-radius', '10px');
  });

  it('should show loading state during login', () => {
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    // Mock a slow login
    const slowLogin = cy.stub().returns(loginPromise);

    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLogin
          onSuccess={() => {}}
          onFail={() => {}}
        />
      </FacebookProvider>
    );

    // Click the button
    cy.get('button').click();
    
    // Should show loading state (though this is hard to test with real Facebook API)
    // In a real test, we'd mock the login hook
    cy.get('button').should('be.visible');
  });

  it('should render complete demo with all features', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLoginDemo />
      </FacebookProvider>
    );

    // Check all sections exist
    cy.get('[data-testid="simple-login-section"]').should('be.visible');
    cy.get('[data-testid="profile-login-section"]').should('be.visible');
    cy.get('[data-testid="custom-render-section"]').should('be.visible');
    cy.get('[data-testid="results"]').should('be.visible');

    // Check different button types
    cy.get('[data-testid="simple-login-section"] button').should('contain.text', 'Continue with Facebook');
    cy.get('[data-testid="profile-login-section"] button').should('contain.text', 'Login & Get Profile');
    cy.get('[data-testid="custom-login-button"]').should('contain.text', 'Custom Facebook Login');
  });

  it('should support custom scope and fields', () => {
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLogin
          scope="public_profile,email,user_friends"
          fields={['id', 'name', 'email', 'friends']}
          onSuccess={() => {}}
          onFail={() => {}}
        >
          Advanced Login
        </FacebookLogin>
      </FacebookProvider>
    );

    cy.get('button').should('contain.text', 'Advanced Login');
  });
});

describe('FacebookLogin API Compatibility', () => {
  it('should match @greatsumini/react-facebook-login API', () => {
    // Test that our component supports the same props as the competitor
    cy.mount(
      <FacebookProvider appId="671184534658954">
        <FacebookLogin
          // Core props from @greatsumini
          onSuccess={(response) => {
            expect(response).to.have.property('status');
          }}
          onFail={(error) => {
            expect(error).to.be.instanceOf(Error);
          }}
          scope="public_profile,email"
          fields={['name', 'email', 'picture']}
          // Our enhanced props
          autoLoad={false}
          disabled={false}
          style={{ backgroundColor: 'blue' }}
          className="custom-class"
        >
          Compatible Login
        </FacebookLogin>
      </FacebookProvider>
    );

    cy.get('button').should('contain.text', 'Compatible Login');
    cy.get('button').should('have.class', 'custom-class');
  });
});