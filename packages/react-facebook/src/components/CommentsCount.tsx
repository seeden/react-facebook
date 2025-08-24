import React, { forwardRef, memo, useMemo, type Ref } from 'react';
import Parser, { type ParserProps } from './Parser';
import getCurrentHref from '../utils/getCurrentHref';

export type CommentsCountProps = Partial<ParserProps> & {
  href?: string;
};

function CommentsCount(props: CommentsCountProps, ref: Ref<HTMLElement>) {
  const {
    className = '',
    href = getCurrentHref(),
    ...rest
  } = props;

  const data = useMemo(() => {
    return {
      'data-href': href,
    };
  }, [href]);

  return (
    <Parser as="span" className={`fb-comments-count ${className}`} data={data} {...rest} ref={ref} />
  );
}

export default memo(forwardRef(CommentsCount));
