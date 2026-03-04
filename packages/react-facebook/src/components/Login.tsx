import {
  type ReactNode,
  type ReactElement,
  type ComponentType,
  type ElementType,
  type CSSProperties,
  useEffect,
  useRef,
} from 'react';
import useLogin from '../hooks/useLogin';
import useProfile from '../hooks/useProfile';
import type { LoginOptions } from '../hooks/useLogin';
import type { LoginResponse } from '../utils/Facebook';

type LoginRenderProps = {
  onClick: () => void;
  loading: boolean;
  isDisabled: boolean;
};

export type LoginProps = Omit<LoginOptions, 'scope'> & {
  children?: ReactNode | ((props: LoginRenderProps) => ReactElement);

  onSuccess?: (response: LoginResponse) => void;
  onError?: (error: Error) => void;
  onProfileSuccess?: (profile: Record<string, unknown>) => void;

  scope?: string | string[];
  fields?: string[];

  as?: ElementType | ComponentType<Record<string, unknown>>;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
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

  const { loading, login } = useLogin();
  const shouldFetchProfile = !!onProfileSuccess && fields.length > 0;
  const { profile } = useProfile(fields, shouldFetchProfile);

  const onProfileSuccessRef = useRef(onProfileSuccess);
  onProfileSuccessRef.current = onProfileSuccess;

  useEffect(() => {
    if (profile && onProfileSuccessRef.current) {
      onProfileSuccessRef.current(profile);
    }
  }, [profile]);

  const handleLogin = async () => {
    if (loading || disabled) return;

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
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const isDisabled = disabled || loading;

  // Render props pattern
  if (typeof children === 'function') {
    return children({
      onClick: handleLogin,
      loading,
      isDisabled,
    });
  }

  // Default button rendering
  return (
    <Component
      onClick={handleLogin}
      disabled={isDisabled}
      aria-busy={loading}
      aria-label={loading ? 'Logging in...' : 'Login with Facebook'}
      {...rest}
    >
      {loading ? 'Loading...' : children || 'Login with Facebook'}
    </Component>
  );
}
