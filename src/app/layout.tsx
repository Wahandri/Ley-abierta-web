import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'LegalClaridad - Explorador de Documentos',
  description: 'Leyes y documentos públicos españoles explicados en lenguaje claro. Entiende lo que se ha aprobado y a quién afecta.',
  keywords: ['leyes', 'BOE', 'documentos públicos', 'España', 'transparencia', 'legislación'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <Script id="tailwind-cdn" strategy="beforeInteractive">
          {`tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "primary": "#2463eb",
                  "background-light": "#f6f6f8",
                  "background-dark": "#111621",
                  "card-dark": "#1e293b",
                },
                fontFamily: {
                  "display": ["Public Sans", "sans-serif"]
                },
                borderRadius: {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "full": "9999px"
                },
              },
            },
          }`}
        </Script>
        <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
      </head>
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
