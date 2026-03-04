import { type ReactNode, type ComponentType, type ElementType, type CSSProperties } from 'react';
import type { ShareOptions } from '../hooks/useShare';
import useShare from '../hooks/useShare';

export type ShareButtonProps = ShareOptions & {
  children?: ReactNode;
  as?: ComponentType | ElementType;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export default function ShareButton(props: ShareButtonProps) {
  const {
    as: AsChild = 'button',
    disabled,
    href,
    display,
    hashtag,
    redirectUri,
    ...rest
  } = props;

  const { loading, share } = useShare();

  const isDisabled = disabled || loading;

  function handleShare() {
    if (isDisabled) return;

    share({
      href,
      display,
      hashtag,
      redirectUri,
    });
  }

  return (
    <AsChild
      onClick={handleShare}
      disabled={isDisabled}
      {...rest}
    />
  );
}
