import React, { forwardRef, memo, useMemo, type Ref } from 'react';
import Parser, { type ParserProps } from './Parser';
import getCurrentHref from '../utils/getCurrentHref';

export type CommentsProps = Partial<ParserProps> & {
  href?: string;
  numPosts?: number;
  orderBy?: 'reverse_time' | 'time';
  width?: number | string;
  colorScheme?: 'light' | 'dark';
  mobile?: boolean;
  lazy?: boolean;
};

function Comments(props: CommentsProps, ref: Ref<HTMLElement>) {
  const {
    className = '',
    colorScheme,
    href = getCurrentHref(),
    numPosts,
    orderBy,
    width,
    mobile,
    lazy,
    ...rest
  } = props;

  const data = useMemo(() => {
    return {
      'data-colorscheme': colorScheme,
      'data-numposts': numPosts?.toString(),
      'data-href': href,
      'data-order-by': orderBy,
      'data-width': width?.toString(),
      'data-skin': colorScheme,
      'data-mobile': mobile ? 'true' : 'false',
      'data-lazy': lazy ? 'true' : 'false',
    };
  }, [colorScheme, href, numPosts, orderBy, width, mobile, lazy]);

  return (
    <Parser className={`fb-comments ${className}`} data={data} {...rest} ref={ref} />
  );
}

export default memo(forwardRef(Comments));
