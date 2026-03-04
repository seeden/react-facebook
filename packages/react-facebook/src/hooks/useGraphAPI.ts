import { useState, useEffect, useCallback, useRef } from 'react';
import useFacebook from './useFacebook';
import { Method } from '../utils/Facebook';

export type GraphAPIOptions<T = unknown> = {
  /** Graph API path, e.g. '/me', '/me/friends', '/{post-id}/comments' */
  path: string;
  /** HTTP method (default: GET) */
  method?: Method;
  /** Query parameters */
  params?: Record<string, unknown>;
  /** Whether to fetch automatically on mount (default: true) */
  autoFetch?: boolean;
  /** Transform the response before storing */
  transform?: (data: unknown) => T;
};

export type UseGraphAPIReturn<T = unknown> = {
  /** The response data, undefined until loaded */
  data: T | undefined;
  /** Whether the request is in progress */
  loading: boolean;
  /** Error from the most recent request, if any */
  error: Error | undefined;
  /** Manually trigger the API call. Returns the response. */
  fetch: (overrideParams?: Record<string, unknown>) => Promise<T>;
  /** Reset data and error to initial state */
  reset: () => void;
};

/**
 * Hook for making Facebook Graph API calls with automatic loading/error state management
 *
 * @param options - Configuration for the Graph API call
 * @returns Object with data, loading state, error, and fetch/reset functions
 *
 * @example
 * ```tsx
 * // Auto-fetch on mount
 * function MyFriends() {
 *   const { data, loading, error } = useGraphAPI({
 *     path: '/me/friends',
 *     params: { limit: 10 },
 *   });
 *
 *   if (loading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *   return <ul>{data?.data?.map(f => <li key={f.id}>{f.name}</li>)}</ul>;
 * }
 *
 * // Manual fetch
 * function PostComment() {
 *   const { fetch, loading } = useGraphAPI({
 *     path: '/me/feed',
 *     method: Method.POST,
 *     autoFetch: false,
 *   });
 *
 *   return (
 *     <button onClick={() => fetch({ message: 'Hello!' })} disabled={loading}>
 *       Post
 *     </button>
 *   );
 * }
 * ```
 */
export default function useGraphAPI<T = unknown>(options: GraphAPIOptions<T>): UseGraphAPIReturn<T> {
  const {
    path,
    method = Method.GET,
    params,
    autoFetch = true,
    transform,
  } = options;

  const { init } = useFacebook();
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | undefined>(undefined);
  const mountedRef = useRef(true);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  // Stabilize params for dependency tracking
  const paramsKey = params ? JSON.stringify(params) : '';

  const fetchData = useCallback(async (overrideParams?: Record<string, unknown>) => {
    try {
      setError(undefined);
      setLoading(true);

      const api = await init();
      if (!api) {
        throw new Error('[react-facebook] Facebook API is not initialized');
      }

      const requestParams = overrideParams ?? params ?? {};
      const response = await api.api<T>(path, method, requestParams);
      const result = transformRef.current ? transformRef.current(response) : response;

      if (mountedRef.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (mountedRef.current) {
        setError(error);
      }
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [init, path, method, paramsKey]);

  const reset = useCallback(() => {
    setData(undefined);
    setError(undefined);
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (autoFetch) {
      fetchData().catch(() => {
        // Error is already stored in state
      });
    }
    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, fetchData]);

  return { data, loading, error, fetch: fetchData, reset };
}
