import React, { type ReactNode, type ComponentType, type ElementType, type CSSProperties } from 'react';
import type { ShareOptions } from '../hooks/useShare';
import useShare from '../hooks/useShare';

export type LoginButton = ShareOptions & {
  children?: ReactNode;
  as?: ComponentType | ElementType;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export default function ShareButton(props: LoginButton) {
  const {
    as: AsChild = 'button',
    disabled,
    href,
    display,
    hashtag,
    redirectUri,
    ...rest
  } = props;

  const { isLoading, share } = useShare();

  function handleShare() {
    if (isLoading) {
      return;
    }

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
      disabled={isLoading}
      {...rest}
    />
  );
}
