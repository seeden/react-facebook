import { useState } from 'react';
import clearUndefinedProperties from '../utils/clearUndefinedProperties';
import useFacebook from './useFacebook';
import type { FacebookInstance } from '../utils/Facebook';

/**
 * Internal factory hook for Facebook dialog-based actions (share, feed, send).
 * Not exported to consumers.
 */
export default function useDialog<TOptions>(
  method: string,
  buildParams: (options: TOptions, api: FacebookInstance) => Record<string, unknown>,
) {
  const { init } = useFacebook();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  async function invoke(options: TOptions) {
    try {
      setError(undefined);
      setLoading(true);

      const api = await init();
      if (!api) {
        throw new Error('[react-facebook] Facebook API is not initialized');
      }

      return api.ui(clearUndefinedProperties({
        method,
        ...buildParams(options, api),
      }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, invoke };
}
