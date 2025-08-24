import { useContext, useEffect } from 'react';
import { FacebookPixelContext } from '../components/FacebookPixelProvider';
import type { FacebookPixelContextInterface } from '../components/FacebookPixelProvider';

export type UsePixelProps = {
  lazy?: boolean;
};

export default function usePixel(props: UsePixelProps = {}): FacebookPixelContextInterface {
  const { lazy = false } = props;

  const context: FacebookPixelContextInterface | undefined = useContext(FacebookPixelContext);
  if (!context) {
    throw new Error('usePixel must be used within a FacebookPixelProvider');
  }

  useEffect(() => {
    if (!lazy) {
      context.init();
    }
  }, [lazy, context.init]);

  return context;
}
