import React from 'react';
import { FacebookProvider, Share, ShareButton } from 'react-facebook';

export default function SharePage() {
  return (
    <FacebookProvider appId="671184534658954" debug>
      <div data-testid="share-page" style={{ padding: 20 }}>
        <h1>Share Component Tests</h1>

        {/* Scenario 1: Share widget with layout */}
        <section style={{ marginBottom: 20 }}>
          <h2>Share Widget</h2>
          <div data-testid="share-widget">
            <Share href="https://github.com/seeden/react-facebook" layout="button_count" />
          </div>
        </section>

        {/* Scenario 2: ShareButton with custom text */}
        <section style={{ marginBottom: 20 }}>
          <h2>Share Button</h2>
          <div data-testid="share-button">
            <ShareButton href="https://reactjs.org">Share React</ShareButton>
          </div>
        </section>

        {/* Scenario 3: Multiple share components */}
        <section style={{ marginBottom: 20 }}>
          <h2>Multiple Shares</h2>
          <div data-testid="multi-share-1">
            <Share href="https://github.com/seeden/react-facebook" layout="button" />
          </div>
          <div data-testid="multi-share-button">
            <ShareButton href="https://github.com/seeden/react-facebook">Share GitHub</ShareButton>
          </div>
          <div data-testid="multi-share-2">
            <Share href="https://github.com/seeden/react-facebook" layout="box_count" />
          </div>
        </section>
      </div>
    </FacebookProvider>
  );
}
