import React, { memo, forwardRef, useMemo, type Ref } from 'react';
import Parser, { type ParserProps } from './Parser';

export type EmbeddedVideoProps = Partial<ParserProps> & {
  href: string;
  width?: number | string;
  showText?: boolean;
  allowFullScreen?: boolean;
  autoPlay?: boolean;
  showCaptions?: boolean;
  lazy?: boolean;
};

function EmbeddedVideo(props: EmbeddedVideoProps, ref: Ref<HTMLElement>) {
  const {
    className = '',
    href,
    width,
    showText,
    allowFullScreen,
    autoPlay,
    lazy,
    showCaptions,
    ...rest
  } = props;

  const data = useMemo(() => {
    return {
      'data-href': href,
      'data-width': width?.toString(),
      'data-show-text': showText ? 'true' : 'false',
      'data-show-captions': showCaptions ? 'true' : 'false',
      'data-autoplay': autoPlay ? 'true' : 'false',
      'data-lazy': lazy ? 'true' : 'false',
      'data-allowfullscreen': allowFullScreen ? 'true' : 'false',
    };
  }, [href, width, showText, showCaptions, autoPlay, lazy, allowFullScreen]);

  return (
    <Parser className={`fb-video ${className}`} data={data} {...rest} ref={ref} />
  );
}

export default memo(forwardRef(EmbeddedVideo));
