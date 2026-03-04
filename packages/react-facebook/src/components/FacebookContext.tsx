import { createContext } from 'react';
import type { FacebookInstance } from '../utils/Facebook';

export type FacebookContextInterface = {
  loading: boolean;
  error: Error | undefined;
  init: () => Promise<FacebookInstance | undefined>;
  api: FacebookInstance | undefined;
  parse: (element: HTMLDivElement | HTMLSpanElement) => Promise<void>;
  locale: string;
  setLocale: (locale: string) => Promise<void>;
};

export default createContext<FacebookContextInterface | undefined>(undefined);
