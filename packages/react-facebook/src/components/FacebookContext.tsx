import { createContext } from 'react';
import Facebook from '../utils/Facebook';

export type FacebookContextInterface = {
  isLoading: boolean;
  error: Error | undefined;
  init: () => Promise<Facebook | undefined>;
  api: Facebook | undefined;
  parse: (element: HTMLDivElement | HTMLSpanElement) => Promise<void>;
  locale: string;
  setLocale: (locale: string) => Promise<void>;
};

export default createContext<FacebookContextInterface | undefined>(undefined);
