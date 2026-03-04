import React from 'react';
import { FacebookProvider, EmbeddedPost, EmbeddedVideo } from 'react-facebook';

export default function EmbeddedPage() {
  return (
    <FacebookProvider appId="671184534658954" debug>
      <div data-testid="embedded-page" style={{ padding: 20 }}>
        <h1>Embedded Component Tests</h1>

        {/* Scenario 1: EmbeddedPost with options */}
        <section style={{ marginBottom: 20 }}>
          <h2>Embedded Post</h2>
          <div data-testid="embedded-post">
            <EmbeddedPost
              href="https://www.facebook.com/20531316728/posts/10154009990506729/"
              width={500}
              showText={true}
            />
          </div>
        </section>

        {/* Scenario 2: EmbeddedVideo with options */}
        <section style={{ marginBottom: 20 }}>
          <h2>Embedded Video</h2>
          <div data-testid="embedded-video">
            <EmbeddedVideo
              href="https://www.facebook.com/facebook/videos/10153231379946729/"
              width={500}
              showText={true}
              showCaptions={true}
            />
          </div>
        </section>

        {/* Scenario 3: Minimal EmbeddedPost */}
        <section style={{ marginBottom: 20 }}>
          <h2>Minimal Post</h2>
          <div data-testid="minimal-post">
            <EmbeddedPost
              href="https://www.facebook.com/20531316728/posts/10154009990506729/"
            />
          </div>
        </section>

        {/* Scenario 4: Multiple embeds together */}
        <section style={{ marginBottom: 20 }}>
          <h2>Multiple Embeds</h2>
          <div data-testid="multi-embed-post">
            <EmbeddedPost
              href="https://www.facebook.com/20531316728/posts/10154009990506729/"
              width={400}
            />
          </div>
          <div data-testid="multi-embed-video">
            <EmbeddedVideo
              href="https://www.facebook.com/facebook/videos/10153231379946729/"
              width={400}
            />
          </div>
        </section>
      </div>
    </FacebookProvider>
  );
}
