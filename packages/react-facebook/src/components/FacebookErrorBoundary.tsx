import { Component, type ReactNode, type ErrorInfo } from 'react';

export type FacebookErrorBoundaryProps = {
  children: ReactNode;
  /** Fallback UI to show when an error occurs. Can be a ReactNode or a render function. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Callback invoked when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Error boundary component for gracefully handling Facebook SDK errors.
 * Catches errors from ad blockers, network failures, and SDK initialization issues.
 *
 * @example
 * ```tsx
 * <FacebookErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>Facebook features unavailable: {error.message}</p>
 *       <button onClick={reset}>Retry</button>
 *     </div>
 *   )}
 * >
 *   <FacebookProvider appId="YOUR_APP_ID">
 *     <App />
 *   </FacebookProvider>
 * </FacebookErrorBoundary>
 * ```
 */
export default class FacebookErrorBoundary extends Component<FacebookErrorBoundaryProps, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;
      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset);
      }
      if (fallback) {
        return fallback;
      }
      return null;
    }
    return this.props.children;
  }
}
