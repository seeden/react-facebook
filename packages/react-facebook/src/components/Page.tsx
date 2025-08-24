import React, { memo, forwardRef, useMemo, type Ref } from 'react';
import Parser, { type ParserProps } from './Parser';
import getCurrentHref from '../utils/getCurrentHref';

export type PageProps = Partial<ParserProps> & {
  href?: string;
  tabs?: string;
  hideCover?: boolean;
  height?: number | string;
  width?: number | string;
  showFacepile?: boolean;
  hideCTA?: boolean;
  smallHeader?: boolean;
  adaptContainerWidth?: boolean;
  lazy?: boolean;
};

function Page(props: PageProps, ref: Ref<HTMLElement>) {
  const {
    className = '',
    style,
    href = getCurrentHref(),
    tabs,
    hideCover,
    width,
    height,
    showFacepile,
    hideCTA,
    smallHeader,
    adaptContainerWidth,
    lazy,
    ...rest
  } = props;

  const data = useMemo(() => {
    return {
      'data-tabs': tabs,
      'data-hide-cover': hideCover ? 'true' : 'false',
      'data-show-facepile': showFacepile ? 'true' : 'false',
      'data-hide-cta': hideCTA ? 'true' : 'false',
      'data-href': href,
      'data-small-header': smallHeader ? 'true' : 'false',
      'data-adapt-container-width': adaptContainerWidth ? 'true' : 'false',
      'data-height': height?.toString(),
      'data-width': width?.toString(),
      'data-lazy': lazy ? 'true' : 'false',
    };
  }, [href, tabs, hideCover, width, height, showFacepile, hideCTA, smallHeader, adaptContainerWidth, lazy]);

  return (
    <Parser className={`fb-page ${className}`} style={style} data={data} {...rest} ref={ref} />
  );
}

export default memo(forwardRef(Page));
