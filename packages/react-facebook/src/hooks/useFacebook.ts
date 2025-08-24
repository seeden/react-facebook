import { useContext, useEffect } from 'react';
import FacebookContext from '../components/FacebookContext';
import type { FacebookContextInterface } from '../components/FacebookContext';

export type UseFacebookProps = {
  lazy?: boolean;
};

export default function useFacebook(props: UseFacebookProps = {}): FacebookContextInterface {
  const { lazy = false } = props;

  const context: FacebookContextInterface | undefined = useContext(FacebookContext);
  if (!context) {
    throw new Error('useFacebook must be used within a FacebookProvider');
  }

  useEffect(() => {
    if (!lazy) {
      context.init();
    }
  }, [lazy, context.init]);

  return context;
}
