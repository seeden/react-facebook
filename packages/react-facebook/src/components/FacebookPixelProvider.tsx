import { useState, useEffect, useRef, useCallback, useMemo, createContext, type ReactNode } from 'react';
import createFacebookPixel from '../utils/FacebookPixel';
import type { FacebookPixelInstance, PixelOptions } from '../utils/FacebookPixel';

export type FacebookPixelContextInterface = {
  loading: boolean;
  error: Error | undefined;
  init: () => Promise<void>;
  pixel: FacebookPixelInstance | undefined;
  pageView: () => Promise<void>;
  track: (eventName: string, data?: Record<string, unknown>) => Promise<void>;
  trackCustom: (eventName: string, data?: Record<string, unknown>) => Promise<void>;
  grantConsent: () => Promise<void>;
  revokeConsent: () => Promise<void>;
  fbq: (...args: unknown[]) => Promise<void>;
};

export const FacebookPixelContext = createContext<FacebookPixelContextInterface | undefined>(undefined);

export type FacebookPixelProviderProps = PixelOptions & {
  children: ReactNode;
  lazy?: boolean;
};

export default function FacebookPixelProvider(props: FacebookPixelProviderProps) {
  const { children, lazy = false, ...options } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const pixelRef = useRef<FacebookPixelInstance | undefined>(undefined);
  const initPromiseRef = useRef<Promise<void> | undefined>(undefined);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const init = useCallback(async () => {
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    initPromiseRef.current = (async () => {
      try {
        if (pixelRef.current) {
          return;
        }

        setLoading(true);
        setError(undefined);

        pixelRef.current = createFacebookPixel(optionsRef.current);
        await pixelRef.current.init();
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    })();

    return initPromiseRef.current;
  }, []);

  const pageView = useCallback(async () => {
    await init();
    await pixelRef.current?.pageView();
  }, [init]);

  const track = useCallback(
    async (eventName: string, data?: Record<string, unknown>) => {
      await init();
      await pixelRef.current?.track(eventName as Parameters<FacebookPixelInstance['track']>[0], data);
    },
    [init],
  );

  const trackCustom = useCallback(
    async (eventName: string, data?: Record<string, unknown>) => {
      await init();
      await pixelRef.current?.trackCustom(eventName, data);
    },
    [init],
  );

  const grantConsent = useCallback(async () => {
    await init();
    await pixelRef.current?.grantConsent();
  }, [init]);

  const revokeConsent = useCallback(async () => {
    await init();
    await pixelRef.current?.revokeConsent();
  }, [init]);

  const fbq = useCallback(
    async (...args: unknown[]) => {
      await init();
      await pixelRef.current?.fbq(...args);
    },
    [init],
  );

  useEffect(() => {
    if (!lazy) {
      init();
    }
  }, [lazy]);

  const value: FacebookPixelContextInterface = useMemo(
    () => ({
      loading,
      error,
      init,
      pixel: pixelRef.current,
      pageView,
      track,
      trackCustom,
      grantConsent,
      revokeConsent,
      fbq,
    }),
    [loading, error, init, pageView, track, trackCustom, grantConsent, revokeConsent, fbq],
  );

  return <FacebookPixelContext.Provider value={value}>{children}</FacebookPixelContext.Provider>;
}
