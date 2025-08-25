import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'React Facebook - Documentation',
  description: 'Modern React components for Facebook SDK integration',
  keywords: ['react', 'facebook', 'sdk', 'social', 'login', 'share', 'like'],
  authors: [{ name: 'Zlatko Fedor' }],
  openGraph: {
    title: 'React Facebook Documentation',
    description: 'Modern React components for Facebook SDK integration',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <Script id="clr-script">
        {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "t0do1neexj");`}
        </Script>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </body>
    </html>
  )
}