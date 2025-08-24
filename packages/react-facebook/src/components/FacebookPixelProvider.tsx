import React, { useState, useEffect, useRef, createContext } from 'react';
import type { ReactNode } from 'react';
import FacebookPixel from '../utils/FacebookPixel';
import type { PixelOptions } from '../utils/FacebookPixel';

export type FacebookPixelContextInterface = {
  isLoading: boolean;
  error: Error | undefined;
  init: () => Promise<void>;
  pixel: FacebookPixel | undefined;
  pageView: () => Promise<void>;
  track: (eventName: string, data?: Record<string, any>) => Promise<void>;
  trackCustom: (eventName: string, data?: Record<string, any>) => Promise<void>;
  grantConsent: () => Promise<void>;
  revokeConsent: () => Promise<void>;
  fbq: (...args: any[]) => Promise<void>;
};

export const FacebookPixelContext = createContext<FacebookPixelContextInterface | undefined>(undefined);

export type FacebookPixelProviderProps = PixelOptions & {
  children: ReactNode;
  lazy?: boolean;
};

export default function FacebookPixelProvider(props: FacebookPixelProviderProps) {
  const { children, lazy = false, ...options } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();
  const pixelRef = useRef<FacebookPixel | undefined>();
  const initPromiseRef = useRef<Promise<void> | undefined>();

  async function init() {
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    initPromiseRef.current = (async () => {
      try {
        if (pixelRef.current) {
          return;
        }

        setIsLoading(true);
        setError(undefined);

        pixelRef.current = new FacebookPixel(options);
        await pixelRef.current.init();
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    })();

    return initPromiseRef.current;
  }

  async function pageView() {
    await init();
    await pixelRef.current?.pageView();
  }

  async function track(eventName: string, data?: Record<string, any>) {
    await init();
    await pixelRef.current?.track(eventName as any, data);
  }

  async function trackCustom(eventName: string, data?: Record<string, any>) {
    await init();
    await pixelRef.current?.trackCustom(eventName, data);
  }

  async function grantConsent() {
    await init();
    await pixelRef.current?.grantConsent();
  }

  async function revokeConsent() {
    await init();
    await pixelRef.current?.revokeConsent();
  }

  async function fbq(...args: any[]) {
    await init();
    await pixelRef.current?.fbq(...args);
  }

  useEffect(() => {
    if (!lazy) {
      init();
    }
  }, [lazy]);

  const value: FacebookPixelContextInterface = {
    isLoading,
    error,
    init,
    pixel: pixelRef.current,
    pageView,
    track,
    trackCustom,
    grantConsent,
    revokeConsent,
    fbq,
  };

  return (
    <FacebookPixelContext.Provider value={value}>
      {children}
    </FacebookPixelContext.Provider>
  );
}


