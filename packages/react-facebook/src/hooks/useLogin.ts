import { useState } from 'react';
import useFacebook from './useFacebook';
import type { LoginResponse } from '../utils/Facebook';
import LoginStatus from '../constants/LoginStatus';

export type LoginOptions = {
  scope?: string;
  returnScopes?: boolean;
  authType?: string[];
  rerequest?: boolean;
  reauthorize?: boolean;
};

export default function useLogin() {
  const { api, isLoading } = useFacebook();
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);
  const [latestResponse, setLatestResponse] = useState<LoginResponse | undefined>();

  async function handleLogin(loginOptions: LoginOptions, callback?: (response: LoginResponse) => void) {
    try {
      if (!api) {
        throw new Error('Facebook API is not initialized');
      }

      setIsLoadingLogin(true);

      const response = await api.login(loginOptions);
      if (response.status !== LoginStatus.CONNECTED) {
        throw new Error('Unauthorized user');
      }

      setLatestResponse(response);

      callback?.(response);
      return response;
    } catch (error) {
      setError(error as Error);
      throw(error);
    } finally {
      setIsLoadingLogin(false);
    }
  }

  return {
    login: handleLogin,
    error,
    isLoading: isLoading || isLoadingLogin,
    status: latestResponse?.status,
  };
}
