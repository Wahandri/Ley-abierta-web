'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error('[app/error]', error);
    }, [error]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            padding: '2rem',
            textAlign: 'center',
            color: '#6b7280',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>
                Algo salió mal
            </h2>
            <p style={{ marginBottom: '1.5rem', maxWidth: '400px', color: '#4b5563' }}>
                {error.message || 'Ha ocurrido un error inesperado'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={reset}
                    style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    Reintentar
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: 'transparent',
                        color: '#4b5563',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    Ir al inicio
                </button>
            </div>
        </div>
    );
}
