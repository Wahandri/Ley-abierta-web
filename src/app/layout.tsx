import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://letabierta.com'),
  title: {
    default: 'Ley Abierta - Leyes españolas en lenguaje claro',
    template: '%s | Ley Abierta',
  },
  description: 'Leyes y documentos públicos españoles explicados en lenguaje claro. Entiende lo que se ha aprobado y a quién afecta.',
  keywords: ['leyes', 'BOE', 'documentos públicos', 'España', 'transparencia', 'legislación'],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://letabierta.com',
    siteName: 'Ley Abierta',
    title: 'Ley Abierta - Leyes españolas en lenguaje claro',
    description: 'Leyes y documentos públicos españoles explicados en lenguaje claro. Entiende lo que se ha aprobado y a quién afecta.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Ley Abierta' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ley Abierta - Leyes españolas en lenguaje claro',
    description: 'Leyes y documentos públicos españoles explicados en lenguaje claro.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: aplica tema antes del primer paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('ley-abierta-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s?s==='dark':p)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <GlobalErrorBoundary>
          <Header />
          <main>{children}</main>
          <Footer />
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
