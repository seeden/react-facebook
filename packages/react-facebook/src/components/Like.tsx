import React, { memo, forwardRef, useMemo, type Ref } from 'react';
import Parser, { type ParserProps } from './Parser';
import getCurrentHref from '../utils/getCurrentHref';

export type LikeProps = Partial<ParserProps> & {
  referral?: string;
  href?: string;
  layout?: 'standard' | 'button_count' | 'button' | 'box_count';
  showFaces?: boolean;
  colorScheme?: string;
  action?: string;
  share?: boolean;
  width?: number | string;
  size?: string;
  kidDirectedSite?: boolean;
  lazy?: boolean;
};

function Like(props: LikeProps, ref: Ref<HTMLElement>) {
  const {
    className = '',
    href = getCurrentHref(),
    layout,
    colorScheme,
    action,
    showFaces,
    share,
    width,
    size,
    kidDirectedSite,
    referral,
    lazy,
    ...rest
  } = props;

  const data = useMemo(() => {
    return {
      'data-ref': referral,
      'data-href': href,
      'data-layout': layout,
      'data-colorscheme': colorScheme,
      'data-action': action,
      'data-show-faces': showFaces ? 'true' : 'false',
      'data-share': share ? 'true' : 'false',
      'data-width': width?.toString(),
      'data-size': size,
      'data-lazy': lazy ? 'true' : 'false',
      'data-kid-directed-site': kidDirectedSite ? 'true' : 'false',
    };
  }, [referral, href, layout, colorScheme, action, showFaces, share, width, size, kidDirectedSite, lazy]);

  return (
    <Parser className={`fb-like ${className}`} data={data} {...rest} ref={ref} />
  );
}

export default memo(forwardRef(Like));
