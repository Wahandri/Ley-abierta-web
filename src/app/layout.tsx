import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Ley Abierta / El Vigilante',
  description: 'Leyes y documentos públicos españoles explicados en lenguaje claro. Entiende lo que se ha aprobado y a quién afecta.',
  keywords: ['leyes', 'BOE', 'documentos públicos', 'España', 'transparencia', 'legislación'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
