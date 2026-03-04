import { useEffect, useRef } from 'react';
import usePixel from './usePixel';

export type UsePageViewProps = {
  trackOnMount?: boolean;
  trackOnRouteChange?: boolean;
};

export type UsePageViewReturn = {
  pageView: () => Promise<void>;
  loading: boolean;
};

// Shared history patch: only applied once, dispatches a custom event
// that all hook instances can listen to without interfering with each other.
const HISTORY_CHANGE_EVENT = 'react-facebook:history-change';
let historyPatched = false;

function ensureHistoryPatched() {
  if (historyPatched || typeof window === 'undefined') return;
  historyPatched = true;

  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  history.pushState = (...args: Parameters<typeof history.pushState>) => {
    originalPushState(...args);
    window.dispatchEvent(new Event(HISTORY_CHANGE_EVENT));
  };

  history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
    originalReplaceState(...args);
    window.dispatchEvent(new Event(HISTORY_CHANGE_EVENT));
  };
}

/**
 * Hook for automatically tracking Facebook Pixel page views
 *
 * @param props - Configuration for page view tracking
 * @returns Object with manual pageView trigger and loading state
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   // Automatically tracks page view on mount
 *   usePageView();
 *
 *   return <div>Page content</div>;
 * }
 *
 * // With route change tracking
 * function App() {
 *   usePageView({ trackOnRouteChange: true });
 *   return <Router />;
 * }
 * ```
 */
export default function usePageView(props: UsePageViewProps = {}): UsePageViewReturn {
  const { trackOnMount = true, trackOnRouteChange = false } = props;
  const { pageView, loading } = usePixel();
  const previousUrlRef = useRef<string>('');
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  useEffect(() => {
    if (trackOnMount && !loading) {
      pageView();
    }
  }, [trackOnMount, loading, pageView]);

  useEffect(() => {
    if (!trackOnRouteChange || typeof window === 'undefined') return;

    previousUrlRef.current = window.location.href;

    function handleUrlChange() {
      const currentUrl = window.location.href;
      if (previousUrlRef.current !== currentUrl) {
        previousUrlRef.current = currentUrl;
        if (!loadingRef.current) {
          pageView();
        }
      }
    }

    ensureHistoryPatched();

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener(HISTORY_CHANGE_EVENT, handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener(HISTORY_CHANGE_EVENT, handleUrlChange);
    };
  }, [trackOnRouteChange, pageView]);

  return { pageView, loading };
}
