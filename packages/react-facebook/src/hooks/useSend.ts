import useDialog from './useDialog';
import getCurrentHref from '../utils/getCurrentHref';

export type SendOptions = {
  link?: string;
  appId?: string;
  to: string;
  redirectURI?: string;
  display?: string;
};

export type UseSendReturn = {
  loading: boolean;
  error: Error | undefined;
  send: (options: SendOptions) => Promise<unknown>;
};

/**
 * Hook for sending messages via Facebook Send dialog
 *
 * @returns Object with send function, loading state, and error
 *
 * @example
 * ```tsx
 * function SendComponent() {
 *   const { send, loading } = useSend();
 *
 *   const handleSend = () => {
 *     send({
 *       to: 'friend_id',
 *       link: 'https://example.com',
 *     });
 *   };
 *
 *   return <button onClick={handleSend} disabled={loading}>Send</button>;
 * }
 * ```
 */
export default function useSend(): UseSendReturn {
  const { loading, error, invoke } = useDialog<SendOptions>('send', (options, api) => {
    const {
      link = getCurrentHref(),
      display,
      appId = api.getAppId(),
      to,
      redirectURI,
    } = options;

    return {
      link,
      display,
      app_id: appId,
      to,
      redirect_uri: redirectURI,
    };
  });

  return { loading, error, send: invoke };
}
