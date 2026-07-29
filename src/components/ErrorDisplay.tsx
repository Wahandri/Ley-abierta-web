'use client';

import React from 'react';

interface ErrorDisplayProps {
    error: Error;
    reset: () => void;
}

export default function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--color-text-muted, #6b7280)'
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--color-text, #1f2937)' }}>
                Algo salió mal
            </h2>
            <p style={{ marginBottom: '1.5rem', maxWidth: '400px', color: 'var(--color-text-secondary, #4b5563)' }}>
                {error.message || 'Ha ocurrido un error inesperado'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={reset}
                    style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: 'var(--color-primary, #3b82f6)',
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
                        color: 'var(--color-text-secondary, #4b5563)',
                        border: '1px solid var(--color-border, #e5e7eb)',
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
