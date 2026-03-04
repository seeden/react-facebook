import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from 'react';
import createFacebook from '../utils/Facebook';
import type { FacebookOptions, FacebookInstance } from '../utils/Facebook';
import FacebookContext from './FacebookContext';
import type { FacebookContextInterface } from './FacebookContext';
import FacebookPixelProvider from './FacebookPixelProvider';

export type FacebookProviderProps = FacebookOptions & {
  children: ReactNode;
  /** Facebook Pixel ID — enables automatic pixel integration */
  pixelId?: string;
};

export default function FacebookProvider(props: FacebookProviderProps) {
  const { children, pixelId, ...options } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const [locale, setLocaleState] = useState<string>(options.language || 'en_US');
  const apiRef = useRef<FacebookInstance | undefined>(undefined);
  const initPromiseRef = useRef<Promise<FacebookInstance | undefined> | undefined>(undefined);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const init = useCallback(async () => {
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    initPromiseRef.current = (async () => {
      try {
        if (apiRef.current) {
          return apiRef.current;
        }

        setIsReady(false);
        setLoading(true);

        apiRef.current = createFacebook(optionsRef.current);

        await apiRef.current.init();

        setIsReady(true);
        return apiRef.current;
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }

      return apiRef.current;
    })();

    return initPromiseRef.current;
  }, []);

  const parse = useCallback(
    async (element: HTMLElement) => {
      const api = await init();
      if (api) {
        await api.parse(element);
      }
    },
    [init],
  );

  const setLocale = useCallback(async (newLocale: string) => {
    if (!apiRef.current) {
      setLocaleState(newLocale);
      return;
    }

    try {
      setLoading(true);
      setError(undefined);

      await apiRef.current.changeLocale(newLocale);

      setLocaleState(newLocale);
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { lazy } = options;
    if (!lazy) {
      init();
    }
  }, [options.lazy]);

  // Sync locale when the language *prop* changes (controlled mode).
  // We intentionally exclude `locale` from the dependency array so that
  // programmatic setLocale() calls are not reverted.
  useEffect(() => {
    const newLocale = options.language || 'en_US';
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  }, [options.language]);

  const value: FacebookContextInterface = useMemo(
    () => ({
      loading,
      error,
      init,
      api: isReady ? apiRef.current : undefined,
      parse,
      locale,
      setLocale,
    }),
    [loading, error, init, isReady, parse, locale, setLocale],
  );

  const content = <FacebookContext.Provider value={value}>{children}</FacebookContext.Provider>;

  if (pixelId) {
    return <FacebookPixelProvider pixelId={pixelId}>{content}</FacebookPixelProvider>;
  }

  return content;
}
