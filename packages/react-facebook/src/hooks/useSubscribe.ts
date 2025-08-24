import { useCallback, useEffect, useState } from 'react';
import useFacebook from './useFacebook';

export default function useSubscribe<T>(event: string, callback?: (data: any) => void): T | undefined {
  const [lastValue, setLastValue] = useState<T | undefined>(undefined);
  const { init } = useFacebook();

  const handleResponse = useCallback((value: T) => {
    setLastValue(value);
    callback?.(value);
  }, [callback]);

  const handleSubscribe = useCallback(async () => {
    const api = await init();
    if (api) {
      await api.subscribe(event, handleResponse);
    }
  }, [event, handleResponse, init]);

  const handleUnsubscribe = useCallback(async () => {
    const api = await init();
    if (api) {
      await api.unsubscribe(event, handleResponse);
    }
  }, [event, handleResponse, init]);


  useEffect(() => {
    handleSubscribe();

    return () => {
      handleUnsubscribe();
    };
  }, [handleSubscribe, handleUnsubscribe]);

  return lastValue;
}
