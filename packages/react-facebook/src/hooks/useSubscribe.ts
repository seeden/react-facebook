import { useCallback, useEffect, useRef, useState } from 'react';
import useFacebook from './useFacebook';

/**
 * Hook for subscribing to Facebook SDK events
 *
 * @param event - The Facebook event name to subscribe to (e.g., 'auth.statusChange')
 * @param callback - Optional callback invoked when the event fires
 * @returns The last event value received, or undefined
 *
 * @example
 * ```tsx
 * function AuthListener() {
 *   const lastStatus = useSubscribe('auth.statusChange', (response) => {
 *     console.log('Auth status changed:', response.status);
 *   });
 *
 *   return <p>Last status: {JSON.stringify(lastStatus)}</p>;
 * }
 * ```
 */
export default function useSubscribe<T>(event: string, callback?: (data: T) => void): T | undefined {
  const [lastValue, setLastValue] = useState<T | undefined>(undefined);
  const { init } = useFacebook();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handleResponse = useCallback((value: T) => {
    setLastValue(value);
    callbackRef.current?.(value);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => Promise<void>) | undefined;

    (async () => {
      const api = await init();
      if (cancelled) return;
      if (api) {
        unsubscribe = await api.subscribe(event, handleResponse);
        if (cancelled) unsubscribe();
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [event, handleResponse, init]);

  return lastValue;
}
