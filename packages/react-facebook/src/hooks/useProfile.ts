import { useState, useEffect } from 'react';
import LoginStatus from '../constants/LoginStatus';
import useFacebook from './useFacebook';
import useLoginStatus from './useLoginStatus';

export type UseProfileReturn = {
  loading: boolean;
  error: Error | undefined;
  profile: Record<string, unknown> | undefined;
};

/**
 * Hook for fetching the logged-in user's Facebook profile
 *
 * @param fields - Array of profile fields to request (e.g., ['name', 'email', 'picture'])
 * @returns Object with profile data, loading state, and error
 *
 * @example
 * ```tsx
 * function ProfileComponent() {
 *   const { profile, loading, error } = useProfile(['name', 'email', 'picture']);
 *
 *   if (loading) return <p>Loading profile...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *   if (!profile) return <p>Not logged in</p>;
 *
 *   return <p>Hello, {profile.name}!</p>;
 * }
 * ```
 */
export default function useProfile(fields: string[], enabled = true): UseProfileReturn {
  const { init } = useFacebook();
  const { status } = useLoginStatus();

  const [loading, setLoading] = useState<boolean>(enabled);
  const [profile, setProfile] = useState<Record<string, unknown> | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Stabilize fields reference to prevent infinite re-renders
  const fieldsKey = fields.join(',');

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function updateProfile() {
      try {
        setError(undefined);
        setLoading(true);

        const api = await init();
        if (!api || cancelled) return;

        if (status === LoginStatus.CONNECTED) {
          const result = await api.getProfile({
            fields: fieldsKey,
          });

          if (!cancelled) {
            setProfile(result as Record<string, unknown>);
          }
        } else {
          if (!cancelled) {
            setProfile(undefined);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error : new Error(String(error)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    updateProfile();

    return () => {
      cancelled = true;
    };
  }, [enabled, status, fieldsKey, init]);

  return {
    loading,
    error,
    profile,
  };
}
