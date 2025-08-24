import { useState } from 'react';
import clearUndefinedProperties from '../utils/clearUndefinedProperties';
import useFacebook from './useFacebook';

export type ShareOptions = {
  href: string;
  display: 'iframe' | 'popup' | 'async' | 'page';
  hashtag?: string;
  redirectUri?: string;
};

export default function useShare() {
  const { init } = useFacebook();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  async function handleShare(options: ShareOptions) {
    try {
      const {
        href,
        display,
        hashtag,
        redirectUri,
        ...rest
      } = options;

      setError(undefined);
      setIsLoading(true);
  
      const api = await init();
      if (!api) {
        throw new Error('Facebook API is not initialized');
      }
      
      return api.ui(clearUndefinedProperties({
        method: 'share',
        href,
        display,
        app_id: api.getAppId(),
        hashtag,
        redirect_uri: redirectUri,
        ...rest,
      }));
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    error,
    share: handleShare,
  };
}
