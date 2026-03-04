'use client';

import { useState } from 'react';
import {
  FacebookProvider,
  FacebookErrorBoundary,
  EmbeddedVideo,
  EmbeddedPost,
  Share,
  Page,
} from 'react-facebook';
import type { FacebookLocale } from 'react-facebook';

const APP_ID = '671184534658954';

const LOCALES: { value: FacebookLocale; label: string }[] = [
  { value: 'en_US', label: 'English' },
  { value: 'es_ES', label: 'Spanish' },
  { value: 'fr_FR', label: 'French' },
  { value: 'de_DE', label: 'German' },
  { value: 'pt_BR', label: 'Portuguese' },
  { value: 'ja_JP', label: 'Japanese' },
  { value: 'zh_CN', label: 'Chinese' },
  { value: 'ar_AR', label: 'Arabic' },
];

function Pills<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
            value === opt.value
              ? 'bg-[var(--color-fd-primary)] text-white'
              : 'border border-[var(--color-fd-border)] text-[var(--color-fd-muted-foreground)] hover:border-[var(--color-fd-primary)] hover:text-[var(--color-fd-foreground)]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function DemoCard({
  label,
  controls,
  children,
}: {
  label: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-muted-foreground)]">
          {label}
        </p>
        {controls}
      </div>
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

type VideoPreset = 'full' | 'captions' | 'minimal';
type ShareLayout = 'box_count' | 'button' | 'icon_link';
type PageTab = 'timeline' | 'events' | 'messages';

const VIDEO_OPTIONS: { value: VideoPreset; label: string }[] = [
  { value: 'full', label: 'Text + Captions' },
  { value: 'captions', label: 'Captions' },
  { value: 'minimal', label: 'Video Only' },
];

const SHARE_OPTIONS: { value: ShareLayout; label: string }[] = [
  { value: 'box_count', label: 'Box Count' },
  { value: 'button', label: 'Button' },
  { value: 'icon_link', label: 'Icon Link' },
];

const POST_OPTIONS: { value: string; label: string }[] = [
  { value: 'on', label: 'Show Text' },
  { value: 'off', label: 'Hide Text' },
];

const PAGE_OPTIONS: { value: PageTab; label: string }[] = [
  { value: 'timeline', label: 'Timeline' },
  { value: 'events', label: 'Events' },
  { value: 'messages', label: 'Messages' },
];

export default function LiveDemos() {
  const [locale, setLocale] = useState<FacebookLocale>('en_US');
  const [videoPreset, setVideoPreset] = useState<VideoPreset>('full');
  const [shareLayout, setShareLayout] = useState<ShareLayout>('box_count');
  const [postText, setPostText] = useState('on');
  const [pageTabs, setPageTabs] = useState<PageTab>('timeline');

  return (
    <>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-primary)]">Live</p>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="max-w-md text-2xl font-extrabold tracking-tight text-[var(--color-fd-foreground)] md:text-3xl">
          Real widgets. Real SDK.
        </h2>
        <div className="relative">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as FacebookLocale)}
            className="appearance-none rounded-full border border-[var(--color-fd-border)] bg-[var(--color-fd-background)] py-1.5 pl-4 pr-8 text-[11px] font-medium text-[var(--color-fd-foreground)] outline-none transition-colors focus:border-[var(--color-fd-primary)]"
          >
          {LOCALES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-fd-muted-foreground)]"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 4.5l3 3 3-3" />
          </svg>
        </div>
      </div>
      <p className="mb-10 max-w-lg text-sm leading-relaxed text-[var(--color-fd-muted-foreground)]">
        These are actual Facebook widgets rendered by react-facebook on this page. No screenshots, no mocks.
      </p>

      <FacebookProvider appId={APP_ID} language={locale}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <DemoCard
              label="Embedded Video"
              controls={<Pills value={videoPreset} onChange={setVideoPreset} options={VIDEO_OPTIONS} />}
            >
              <EmbeddedVideo
                href="https://www.facebook.com/Meta/videos/1038522214125952"
                width={500}
                showText={videoPreset === 'full'}
                showCaptions={videoPreset !== 'minimal'}
              />
            </DemoCard>
            <DemoCard
              label="Share Button"
              controls={<Pills value={shareLayout} onChange={setShareLayout} options={SHARE_OPTIONS} />}
            >
              <Share href="https://github.com/seeden/react-facebook" layout={shareLayout} />
            </DemoCard>
            <DemoCard
              label="Page Plugin"
              controls={<Pills value={pageTabs} onChange={setPageTabs} options={PAGE_OPTIONS} />}
            >
              <Page href="https://www.facebook.com/meta" tabs={pageTabs} width={500} height={300} smallHeader />
            </DemoCard>
          </div>
          <div className="flex flex-col gap-8">
            <DemoCard
              label="Embedded Post"
              controls={<Pills value={postText} onChange={setPostText} options={POST_OPTIONS} />}
            >
              <EmbeddedPost
                href="https://www.facebook.com/reel/1730774764310324"
                width={500}
                showText={postText === 'on'}
              />
            </DemoCard>
          </div>
        </div>
      </FacebookProvider>
    </>
  );
}
