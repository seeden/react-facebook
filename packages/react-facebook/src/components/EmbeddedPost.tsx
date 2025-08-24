import React, { memo, forwardRef, useMemo, type Ref } from 'react';
import Parser, { type ParserProps } from './Parser';

export type EmbeddedPostProps = Partial<ParserProps> & {
  href: string;
  width?: string | number;
  showText?: boolean;
  lazy?: boolean;
};

function EmbeddedPost(props: EmbeddedPostProps, ref: Ref<HTMLElement>) {
  const {
    className = '',
    href,
    width,
    showText,
    lazy,
    ...rest
  } = props;

  const data = useMemo(() => {
    return {
      'data-href': href,
      'data-width': width?.toString(),
      'data-lazy': lazy ? 'true' : 'false',
      'data-show-text': showText ? 'true' : 'false',
    };
  }, [href, width, lazy, showText]);

  return (
    <Parser className={`fb-post ${className}`} data={data} {...rest} ref={ref} />
  );
}

export default memo(forwardRef(EmbeddedPost));
