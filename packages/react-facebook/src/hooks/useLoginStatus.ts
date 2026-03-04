import { useEffect, useState, useCallback } from 'react';
import useFacebook from './useFacebook';
import useSubscribe from './useSubscribe';
import LoginStatus from '../constants/LoginStatus';

export type UseLoginStatusReturn = {
  loading: boolean;
  error?: Error;
  status?: LoginStatus;
};

/**
 * Hook for monitoring the user's Facebook login status
 *
 * @returns Object with current login status, loading state, and error
 *
 * @example
 * ```tsx
 * function StatusComponent() {
 *   const { status, loading } = useLoginStatus();
 *
 *   if (loading) return <p>Checking status...</p>;
 *
 *   return <p>Status: {status}</p>;
 * }
 * ```
 */
export default function useLoginStatus(): UseLoginStatusReturn {
  const { init } = useFacebook();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [status, setStatus] = useState<LoginStatus>(LoginStatus.UNKNOWN);

  const handleStatusChanges = useCallback((response: { status: LoginStatus }) => {
    setStatus(response.status);
  }, []);

  useSubscribe('auth.statusChange', handleStatusChanges);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        setLoading(true);
        const api = await init();
        if (cancelled) return;
        if (!api) {
          throw new Error('Facebook API is not initialized');
        }

        const { status } = await api.getLoginStatus();
        if (!cancelled) setStatus(status);
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error : new Error(String(error)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStatus();

    return () => { cancelled = true; };
  }, [init]);
  
  return {
    loading,
    error,
    status,
  };
}