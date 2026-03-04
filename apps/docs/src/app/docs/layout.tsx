import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: 'React Facebook',
        url: '/docs',
      }}
      links={[
        {
          text: 'Playground',
          url: '/playground',
          active: 'nested-url',
        },
        {
          text: 'GitHub',
          url: 'https://github.com/seeden/react-facebook',
          active: 'nested-url',
        },
        {
          text: 'NPM',
          url: 'https://www.npmjs.com/package/react-facebook',
          active: 'nested-url',
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
