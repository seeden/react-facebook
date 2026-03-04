import { useContext, useEffect } from 'react';
import { FacebookPixelContext } from '../components/FacebookPixelProvider';
import type { FacebookPixelContextInterface } from '../components/FacebookPixelProvider';

export type UsePixelProps = {
  lazy?: boolean;
};

/**
 * Hook for accessing Facebook Pixel tracking functionality
 *
 * @returns The Pixel context with tracking methods, loading state, and error
 *
 * @example
 * ```tsx
 * function TrackButton() {
 *   const { track, loading } = usePixel();
 *
 *   return (
 *     <button onClick={() => track('Purchase', { value: 9.99, currency: 'USD' })}>
 *       Buy Now
 *     </button>
 *   );
 * }
 * ```
 */
export default function usePixel(props: UsePixelProps = {}): FacebookPixelContextInterface {
  const { lazy = false } = props;

  const context: FacebookPixelContextInterface | undefined = useContext(FacebookPixelContext);
  if (!context) {
    throw new Error(
      '[react-facebook] usePixel must be used within a <FacebookPixelProvider>. ' +
        'Wrap your component tree with <FacebookPixelProvider pixelId="YOUR_PIXEL_ID"> ' +
        'or use the pixel prop on <FacebookProvider>.',
    );
  }

  useEffect(() => {
    if (!lazy) {
      context.init();
    }
  }, [lazy, context.init]);

  return context;
}
