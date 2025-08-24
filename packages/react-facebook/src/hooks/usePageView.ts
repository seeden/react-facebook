import { useEffect, useRef } from 'react';
import usePixel from './usePixel';

export type UsePageViewProps = {
  trackOnMount?: boolean;
  trackOnRouteChange?: boolean;
};

export default function usePageView(props: UsePageViewProps = {}) {
  const { trackOnMount = true, trackOnRouteChange = false } = props;
  const { pageView, isLoading } = usePixel();
  const previousUrlRef = useRef<string>('');

  useEffect(() => {
    if (trackOnMount && !isLoading) {
      pageView();
    }
  }, [trackOnMount, isLoading, pageView]);

  useEffect(() => {
    if (!trackOnRouteChange) return;

    const currentUrl = window.location.href;
    
    if (previousUrlRef.current !== currentUrl) {
      previousUrlRef.current = currentUrl;
      
      if (!isLoading) {
        pageView();
      }
    }
  }, [trackOnRouteChange, isLoading, pageView]);

  return { pageView, isLoading };
}
