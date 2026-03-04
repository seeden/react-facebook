import React, { useState } from 'react';
import { FacebookProvider, Login } from 'react-facebook';

export default function LoginPage() {
  const [result, setResult] = useState<string>('');

  return (
    <FacebookProvider appId="671184534658954">
      <div data-testid="login-page">
        {/* Basic login button */}
        <section data-testid="scenario-basic">
          <Login
            scope="email,user_friends"
            onSuccess={(r) => setResult(JSON.stringify(r))}
            onError={(e) => setResult(`error:${e.message}`)}
            data-testid="login-button"
          >
            Login with Facebook
          </Login>
        </section>

        {/* Custom children */}
        <section data-testid="scenario-custom-text">
          <Login onSuccess={() => {}} data-testid="custom-text-login">
            Custom Login Text
          </Login>
        </section>

        {/* Render props pattern */}
        <section data-testid="scenario-render-props">
          <Login onSuccess={() => {}}>
            {({ onClick, loading, isDisabled }) => (
              <div
                onClick={onClick}
                data-testid="custom-render"
                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Loading...' : 'Click me to login'}
              </div>
            )}
          </Login>
        </section>

        {/* Custom element type */}
        <section data-testid="scenario-custom-element">
          <Login
            as="div"
            scope="email,public_profile"
            data-testid="div-login"
            style={{ cursor: 'pointer', padding: '10px', background: '#1877f2', color: 'white' }}
            onSuccess={() => {}}
          >
            Custom Login Element
          </Login>
        </section>

        {/* Disabled state */}
        <section data-testid="scenario-disabled">
          <Login disabled={true} onSuccess={() => {}} data-testid="disabled-login">
            Loading...
          </Login>
        </section>

        {/* Custom styles */}
        <section data-testid="scenario-custom-styles">
          <Login
            style={{ backgroundColor: 'red', borderRadius: '10px' }}
            onSuccess={() => {}}
            data-testid="styled-login"
          />
        </section>

        {/* Multiple with different scopes */}
        <section data-testid="scenario-multiple">
          <Login scope="email" onSuccess={() => {}} data-testid="email-login">
            Login for Email
          </Login>
          <Login scope="email,user_friends,user_posts" onSuccess={() => {}} data-testid="extended-login">
            Extended Permissions
          </Login>
          <Login scope="email" rerequest={true} onSuccess={() => {}} data-testid="rerequest-login">
            Re-request Permissions
          </Login>
        </section>

        {/* Result display */}
        <div data-testid="login-result">{result}</div>
      </div>
    </FacebookProvider>
  );
}
