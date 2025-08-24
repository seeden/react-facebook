import { useState } from 'react';
import clearUndefinedProperties from '../utils/clearUndefinedProperties';
import useFacebook from './useFacebook';
import getCurrentHref from '../utils/getCurrentHref';

export default function useSend() {
  const { init } = useFacebook();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  async function handleSend(options: {
    link?: string,
    appId?: string;
    to: string;
    redirectURI?: string;
    display?: string;
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
        display,
        appId = api.getAppId(),
        to,
        redirectURI,
      } = options;
  
      return api.ui(clearUndefinedProperties({
        method: 'send',
        link,
        display,
        app_id: appId,
        to,
        redirect_uri: redirectURI,
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
    send: handleSend,
  };
}
