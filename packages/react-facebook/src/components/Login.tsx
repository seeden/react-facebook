import React, { type ReactNode, type ReactElement, type ComponentType, type ElementType, useEffect } from 'react';
import useLogin from '../hooks/useLogin';
import useProfile from '../hooks/useProfile';
import type { LoginOptions } from '../hooks/useLogin';
import type { LoginResponse } from '../utils/Facebook';

type LoginRenderProps = {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
};

export type LoginProps = Omit<LoginOptions, 'scope'> & {
  children?: ReactNode | ((props: LoginRenderProps) => ReactElement);
  
  onSuccess?: (response: LoginResponse) => void;
  onError?: (error: Error) => void;
  onProfileSuccess?: (profile: any) => void;
  
  scope?: string | string[];
  fields?: string[];
  

  as?: ElementType | ComponentType<any>;
  disabled?: boolean;
  
  [key: string]: any;
};

export default function Login(props: LoginProps) {
  const {
    children,
    onSuccess,
    onError,
    onProfileSuccess,
    fields = [],
    as: Component = 'button',
    disabled = false,
    scope = ['public_profile', 'email'],
    returnScopes,
    authType,
    rerequest,
    reauthorize,
    ...rest
  } = props;

  const { isLoading, login } = useLogin();
  const { profile } = useProfile(fields);


  useEffect(() => {
    if (profile && onProfileSuccess) {
      onProfileSuccess(profile);
    }
  }, [profile, onProfileSuccess]);

  const handleLogin = async () => {
    if (isLoading || disabled) return;

    try {
      const response = await login({
        scope: Array.isArray(scope) ? scope.join(',') : scope,
        returnScopes,
        authType,
        rerequest,
        reauthorize,
      });

      onSuccess?.(response);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const isDisabled = disabled || isLoading;

  // Render props pattern
  if (typeof children === 'function') {
    return children({
      onClick: handleLogin,
      isLoading,
      isDisabled,
    });
  }

  // Default button rendering
  return (
    <Component
      onClick={handleLogin}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? 'Loading...' : (children || 'Login with Facebook')}
    </Component>
  );
}