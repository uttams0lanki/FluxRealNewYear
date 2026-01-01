import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://peak.fluxreal.com'),
  title: 'Flux Real 2026 | Project Peak',
  description: 'The view from the top is only possible when vision meets precision. Join us in 2026.',
  keywords: ['Flux Real', '2026', 'New Year', 'Real Estate', 'Technology', 'Visualization'],
  authors: [{ name: 'Flux Real' }],
  openGraph: {
    title: 'Flux Real 2026 | Project Peak',
    description: 'The view from the top is only possible when vision meets precision.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Flux Real',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Flux Real 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flux Real 2026 | Project Peak',
    description: 'The view from the top is only possible when vision meets precision.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
        `}</style>
      </head>
      <body className="antialiased bg-[#050505] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
