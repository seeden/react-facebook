import React, { useState } from 'react';
import { FacebookProvider, FacebookErrorBoundary, Like } from 'react-facebook';

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Component error');
  return <div data-testid="child-content">Content rendered successfully</div>;
}

export default function ErrorBoundaryPage() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetCount, setResetCount] = useState(0);

  return (
    <div data-testid="error-boundary-page">
      {/* Scenario 1: Normal rendering */}
      <section data-testid="scenario-normal">
        <FacebookProvider appId="671184534658954">
          <FacebookErrorBoundary fallback={<div data-testid="fallback-1">Error occurred</div>}>
            <Like href="https://example.com" data-testid="normal-like" />
          </FacebookErrorBoundary>
        </FacebookProvider>
      </section>

      {/* Scenario 2: Static fallback on error */}
      <section data-testid="scenario-static-fallback">
        <FacebookErrorBoundary fallback={<div data-testid="static-fallback">Static fallback UI</div>}>
          <ThrowingComponent shouldThrow={true} />
        </FacebookErrorBoundary>
      </section>

      {/* Scenario 3: Function fallback with reset */}
      <section data-testid="scenario-function-fallback">
        <FacebookErrorBoundary
          fallback={(error, reset) => (
            <div data-testid="function-fallback">
              <span data-testid="error-text">Error: {error.message}</span>
              <button
                data-testid="reset-button"
                onClick={() => {
                  setResetCount((c) => c + 1);
                  setShouldThrow(false);
                  reset();
                }}
              >
                Reset
              </button>
            </div>
          )}
          onError={(error) => setErrorMessage(error.message)}
        >
          <ThrowingComponent shouldThrow={shouldThrow} />
        </FacebookErrorBoundary>
        <button data-testid="trigger-error" onClick={() => setShouldThrow(true)}>
          Trigger Error
        </button>
        <div data-testid="on-error-message">{errorMessage}</div>
        <div data-testid="reset-count">{resetCount}</div>
      </section>
    </div>
  );
}
