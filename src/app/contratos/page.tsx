'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contract, getContracts, formatImporte, formatDate } from '@/lib/contracts';

export default function ContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getContracts(page, 20)
            .then(data => {
                setContracts(data.contracts);
                setError(null);
            })
            .catch(() => {
                setError('Error al cargar contratos');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page]);

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
            <h1>Contratos Públicos</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Contratos del sector público español obtenidos de la Plataforma de Contratación del Estado.
            </p>

            {loading && <p>Cargando contratos...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && contracts.length === 0 && (
                <p>No hay contratos disponibles. Vuelve más tarde.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contracts.map(c => (
                    <Link
                        key={c.id}
                        href={`/contratos/${c.id}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '1.25rem',
                            border: '1px solid #e0e0e0',
                            borderRadius: 8,
                            background: '#fff',
                            transition: 'box-shadow 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                            {c.organismo || c.entidad_contratante}
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{c.titulo}</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#444' }}>
                            <span><strong>Importe:</strong> {formatImporte(c.importe)}</span>
                            {c.empresa_ganadora && (
                                <span><strong>Adjudicatario:</strong> {c.empresa_ganadora}</span>
                            )}
                            {c.fecha_publicacion && (
                                <span><strong>Publicado:</strong> {formatDate(c.fecha_publicacion)}</span>
                            )}
                        </div>
                        {c.procedimiento && (
                            <span style={{
                                display: 'inline-block',
                                marginTop: '0.5rem',
                                padding: '0.15rem 0.5rem',
                                fontSize: '0.75rem',
                                background: '#eef2ff',
                                borderRadius: 4,
                                color: '#4f46e5',
                            }}>
                                {c.procedimiento}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        background: page === 1 ? '#f5f5f5' : '#fff',
                        cursor: page === 1 ? 'default' : 'pointer',
                    }}
                >
                    Anterior
                </button>
                <span style={{ padding: '0.5rem' }}>Página {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={contracts.length < 20}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        background: contracts.length < 20 ? '#f5f5f5' : '#fff',
                        cursor: contracts.length < 20 ? 'default' : 'pointer',
                    }}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
