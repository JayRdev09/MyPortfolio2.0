import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Godie Banghal | Web, Mobile, AI & IoT Developer',
  description:
    'Godie Banghal is a computer science graduate and developer from the Philippines building useful web apps, mobile apps, AI tools, and ESP32 smart-device projects.',
  authors: [{ name: 'Godie Banghal' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    type: 'website',
    title: 'Godie Banghal | Web, Mobile, AI & IoT Developer',
    description:
      'Portfolio of Godie Banghal: web and mobile apps, AI-assisted development, computer vision, and ESP32 smart devices.',
    siteName: 'Godie Banghal',
  },
  twitter: {
    card: 'summary',
    title: 'Godie Banghal | Web, Mobile, AI & IoT Developer',
    description:
      'Web, mobile, AI, computer vision, and smart-device projects by Godie Banghal.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
