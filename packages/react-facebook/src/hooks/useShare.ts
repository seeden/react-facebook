import useDialog from './useDialog';

export type ShareOptions = {
  href: string;
  display: 'iframe' | 'popup' | 'async' | 'page';
  hashtag?: string;
  redirectUri?: string;
};

export type UseShareReturn = {
  loading: boolean;
  error: Error | undefined;
  share: (options: ShareOptions) => Promise<unknown>;
};

/**
 * Hook for sharing content via Facebook Share dialog
 *
 * @returns Object with share function, loading state, and error
 *
 * @example
 * ```tsx
 * function ShareComponent() {
 *   const { share, loading, error } = useShare();
 *
 *   const handleShare = () => {
 *     share({
 *       href: 'https://example.com',
 *       display: 'popup',
 *       hashtag: '#example',
 *     });
 *   };
 *
 *   return <button onClick={handleShare} disabled={loading}>Share</button>;
 * }
 * ```
 */
export default function useShare(): UseShareReturn {
  const { loading, error, invoke } = useDialog<ShareOptions>('share', (options, api) => {
    const { href, display, hashtag, redirectUri, ...rest } = options;
    return { href, display, app_id: api.getAppId(), hashtag, redirect_uri: redirectUri, ...rest };
  });

  return { loading, error, share: invoke };
}
