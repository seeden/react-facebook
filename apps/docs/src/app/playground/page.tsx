'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FacebookProvider,
  FacebookErrorBoundary,
  Like,
  Share,
  Comments,
  Page,
  EmbeddedPost,
  EmbeddedVideo,
  ShareButton,
  Login,
} from 'react-facebook';
import type { FacebookLocale } from 'react-facebook';

const APP_ID = '671184534658954';
const DEFAULT_HREF = 'https://www.facebook.com/meta';
const DEFAULT_POST = 'https://www.facebook.com/reel/1730774764310324';
const DEFAULT_VIDEO = 'https://www.facebook.com/Meta/videos/1038522214125952';

const LOCALES: { value: FacebookLocale; label: string }[] = [
  { value: 'en_US', label: 'English' },
  { value: 'es_ES', label: 'Spanish' },
  { value: 'fr_FR', label: 'French' },
  { value: 'de_DE', label: 'German' },
  { value: 'it_IT', label: 'Italian' },
  { value: 'pt_BR', label: 'Portuguese (BR)' },
  { value: 'ja_JP', label: 'Japanese' },
  { value: 'ko_KR', label: 'Korean' },
  { value: 'zh_CN', label: 'Chinese (Simplified)' },
  { value: 'zh_TW', label: 'Chinese (Traditional)' },
  { value: 'ar_AR', label: 'Arabic' },
  { value: 'hi_IN', label: 'Hindi' },
  { value: 'ru_RU', label: 'Russian' },
  { value: 'tr_TR', label: 'Turkish' },
  { value: 'pl_PL', label: 'Polish' },
  { value: 'nl_NL', label: 'Dutch' },
  { value: 'sv_SE', label: 'Swedish' },
  { value: 'uk_UA', label: 'Ukrainian' },
  { value: 'he_IL', label: 'Hebrew' },
  { value: 'th_TH', label: 'Thai' },
];

type SelectProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
  testId?: string;
};

function Select<T extends string>({ label, value, onChange, options, testId }: SelectProps<T>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--color-fd-muted-foreground)]">{label}</label>
      <select
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none rounded-lg border border-[var(--color-fd-border)] bg-[var(--color-fd-background)] px-3 py-2 text-sm text-[var(--color-fd-foreground)] outline-none transition-colors focus:border-[var(--color-fd-primary)]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  testId,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  testId?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--color-fd-foreground)]">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${checked ? 'border-[var(--color-fd-primary)] bg-[var(--color-fd-primary)]' : 'border-[var(--color-fd-border)] bg-[var(--color-fd-background)]'}`}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6l2.5 2.5 4.5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        data-testid={testId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="font-mono text-[13px]">{label}</span>
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  testId,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  testId?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--color-fd-muted-foreground)]">{label}</label>
      <input
        data-testid={testId}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full rounded-lg border border-[var(--color-fd-border)] bg-[var(--color-fd-background)] px-3 py-2 text-sm text-[var(--color-fd-foreground)] outline-none transition-colors focus:border-[var(--color-fd-primary)]"
      />
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  testId?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--color-fd-muted-foreground)]">{label}</label>
      <input
        data-testid={testId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--color-fd-border)] bg-[var(--color-fd-background)] px-3 py-2 text-sm text-[var(--color-fd-foreground)] outline-none transition-colors placeholder:text-[var(--color-fd-muted-foreground)] placeholder:opacity-40 focus:border-[var(--color-fd-primary)]"
      />
    </div>
  );
}

function DemoSection({
  title,
  description,
  controls,
  children,
  banner,
  testId,
  id,
}: {
  title: string;
  description: string;
  controls: React.ReactNode;
  children: React.ReactNode;
  banner?: React.ReactNode;
  testId?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      data-testid={testId}
      className="scroll-mt-20 rounded-xl border border-[var(--color-fd-border)] bg-[var(--color-fd-card)] p-6"
    >
      <h2 className="mb-1 text-xl font-semibold text-[var(--color-fd-foreground)]">{title}</h2>
      <p className="mb-4 text-sm text-[var(--color-fd-muted-foreground)]">{description}</p>
      {banner}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex min-h-[120px] items-start rounded-lg bg-[var(--color-fd-background)] p-4">{children}</div>
        <div className="flex flex-col gap-3">{controls}</div>
      </div>
    </section>
  );
}

const LIKE_LAYOUTS = ['standard', 'button_count', 'button', 'box_count'] as const;
const SHARE_LAYOUTS = ['icon_link', 'button_count', 'button', 'box_count'] as const;
const SIZES = ['small', 'large'] as const;
const ACTIONS = ['like', 'recommend'] as const;
const ORDER_BY = ['reverse_time', 'time'] as const;
const COLOR_SCHEMES = ['light', 'dark'] as const;

export default function PlaygroundPage() {
  // Global
  const [locale, setLocale] = useState<FacebookLocale>('en_US');

  // Like
  const [likeLayout, setLikeLayout] = useState<(typeof LIKE_LAYOUTS)[number]>('standard');
  const [likeSize, setLikeSize] = useState<(typeof SIZES)[number]>('small');
  const [likeAction, setLikeAction] = useState<(typeof ACTIONS)[number]>('like');
  const [likeShare, setLikeShare] = useState(true);
  const [likeShowFaces, setLikeShowFaces] = useState(true);

  // Share
  const [shareLayout, setShareLayout] = useState<(typeof SHARE_LAYOUTS)[number]>('button_count');
  const [shareSize, setShareSize] = useState<(typeof SIZES)[number]>('small');

  // Comments
  const [commentsNumPosts, setCommentsNumPosts] = useState(5);
  const [commentsOrderBy, setCommentsOrderBy] = useState<(typeof ORDER_BY)[number]>('reverse_time');
  const [commentsColorScheme, setCommentsColorScheme] = useState<(typeof COLOR_SCHEMES)[number]>('light');

  // Page
  const [pageTabs, setPageTabs] = useState('timeline');
  const [pageHideCover, setPageHideCover] = useState(false);
  const [pageSmallHeader, setPageSmallHeader] = useState(false);
  const [pageShowFacepile, setPageShowFacepile] = useState(true);

  // EmbeddedPost
  const [postShowText, setPostShowText] = useState(true);
  const [postWidth, setPostWidth] = useState(500);

  // EmbeddedVideo
  const [videoShowText, setVideoShowText] = useState(true);
  const [videoAutoPlay, setVideoAutoPlay] = useState(false);
  const [videoShowCaptions, setVideoShowCaptions] = useState(true);
  const [videoAllowFullScreen, setVideoAllowFullScreen] = useState(true);

  // Login
  const [loginDisabled, setLoginDisabled] = useState(false);

  return (
    <div data-testid="playground-page" className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-fd-foreground)]">Playground</h1>
        <Link href="/docs" className="text-sm text-[var(--color-fd-primary)] hover:underline">
          Back to docs
        </Link>
      </div>

      <div className="mb-8 rounded-xl border border-[var(--color-fd-border)] bg-[var(--color-fd-card)] p-4">
        <label className="mb-1 block text-sm font-medium text-[var(--color-fd-foreground)]">Language</label>
        <select
          data-testid="locale-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value as FacebookLocale)}
          className="w-full max-w-xs appearance-none rounded-lg border border-[var(--color-fd-border)] bg-[var(--color-fd-background)] px-3 py-2 text-sm text-[var(--color-fd-foreground)] outline-none transition-colors focus:border-[var(--color-fd-primary)]"
        >
          {LOCALES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label} ({l.value})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-[var(--color-fd-muted-foreground)]">
          Changing locale reloads the Facebook SDK. All components below will re-render in the selected language.
        </p>
      </div>

      <FacebookErrorBoundary
        fallback={(error, reset) => (
          <div
            data-testid="error-fallback"
            className="rounded-xl border border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950"
          >
            <p className="text-sm font-medium text-red-700 dark:text-red-300">Facebook SDK failed to load</p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>
            <button
              onClick={reset}
              className="mt-3 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        )}
      >
        <FacebookProvider appId={APP_ID} language={locale}>
          <div className="space-y-8">
            {/* Login */}
            <DemoSection
              id="login"
              testId="demo-login"
              title="Login"
              description="Facebook Login button with OAuth support."
              banner={
                <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <strong>EU/EEA users:</strong> Some social plugins (Like, Comments) require you to be logged into
                  Facebook and have consented to &quot;App and Website Cookies&quot; in your Facebook settings. Log in
                  here first to see all components below.{' '}
                  <Link href="/docs/advanced/security#eueea-limitations-for-social-plugins" className="underline">
                    Learn more
                  </Link>
                </div>
              }
              controls={
                <Toggle testId="login-disabled" label="disabled" checked={loginDisabled} onChange={setLoginDisabled} />
              }
            >
              <Login
                scope="public_profile,email"
                onSuccess={(response) => console.log('Login success:', response)}
                onError={(error) => console.log('Login error:', error)}
                disabled={loginDisabled}
                className="rounded-lg bg-[#1877f2] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(24,119,242,0.4)] transition-all hover:bg-[#166fe5] hover:shadow-[0_0_32px_-4px_rgba(24,119,242,0.6)] disabled:opacity-50"
              >
                Login with Facebook
              </Login>
            </DemoSection>

            {/* Like */}
            <DemoSection
              id="like"
              testId="demo-like"
              title="Like"
              description="Facebook Like button with configurable layout, size, and action."
              banner={
                <div className="mb-4 rounded-lg border border-[var(--color-fd-border)] bg-[var(--color-fd-background)] p-3 text-xs text-[var(--color-fd-muted-foreground)]">
                  Not visible? In the EU/EEA, the Like button requires being logged into Facebook with cookie consent
                  enabled.
                </div>
              }
              controls={
                <>
                  <Select
                    testId="like-layout"
                    label="layout"
                    value={likeLayout}
                    onChange={setLikeLayout}
                    options={LIKE_LAYOUTS}
                  />
                  <Select testId="like-size" label="size" value={likeSize} onChange={setLikeSize} options={SIZES} />
                  <Select
                    testId="like-action"
                    label="action"
                    value={likeAction}
                    onChange={setLikeAction}
                    options={ACTIONS}
                  />
                  <Toggle testId="like-share" label="share" checked={likeShare} onChange={setLikeShare} />
                  <Toggle
                    testId="like-show-faces"
                    label="showFaces"
                    checked={likeShowFaces}
                    onChange={setLikeShowFaces}
                  />
                </>
              }
            >
              <Like
                href={DEFAULT_HREF}
                layout={likeLayout}
                size={likeSize}
                action={likeAction}
                share={likeShare}
                showFaces={likeShowFaces}
              />
            </DemoSection>

            {/* Share */}
            <DemoSection
              id="share"
              testId="demo-share"
              title="Share"
              description="Facebook Share button for sharing URLs."
              controls={
                <>
                  <Select
                    testId="share-layout"
                    label="layout"
                    value={shareLayout}
                    onChange={setShareLayout}
                    options={SHARE_LAYOUTS}
                  />
                  <Select testId="share-size" label="size" value={shareSize} onChange={setShareSize} options={SIZES} />
                </>
              }
            >
              <Share href="https://github.com/seeden/react-facebook" layout={shareLayout} size={shareSize} />
            </DemoSection>

            {/* Comments */}
            <DemoSection
              id="comments"
              testId="demo-comments"
              title="Comments"
              description="Facebook Comments plugin with color scheme and ordering options."
              banner={
                <div className="mb-4 rounded-lg border border-[var(--color-fd-border)] bg-[var(--color-fd-background)] p-3 text-xs text-[var(--color-fd-muted-foreground)]">
                  Not visible? In the EU/EEA, the Comments plugin requires being logged into Facebook with cookie
                  consent enabled.
                </div>
              }
              controls={
                <>
                  <NumberInput
                    testId="comments-num-posts"
                    label="numPosts"
                    value={commentsNumPosts}
                    onChange={setCommentsNumPosts}
                    min={1}
                    max={10}
                  />
                  <Select
                    testId="comments-order-by"
                    label="orderBy"
                    value={commentsOrderBy}
                    onChange={setCommentsOrderBy}
                    options={ORDER_BY}
                  />
                  <Select
                    testId="comments-color-scheme"
                    label="colorScheme"
                    value={commentsColorScheme}
                    onChange={setCommentsColorScheme}
                    options={COLOR_SCHEMES}
                  />
                </>
              }
            >
              <Comments
                href={DEFAULT_HREF}
                numPosts={commentsNumPosts}
                orderBy={commentsOrderBy}
                colorScheme={commentsColorScheme}
                width="100%"
              />
            </DemoSection>

            {/* Page */}
            <DemoSection
              id="page"
              testId="demo-page"
              title="Page"
              description="Facebook Page plugin showing a page's timeline, events, or messages."
              controls={
                <>
                  <TextInput
                    testId="page-tabs"
                    label="tabs"
                    value={pageTabs}
                    onChange={setPageTabs}
                    placeholder="timeline,events,messages"
                  />
                  <Toggle
                    testId="page-hide-cover"
                    label="hideCover"
                    checked={pageHideCover}
                    onChange={setPageHideCover}
                  />
                  <Toggle
                    testId="page-small-header"
                    label="smallHeader"
                    checked={pageSmallHeader}
                    onChange={setPageSmallHeader}
                  />
                  <Toggle
                    testId="page-show-facepile"
                    label="showFacepile"
                    checked={pageShowFacepile}
                    onChange={setPageShowFacepile}
                  />
                </>
              }
            >
              <Page
                href={DEFAULT_HREF}
                tabs={pageTabs}
                hideCover={pageHideCover}
                smallHeader={pageSmallHeader}
                showFacepile={pageShowFacepile}
                width={500}
                height={300}
              />
            </DemoSection>

            {/* EmbeddedPost */}
            <DemoSection
              id="embeddedpost"
              testId="demo-embedded-post"
              title="EmbeddedPost"
              description="Embed a public Facebook post."
              controls={
                <>
                  <Toggle testId="post-show-text" label="showText" checked={postShowText} onChange={setPostShowText} />
                  <NumberInput
                    testId="post-width"
                    label="width"
                    value={postWidth}
                    onChange={setPostWidth}
                    min={350}
                    max={750}
                  />
                </>
              }
            >
              <EmbeddedPost href={DEFAULT_POST} showText={postShowText} width={postWidth} />
            </DemoSection>

            {/* EmbeddedVideo */}
            <DemoSection
              id="embeddedvideo"
              testId="demo-embedded-video"
              title="EmbeddedVideo"
              description="Embed a public Facebook video with playback controls."
              controls={
                <>
                  <Toggle
                    testId="video-show-text"
                    label="showText"
                    checked={videoShowText}
                    onChange={setVideoShowText}
                  />
                  <Toggle
                    testId="video-auto-play"
                    label="autoPlay"
                    checked={videoAutoPlay}
                    onChange={setVideoAutoPlay}
                  />
                  <Toggle
                    testId="video-show-captions"
                    label="showCaptions"
                    checked={videoShowCaptions}
                    onChange={setVideoShowCaptions}
                  />
                  <Toggle
                    testId="video-allow-fullscreen"
                    label="allowFullScreen"
                    checked={videoAllowFullScreen}
                    onChange={setVideoAllowFullScreen}
                  />
                </>
              }
            >
              <EmbeddedVideo
                href={DEFAULT_VIDEO}
                showText={videoShowText}
                autoPlay={videoAutoPlay}
                showCaptions={videoShowCaptions}
                allowFullScreen={videoAllowFullScreen}
                width={500}
              />
            </DemoSection>

            {/* ShareButton */}
            <DemoSection
              id="sharebutton"
              testId="demo-share-button"
              title="ShareButton"
              description="Programmatic share button that triggers the Facebook Share dialog."
              controls={
                <p className="text-xs text-[var(--color-fd-muted-foreground)]">
                  Click the button to open the Facebook Share dialog.
                </p>
              }
            >
              <ShareButton
                href="https://github.com/seeden/react-facebook"
                display="popup"
                className="rounded-md bg-[var(--color-fd-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Share on Facebook
              </ShareButton>
            </DemoSection>
          </div>
        </FacebookProvider>
      </FacebookErrorBoundary>
    </div>
  );
}
