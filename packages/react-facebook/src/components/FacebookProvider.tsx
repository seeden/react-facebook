import React, { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import Facebook from '../utils/Facebook';
import type { FacebookOptions } from '../utils/Facebook';
import FacebookContext from './FacebookContext';
import type { FacebookContextInterface } from './FacebookContext';
import FacebookPixelProvider from './FacebookPixelProvider';

export type FacebookProviderProps = FacebookOptions & {
  children: ReactNode;
  /** Facebook Pixel configuration */
  pixel?: {
    pixelId: string;
    autoConfig?: boolean;
    debug?: boolean;
    advancedMatching?: Record<string, any>;
  };
};

export default function FacebookProvider(props: FacebookProviderProps) {
  const { children, pixel, ...options } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const [locale, setLocaleState] = useState<string>(options.language || 'en_US');
  const apiRef = useRef<Facebook | undefined>();
  const initPromiseRef = useRef<Promise<Facebook | undefined> | undefined>();

  async function init() {
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    initPromiseRef.current = (async () => {
      try {
        if (apiRef.current) {
          return apiRef.current;
        }

        setIsReady(false);
        setIsLoading(true);

        apiRef.current = new Facebook(options);

        await apiRef.current.init();

        setIsReady(true);
        return apiRef.current;
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }

      return apiRef.current;
    })();

    return initPromiseRef.current;
  }

  async function parse(element: HTMLElement) {
    const api = await init();
    if (api) {
      await api.parse(element);
    }
  }

  async function setLocale(newLocale: string) {
    if (!apiRef.current) {
      // If API not initialized yet, just update the state
      setLocaleState(newLocale);
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);
      
      // Change locale on the Facebook API instance
      await apiRef.current.changeLocale(newLocale);
      
      // Update local state
      setLocaleState(newLocale);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const { lazy } = options;
    if (!lazy) {
      init();
    }
  }, [options.lazy]);

  useEffect(() => {
    const newLocale = options.language || 'en_US';
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  }, [options.language, locale]);

  const value: FacebookContextInterface = {
    isLoading,
    error,
    init,
    api: isReady ? apiRef.current : undefined,
    parse,
    locale,
    setLocale,
  };

  const content = (
    <FacebookContext.Provider value={value}>
      {children}
    </FacebookContext.Provider>
  );

  // Wrap with pixel provider if pixel config is provided
  if (pixel) {
    return (
      <FacebookPixelProvider {...pixel}>
        {content}
      </FacebookPixelProvider>
    );
  }

  return content;
}
