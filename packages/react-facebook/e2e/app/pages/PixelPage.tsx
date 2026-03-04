import React from 'react';
import { FacebookProvider, usePixel } from 'react-facebook';

function PixelTestComponent() {
  const { track, trackCustom, pageView } = usePixel();

  return (
    <div>
      <button data-testid="track-purchase" onClick={() => track('Purchase', { value: 29.99 })}>
        Track Purchase
      </button>
      <button data-testid="track-custom" onClick={() => trackCustom('CustomEvent', { data: 'test' })}>
        Track Custom
      </button>
      <button data-testid="page-view" onClick={() => pageView()}>
        Track Page View
      </button>
    </div>
  );
}

export default function PixelPage() {
  return (
    <FacebookProvider appId="test-app-id" pixelId="test-pixel-id">
      <div data-testid="pixel-page">
        <PixelTestComponent />
      </div>
    </FacebookProvider>
  );
}
