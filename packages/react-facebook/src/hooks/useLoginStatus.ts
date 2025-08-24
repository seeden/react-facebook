import { useEffect, useState, useCallback } from 'react';
import useFacebook from './useFacebook';
import useSubscribe from './useSubscribe';
import LoginStatus from '../constants/LoginStatus';

export default function useLoginStatus(): {
  isLoading: boolean;
  error?: Error;
  status?: LoginStatus;
} {
  const { init } = useFacebook();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [status, setStatus] = useState<LoginStatus>(LoginStatus.UNKNOWN);

  const handleStatusChanges = useCallback((response: { status: LoginStatus }) => {
    setStatus(response.status);
  }, []);

  useSubscribe('auth.statusChange', handleStatusChanges);

  async function handleGetInitState() {
    try {
      setIsLoading(true);
      const api = await init();
      if (!api) {
        throw new Error('Facebook API is not initialized');
      }

      const { status } = await api.getLoginStatus();
      setStatus(status);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleGetInitState();
  }, []);
  
  return {
    isLoading,
    error,
    status,
  };
}