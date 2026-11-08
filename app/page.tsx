'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import portfolioMarkup from './portfolio-markup';

declare global {
  interface Window {
    portfolioScriptLoaded?: boolean;
  }
}

export default function Home() {
  useEffect(() => {
    if (window.portfolioScriptLoaded || document.getElementById('portfolio-interactions')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'portfolio-interactions';
    script.src = '/script.js';
    script.async = false;
    window.portfolioScriptLoaded = true;
    script.onerror = () => {
      window.portfolioScriptLoaded = false;
      script.remove();
      console.error('Unable to load portfolio interactions.');
    };
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <script src="/theme-init.js" />
      <div dangerouslySetInnerHTML={{ __html: portfolioMarkup }} />
      <Script id="portfolio-jsonld" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': '#godie-banghal',
              name: 'Godie Banghal',
              jobTitle: 'Web, Mobile, AI and IoT Developer',
              description:
                'Computer science graduate and developer building web apps, mobile apps, AI tools and ESP32 smart-device projects.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Aloran',
                addressRegion: 'Misamis Occidental',
                addressCountry: 'Philippines',
              },
              sameAs: [
                'https://github.com/JayRdev09',
                'https://www.linkedin.com/in/banghal-godie-jr-s-3a9036428',
                'https://www.instagram.com/justfound_404/',
                'https://www.facebook.com/J.R.BANGHAL',
              ],
            },
            {
              '@type': 'WebSite',
              '@id': '#portfolio',
              name: 'Godie Banghal Portfolio',
              description:
                'Portfolio of Godie Banghal, a web, mobile, AI and IoT developer.',
              about: { '@id': '#godie-banghal' },
            },
          ],
        })}
      </Script>
    </>
  );
}
