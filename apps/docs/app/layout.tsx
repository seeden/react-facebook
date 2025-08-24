import type { Metadata } from 'next'
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
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </body>
    </html>
  )
}