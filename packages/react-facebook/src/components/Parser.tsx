import React, { useState, memo, forwardRef, ReactNode, useEffect, useCallback, useMemo, type ElementType, type CSSProperties, type Ref } from 'react';
import useFacebook from '../hooks/useFacebook';

export type ParserProps = {
  className: string;
  as?: ElementType;
  children?: ReactNode;
  style?: CSSProperties;
  data?: Record<string, string | undefined>;
};

function Parser(props: ParserProps, forwardedRef: Ref<HTMLElement>) {
  const { as: As = 'div', children, className, style, data } = props;

  const { parse } = useFacebook();
  const [element, setElement] = useState<HTMLElement | null>(null);

  const handleRef = useCallback((element: HTMLElement | null) => {
    setElement(element);

    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = element;
      }
    }
  }, [forwardedRef]);

  const key = useMemo(() => {
    let uniqueKey = `fb-parser-${As}-${className}`;
    if (!data) {
      return uniqueKey;
    }

    for (const key in data) {
      const value = data[key];
      if (value !== undefined) {
        uniqueKey += `-${key}:${data[key] || ''}`;
      }
    }

    return uniqueKey;
  }, [data, children, As, className]);

  useEffect(() => {
    if (element) {
      parse(element);
    }
  }, [element, parse, key]);

  return <As key={key} style={style} ref={handleRef}><As className={className} {...data}>{children}</As></As>;
}

export default memo(forwardRef(Parser));