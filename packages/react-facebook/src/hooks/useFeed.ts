import { useState } from 'react';
import clearUndefinedProperties from '../utils/clearUndefinedProperties';
import useFacebook from './useFacebook';
import getCurrentHref from '../utils/getCurrentHref';

export default function useFeed() {
  const { init } = useFacebook();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  async function handleFeed(options: {
    link?: string,
    appId?: string;
    from: string;
    to: string;
    picture?: string;
    source?: string;
    display?: string;
    name?: string;
    caption?: string;
    description?: string;
    dataRef?: string;
    redirectURI?: string;
  }) {
    try {
      setError(undefined);
      setIsLoading(true);
  
      const api = await init();
      if (!api) {
        throw new Error('Facebook API is not initialized');
      }

      const {
        link = getCurrentHref(),
        appId = api.getAppId(),
        display,
        redirectURI,
        from,
        to,
        picture,
        source,
        name,
        caption,
        description,
        dataRef,
      } = options;
  
      return api.ui(clearUndefinedProperties({
        method: 'feed',
        link,
        display,
        app_id: appId,
        redirect_uri: redirectURI,
        from,
        to,
        picture,
        source,
        name,
        caption,
        description,
        ref: dataRef,
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
    feed: handleFeed,
  };
}
