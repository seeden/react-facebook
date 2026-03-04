import type { ReactNode } from 'react';

export const metadata = {
  title: 'Playground',
  description:
    'Interactive playground for react-facebook components. Try Like, Share, Comments, Login, and more with live prop controls.',
};

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  return children;
}
