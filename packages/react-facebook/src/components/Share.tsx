import React, { forwardRef, memo, type Ref, useMemo } from 'react';
import Parser, { type ParserProps } from './Parser';
import getCurrentHref from '../utils/getCurrentHref';

export type ShareProps = Partial<ParserProps> & {
  href?: string;
  lazy?: boolean; // default fb 'false'
  size?: 'small' | 'large'; // default fb 'small'
  layout?: 'box_count' | 'button_count' | 'button' | 'icon_link'; // default fb 'icon_link'
};

function Share(props: ShareProps, ref: Ref<HTMLElement>) {
  const {
    className = '',
    href = getCurrentHref(),
    lazy,
    layout,
    size,
    ...rest
  } = props;

  const data = useMemo(() => {
    return {
      'data-href': href,
      'data-lazy': lazy ? 'true' : 'false',
      'data-size': size,
      'data-layout': layout,
    };
  }, [href, lazy, size, layout]);

  return (
    <Parser
      className={`fb-share-button ${className}`}
      data={data}
      {...rest}
      ref={ref}
    />
  );
}

export default memo(forwardRef(Share));
