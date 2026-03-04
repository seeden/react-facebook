import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';

const pages: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  like: lazy(() => import('./pages/LikePage')),
  share: lazy(() => import('./pages/SharePage')),
  page: lazy(() => import('./pages/PagePage')),
  embedded: lazy(() => import('./pages/EmbeddedPage')),
  login: lazy(() => import('./pages/LoginPage')),
  pixel: lazy(() => import('./pages/PixelPage')),
  locale: lazy(() => import('./pages/LocalePage')),
  site: lazy(() => import('./pages/SitePage')),
  'error-boundary': lazy(() => import('./pages/ErrorBoundaryPage')),
  'graph-api': lazy(() => import('./pages/GraphAPIPage')),
};

function App() {
  const [route, setRoute] = useState(window.location.hash.slice(2) || '');

  useEffect(() => {
    const handler = () => setRoute(window.location.hash.slice(2));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const PageComponent = pages[route];

  if (!PageComponent) {
    return (
      <div data-testid="index">
        <h1>react-facebook E2E Test Harness</h1>
        <nav>
          {Object.keys(pages).map((key) => (
            <div key={key}>
              <a href={`#/${key}`}>{key}</a>
            </div>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <Suspense fallback={<div data-testid="loading">Loading...</div>}>
      <PageComponent />
    </Suspense>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
