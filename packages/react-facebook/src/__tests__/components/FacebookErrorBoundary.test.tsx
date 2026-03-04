import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FacebookErrorBoundary from '../../components/FacebookErrorBoundary';

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error');
  return <div>Content</div>;
}

describe('FacebookErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error', () => {
    render(
      <FacebookErrorBoundary>
        <div>Child content</div>
      </FacebookErrorBoundary>,
    );

    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('renders null when error occurs with no fallback', () => {
    const { container } = render(
      <FacebookErrorBoundary>
        <ThrowingComponent shouldThrow />
      </FacebookErrorBoundary>,
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders static ReactNode fallback on error', () => {
    render(
      <FacebookErrorBoundary fallback={<div>Fallback UI</div>}>
        <ThrowingComponent shouldThrow />
      </FacebookErrorBoundary>,
    );

    expect(screen.getByText('Fallback UI')).toBeTruthy();
    expect(screen.queryByText('Content')).toBeNull();
  });

  it('renders function fallback with error and reset', () => {
    render(
      <FacebookErrorBoundary
        fallback={(error, reset) => (
          <div>
            <span>Error: {error.message}</span>
            <button onClick={reset}>Reset</button>
          </div>
        )}
      >
        <ThrowingComponent shouldThrow />
      </FacebookErrorBoundary>,
    );

    expect(screen.getByText('Error: Test error')).toBeTruthy();
    expect(screen.getByText('Reset')).toBeTruthy();
  });

  it('calls onError callback when error is caught', () => {
    const onError = vi.fn();

    render(
      <FacebookErrorBoundary onError={onError}>
        <ThrowingComponent shouldThrow />
      </FacebookErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
  });

  it('supports reset to recover from error', () => {
    let shouldThrow = true;

    function ConditionalThrower() {
      if (shouldThrow) throw new Error('Test error');
      return <div>Recovered content</div>;
    }

    render(
      <FacebookErrorBoundary
        fallback={(_error, reset) => (
          <button
            onClick={() => {
              shouldThrow = false;
              reset();
            }}
          >
            Reset
          </button>
        )}
      >
        <ConditionalThrower />
      </FacebookErrorBoundary>,
    );

    expect(screen.getByText('Reset')).toBeTruthy();

    fireEvent.click(screen.getByText('Reset'));

    expect(screen.getByText('Recovered content')).toBeTruthy();
  });
});
