import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
