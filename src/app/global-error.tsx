'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error('[global-error]', error);
    }, [error]);

    return (
        <html lang="es">
            <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb'
                }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Algo salió mal
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                        {error.message || 'Error inesperado'}
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Reintentar
                    </button>
                </div>
            </body>
        </html>
    );
}
