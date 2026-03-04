import React from 'react';
import { FacebookProvider, Page } from 'react-facebook';

export default function PagePage() {
  return (
    <FacebookProvider appId="671184534658954" debug>
      <div data-testid="page-page" style={{ padding: 20 }}>
        <h1>Page Component Tests</h1>

        {/* Scenario 1: Page with tabs and facepile */}
        <section style={{ marginBottom: 20 }}>
          <h2>Facebook Page</h2>
          <div data-testid="facebook-page">
            <Page
              href="https://www.facebook.com/meta"
              tabs="timeline"
              showFacepile={true}
            />
          </div>
        </section>

        {/* Scenario 2: Page with multiple tabs and dimensions */}
        <section style={{ marginBottom: 20 }}>
          <h2>Page with Tabs</h2>
          <div data-testid="page-with-tabs">
            <Page
              href="https://www.facebook.com/meta"
              tabs="timeline,events,messages"
              width={400}
              height={300}
            />
          </div>
        </section>

        {/* Scenario 3: Minimal page */}
        <section style={{ marginBottom: 20 }}>
          <h2>Minimal Page</h2>
          <div data-testid="minimal-page">
            <Page href="https://www.facebook.com/facebook" />
          </div>
        </section>

        {/* Scenario 4: Compact page with options */}
        <section style={{ marginBottom: 20 }}>
          <h2>Compact Page</h2>
          <div data-testid="compact-page">
            <Page
              href="https://www.facebook.com/meta"
              smallHeader={true}
              adaptContainerWidth={true}
              hideCTA={true}
            />
          </div>
        </section>
      </div>
    </FacebookProvider>
  );
}
