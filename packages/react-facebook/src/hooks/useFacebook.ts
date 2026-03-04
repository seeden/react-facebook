import { useContext, useEffect } from 'react';
import FacebookContext from '../components/FacebookContext';
import type { FacebookContextInterface } from '../components/FacebookContext';

export type UseFacebookProps = {
  lazy?: boolean;
};

/**
 * Hook for accessing the Facebook SDK context
 *
 * @returns The Facebook context with API instance, loading state, and utilities
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { api, loading, error } = useFacebook();
 *
 *   if (loading) return <p>Loading Facebook SDK...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *
 *   return <p>Facebook SDK ready! App ID: {api?.getAppId()}</p>;
 * }
 * ```
 */
export default function useFacebook(props: UseFacebookProps = {}): FacebookContextInterface {
  const { lazy = false } = props;

  const context: FacebookContextInterface | undefined = useContext(FacebookContext);
  if (!context) {
    throw new Error(
      '[react-facebook] useFacebook must be used within a <FacebookProvider>. ' +
      'Wrap your component tree with <FacebookProvider appId="YOUR_APP_ID">.'
    );
  }

  useEffect(() => {
    if (!lazy) {
      context.init();
    }
  }, [lazy, context.init]);

  return context;
}
