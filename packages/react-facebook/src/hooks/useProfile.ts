import { useState, useEffect } from 'react';
import LoginStatus from '../constants/LoginStatus';
import useFacebook from './useFacebook';
import useLoginStatus from "./useLoginStatus";

export default function useProfile(fields: string[]) {
  const { init } = useFacebook();
  const { status } = useLoginStatus();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Record<string, any> | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  async function updateProfile() {
    try {
      setError(undefined);
      setIsLoading(true);

      const api = await init();
      if (!api) {
        throw new Error('Facebook API is not initialized');
      }

      if (status === LoginStatus.CONNECTED) {
        const profile = await api.getProfile({
          fields,
        });

        setProfile(profile as Record<string, any>);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    updateProfile();
  }, [status, fields, init]);

  return {
    isLoading,
    error,
    profile,
  };
}
