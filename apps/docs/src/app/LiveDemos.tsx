'use client';

import {
  FacebookProvider,
  FacebookErrorBoundary,
  EmbeddedVideo,
  EmbeddedPost,
  Share,
  Page,
} from 'react-facebook';

const APP_ID = '671184534658954';

function DemoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-muted-foreground)]">
        {label}
      </p>
      <div className="overflow-hidden rounded-xl border border-[var(--color-fd-border)] bg-[var(--color-fd-card)] p-4">
        <FacebookErrorBoundary
          fallback={
            <p className="text-sm text-[var(--color-fd-muted-foreground)]">
              Facebook widget unavailable. This may be caused by an ad blocker.
            </p>
          }
        >
          {children}
        </FacebookErrorBoundary>
      </div>
    </div>
  );
}

export default function LiveDemos() {
  return (
    <FacebookProvider appId={APP_ID}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <DemoCard label="Embedded Video">
            <EmbeddedVideo
              href="https://www.facebook.com/Meta/videos/1038522214125952"
              width={500}
              showText
              showCaptions
            />
          </DemoCard>
          <DemoCard label="Share Button">
            <Share href="https://github.com/seeden/react-facebook" />
          </DemoCard>
        </div>
        <div className="flex flex-col gap-8">
          <DemoCard label="Embedded Post">
            <EmbeddedPost
              href="https://www.facebook.com/reel/1730774764310324"
              width={500}
              showText
            />
          </DemoCard>
          <DemoCard label="Page Plugin">
            <Page
              href="https://www.facebook.com/meta"
              tabs="timeline"
              width={500}
              height={300}
              smallHeader
            />
          </DemoCard>
        </div>
      </div>
    </FacebookProvider>
  );
}
