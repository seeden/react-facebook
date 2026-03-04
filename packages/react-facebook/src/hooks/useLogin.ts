import { useState, useCallback, useRef } from 'react';
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

export type UseLoginReturn = {
  login: (loginOptions: LoginOptions, callback?: (response: LoginResponse) => void) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  loading: boolean;
  error: Error | undefined;
  status: LoginStatus | undefined;
};

/**
 * Hook for handling Facebook login and logout
 *
 * @returns Object with login/logout functions, loading state, error, and login status
 *
 * @example
 * ```tsx
 * function LoginComponent() {
 *   const { login, logout, loading, error, status } = useLogin();
 *
 *   if (status === 'connected') {
 *     return <button onClick={logout} disabled={loading}>Logout</button>;
 *   }
 *
 *   return <button onClick={() => login({ scope: 'email' })} disabled={loading}>Login</button>;
 * }
 * ```
 */
export default function useLogin(): UseLoginReturn {
  const { api, loading: sdkLoading, init } = useFacebook();
  const [error, setError] = useState<Error | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [latestResponse, setLatestResponse] = useState<LoginResponse | undefined>();
  const apiRef = useRef(api);
  apiRef.current = api;

  const handleLogin = useCallback(async (loginOptions: LoginOptions, callback?: (response: LoginResponse) => void) => {
    try {
      if (!apiRef.current) {
        throw new Error('[react-facebook] Facebook API is not initialized');
      }

      setError(undefined);
      setActionLoading(true);

      const response = await apiRef.current.login(loginOptions);
      if (response.status !== LoginStatus.CONNECTED) {
        throw new Error('[react-facebook] Unauthorized user');
      }

      setLatestResponse(response);

      callback?.(response);
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setError(undefined);
      setActionLoading(true);
      const api = await init();
      if (!api) {
        throw new Error('[react-facebook] Facebook API is not initialized');
      }
      await api.logout();
      setLatestResponse(undefined);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [init]);

  return {
    login: handleLogin,
    logout: handleLogout,
    loading: sdkLoading || actionLoading,
    error,
    status: latestResponse?.status,
  };
}
