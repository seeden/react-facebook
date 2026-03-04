import useDialog from './useDialog';
import getCurrentHref from '../utils/getCurrentHref';

export type FeedOptions = {
  link?: string;
  appId?: string;
  from: string;
  to: string;
  picture?: string;
  source?: string;
  display?: string;
  name?: string;
  caption?: string;
  description?: string;
  dataRef?: string;
  redirectURI?: string;
};

export type UseFeedReturn = {
  loading: boolean;
  error: Error | undefined;
  feed: (options: FeedOptions) => Promise<unknown>;
};

/**
 * Hook for posting to a user's feed via Facebook Feed dialog
 *
 * @returns Object with feed function, loading state, and error
 *
 * @example
 * ```tsx
 * function FeedComponent() {
 *   const { feed, loading } = useFeed();
 *
 *   const handlePost = () => {
 *     feed({
 *       from: 'me',
 *       to: 'friend_id',
 *       link: 'https://example.com',
 *       name: 'Check this out!',
 *     });
 *   };
 *
 *   return <button onClick={handlePost} disabled={loading}>Post</button>;
 * }
 * ```
 */
export default function useFeed(): UseFeedReturn {
  const { loading, error, invoke } = useDialog<FeedOptions>('feed', (options, api) => {
    const {
      link = getCurrentHref(),
      appId = api.getAppId(),
      display,
      redirectURI,
      from,
      to,
      picture,
      source,
      name,
      caption,
      description,
      dataRef,
    } = options;

    return {
      link,
      display,
      app_id: appId,
      redirect_uri: redirectURI,
      from,
      to,
      picture,
      source,
      name,
      caption,
      description,
      ref: dataRef,
    };
  });

  return { loading, error, feed: invoke };
}
