import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { StudioFooter } from '@/components/studio/StudioFooter';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const TITLE = 'Post Studio — Beautiful LinkedIn graphics in 60 seconds';
const DESCRIPTION =
  'Pick a template, edit the text, export a 1200×1200 PNG. Built for AI, ML, and coding creators. Optional AI for thumbnails and captions.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s · Post Studio',
  },
  description: DESCRIPTION,
  applicationName: 'Post Studio',
  category: 'productivity',
  keywords: [
    'LinkedIn graphics generator',
    'LinkedIn post studio',
    'LinkedIn carousel maker',
    'AI thumbnail generator',
    'developer LinkedIn content',
    'ML content creator tools',
    'LinkedIn caption generator',
    'social media image generator',
    'PNG export',
    'Canva alternative for developers',
  ],
  authors: [
    { name: 'Saddam Arbaa', url: 'https://github.com/saddamarbaa' },
  ],
  creator: 'Saddam Arbaa',
  publisher: 'Saddam Arbaa',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Post Studio',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@saddamarbaa',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Post Studio',
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requires JavaScript. Requires a modern browser.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Saddam Arbaa',
    url: 'https://github.com/saddamarbaa',
  },
  featureList: [
    '14 LinkedIn graphic templates',
    '6 visual themes',
    '1200×1200 PNG export',
    'AI thumbnail generation (Claude)',
    'AI caption generation',
    'Carousel slide builder',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA),
          }}
        />
        {children}
        <StudioFooter />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
