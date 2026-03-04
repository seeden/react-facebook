import Link from 'next/link';
import { highlight } from 'sugar-high';
import LiveDemos from './LiveDemos';
import Testimonials from './Testimonials';

export const metadata = {
  title: 'React Facebook - The Facebook SDK for React',
  description:
    'Login, Pixel tracking, Share, Like, Comments, Graph API, and more. TypeScript-first, SSR-safe, works with Next.js.',
};

const shTheme: Record<string, string> = {
  '--sh-class': '#79c0ff',
  '--sh-identifier': '#c9d1d9',
  '--sh-sign': '#8b949e',
  '--sh-property': '#d2a8ff',
  '--sh-entity': '#7ee787',
  '--sh-jsxliterals': '#a5d6ff',
  '--sh-string': '#a5d6ff',
  '--sh-keyword': '#ff7b72',
  '--sh-comment': '#8b949e',
};

function Code({ code, label }: { code: string; label?: string }) {
  const html = highlight(code.trim());
  return (
    <div>
      {label && (
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-muted-foreground)]">
          {label}
        </p>
      )}
      <div
        className="overflow-x-auto rounded-xl border border-[color-mix(in_oklab,var(--color-fd-border),transparent_50%)] bg-[#0d1117] p-5 text-[13px] leading-7"
        style={shTheme as React.CSSProperties}
      >
        <pre>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </div>
  );
}

const LOGIN_EXAMPLE = `
import { useLogin } from 'react-facebook';

function LoginButton() {
  const { login, loading, error } = useLogin();

  async function handleLogin() {
    const res = await login({
      scope: 'public_profile,email',
    });
    console.log(res);
  }

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Logging in...' : 'Login with Facebook'}
    </button>
  );
}`;

const PIXEL_EXAMPLE = `
import { usePixel } from 'react-facebook';

function Checkout() {
  const { track, grantConsent } = usePixel();

  return (
    <>
      <button onClick={() => grantConsent()}>
        Accept Cookies
      </button>
      <button onClick={() => track('Purchase', {
        value: 49.99, currency: 'USD',
      })}>
        Complete Order
      </button>
    </>
  );
}`;

const SHARE_EXAMPLE = `
import { useShare } from 'react-facebook';

function ShareButton() {
  const { share } = useShare();

  async function handleShare() {
    await share({
      href: 'https://your-site.com',
      hashtag: '#reactfacebook',
    });
  }

  return (
    <button onClick={handleShare}>
      Share this page
    </button>
  );
}`;

const GRAPHAPI_EXAMPLE = `
import { useGraphAPI } from 'react-facebook';

function UserProfile() {
  const { data, loading, error } = useGraphAPI({
    path: '/me',
    params: { fields: 'name,email,picture' },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return <p>Welcome, {data?.name}</p>;
}`;

const NEXTJS_EXAMPLE = `
// app/layout.tsx
import { FacebookProvider } from 'react-facebook';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FacebookProvider appId="YOUR_APP_ID" language="en_US">
          {children}
        </FacebookProvider>
      </body>
    </html>
  );
}

// app/page.tsx
import {
  Login, Like, Share, Comments,
  EmbeddedPost, EmbeddedVideo, Page,
} from 'react-facebook';

export default function Home() {
  return (
    <>
      <Login scope="public_profile,email" onSuccess={console.log}>
        Login with Facebook
      </Login>
      <Like href="https://your-site.com" />
      <Share href="https://your-site.com" />
      <Comments href="https://your-site.com/post" />
      <EmbeddedPost href="https://facebook.com/Meta/posts/123" width={500} />
      <EmbeddedVideo href="https://facebook.com/Meta/videos/123" width={500} />
      <Page href="https://facebook.com/meta" tabs="timeline" />
    </>
  );
}`;

const FEATURES: { name: string; hook?: string; component?: string }[] = [
  { name: 'Login', hook: 'useLogin', component: '<Login />' },
  { name: 'Pixel', hook: 'usePixel' },
  { name: 'Graph API', hook: 'useGraphAPI' },
  { name: 'Share', hook: 'useShare', component: '<Share />' },
  { name: 'Like', component: '<Like />' },
  { name: 'Comments', component: '<Comments />' },
  { name: 'Embedded Posts', component: '<EmbeddedPost />' },
  { name: 'Embedded Videos', component: '<EmbeddedVideo />' },
  { name: 'Error Boundary', component: '<FacebookErrorBoundary />' },
];

export default function HomePage() {
  return (
    <>
      {/* Ambient dot grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Hero gradient glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(24,119,242,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 right-0 -z-10 hidden h-[400px] w-[400px] md:block"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(69,153,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-6">
        <Link href="/" className="shrink-0 text-sm font-semibold text-[var(--color-fd-foreground)]">
          react-facebook
        </Link>
        <div className="flex items-center gap-6 text-[13px] text-[var(--color-fd-muted-foreground)]">
          <Link href="/docs" className="transition-colors hover:text-[var(--color-fd-foreground)]">
            Docs
          </Link>
          <Link href="/playground" className="transition-colors hover:text-[var(--color-fd-foreground)]">
            Playground
          </Link>
          <a
            href="https://github.com/seeden/react-facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--color-fd-foreground)]"
          >
            GitHub
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-[var(--color-fd-primary)]">
            Open Source
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[var(--color-fd-foreground)] md:text-[64px]">
            The Facebook SDK{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #1877f2, #4599ff, #a5d6ff)',
              }}
            >
              for React
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-fd-muted-foreground)] md:text-[17px]">
            Login, Pixel, Share, Like, Comments, Graph API. One package. Fully typed. SSR-safe. Works with Next.js out
            of the box.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/docs"
              className="rounded-full bg-[var(--color-fd-primary)] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(24,119,242,0.4)] transition-all hover:shadow-[0_0_32px_-4px_rgba(24,119,242,0.6)]"
            >
              Get Started
            </Link>
            <Link
              href="/playground"
              className="rounded-full border border-[var(--color-fd-border)] px-7 py-2.5 text-sm font-semibold text-[var(--color-fd-foreground)] transition-colors hover:bg-[var(--color-fd-card)]"
            >
              Playground
            </Link>
            <code className="hidden rounded-full border border-[var(--color-fd-border)] px-5 py-2.5 text-[13px] text-[var(--color-fd-muted-foreground)] sm:inline-block">
              <span className="select-none opacity-40">$ </span>npm install react-facebook
            </code>
          </div>

          {/* Feature pills */}
          <div className="mt-14 flex flex-wrap gap-2">
            {FEATURES.map(({ name, hook, component }) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-fd-border)] bg-[var(--color-fd-card)] px-3.5 py-1.5 text-[12px] transition-colors hover:border-[var(--color-fd-primary)]"
              >
                <span className="font-semibold text-[var(--color-fd-foreground)]">{name}</span>
                {hook && <code className="text-[var(--color-fd-primary)]">{hook}</code>}
                {hook && component && <span className="text-[var(--color-fd-muted-foreground)] opacity-40">+</span>}
                {component && <code className="text-[var(--color-fd-muted-foreground)]">{component}</code>}
              </span>
            ))}
          </div>
        </section>

        {/* Code examples */}
        <div className="h-px bg-[var(--color-fd-border)] opacity-50" />

        <section className="py-20 md:py-24">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-primary)]">The API</p>
          <h2 className="mb-10 max-w-md text-2xl font-extrabold tracking-tight text-[var(--color-fd-foreground)] md:text-3xl">
            Four hooks. Four patterns.
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Code code={LOGIN_EXAMPLE} label="Login" />
            <Code code={PIXEL_EXAMPLE} label="Pixel Tracking" />
            <Code code={SHARE_EXAMPLE} label="Share" />
            <Code code={GRAPHAPI_EXAMPLE} label="Graph API" />
          </div>
        </section>

        {/* Live demos */}
        <div className="h-px bg-[var(--color-fd-border)] opacity-50" />

        <section className="py-20 md:py-24">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-primary)]">Live</p>
          <h2 className="mb-4 max-w-md text-2xl font-extrabold tracking-tight text-[var(--color-fd-foreground)] md:text-3xl">
            Real widgets. Real SDK.
          </h2>
          <p className="mb-10 max-w-lg text-sm leading-relaxed text-[var(--color-fd-muted-foreground)]">
            These are actual Facebook widgets rendered by react-facebook on this page. No screenshots, no mocks.
          </p>
          <LiveDemos />
        </section>

        {/* Next.js integration */}
        <div className="h-px bg-[var(--color-fd-border)] opacity-50" />

        <section className="py-20 md:py-24">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-primary)]">Next.js</p>
          <h2 className="mb-4 max-w-md text-2xl font-extrabold tracking-tight text-[var(--color-fd-foreground)] md:text-3xl">
            Works with App Router
          </h2>
          <p className="mb-10 max-w-lg text-sm leading-relaxed text-[var(--color-fd-muted-foreground)]">
            Wrap your layout with FacebookProvider. Use components and hooks anywhere. SSR-safe with built-in &apos;use
            client&apos; directives.
          </p>
          <div className="max-w-3xl">
            <Code code={NEXTJS_EXAMPLE} />
          </div>
        </section>

        {/* Testimonials */}
        <div className="h-px bg-[var(--color-fd-border)] opacity-50" />

        <section className="py-20 md:py-24">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-primary)]">
            Community
          </p>
          <h2 className="mb-4 max-w-md text-2xl font-extrabold tracking-tight text-[var(--color-fd-foreground)] md:text-3xl">
            Built with react-facebook
          </h2>
          <p className="mb-10 max-w-lg text-sm leading-relaxed text-[var(--color-fd-muted-foreground)]">
            Companies and developers shipping with react-facebook in production. Get your logo and a dofollow backlink
            on this page.
          </p>

          {/* Trusted by */}
          <div className="mb-12 flex flex-wrap items-center gap-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-fd-muted-foreground)]">
              Trusted by
            </p>
            <a
              href="https://www.quizana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold tracking-tight text-[var(--color-fd-foreground)] opacity-70 transition-opacity hover:opacity-100"
            >
              Quizana
            </a>
            <a
              href="https://www.rosabrillo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold tracking-tight text-[var(--color-fd-foreground)] opacity-70 transition-opacity hover:opacity-100"
            >
              Rosabrillo
            </a>
          </div>

          <Testimonials />
        </section>

        {/* Bottom */}
        <div className="h-px bg-[var(--color-fd-border)] opacity-50" />

        <section className="flex flex-col items-start gap-4 py-16 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--color-fd-muted-foreground)]">
            <span>MIT License</span>
            <span className="hidden md:inline opacity-40">·</span>
            <span>TypeScript</span>
            <span className="hidden md:inline opacity-40">·</span>
            <span>&lt;15 KB gzipped</span>
          </div>
          <div className="flex gap-5 text-[13px] font-medium">
            <Link href="/docs" className="text-[var(--color-fd-primary)] hover:underline">
              Docs
            </Link>
            <a
              href="https://github.com/seeden/react-facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-fd-primary)] hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/react-facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-fd-primary)] hover:underline"
            >
              npm
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
