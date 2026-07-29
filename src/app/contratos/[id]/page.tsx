import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getContractById, formatImporte, formatDate } from '@/lib/contracts';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const data = await getContractById(Number(id));
    if (!data) return { title: 'Contrato no encontrado' };
    return {
        title: data.contract.titulo,
        description: data.analysis?.summary_plain_es?.slice(0, 160) || data.contract.titulo,
    };
}

export default async function ContractDetailPage({ params }: Props) {
    const { id } = await params;
    const data = await getContractById(Number(id));
    if (!data) notFound();

    const { contract, analysis, documents } = data;

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
            <Link href="/contratos" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '0.9rem' }}>
                ← Volver a contratos
            </Link>

            <h1 style={{ marginTop: '1rem' }}>{contract.titulo}</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                margin: '2rem 0',
                padding: '1.5rem',
                background: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
            }}>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Importe
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111' }}>
                        {formatImporte(contract.importe)}
                    </div>
                </div>

                {contract.empresa_ganadora && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Adjudicatario
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{contract.empresa_ganadora}</div>
                    </div>
                )}

                {contract.organismo && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Organismo
                        </div>
                        <div style={{ fontSize: '1rem' }}>{contract.organismo}</div>
                    </div>
                )}

                {contract.fecha_adjudicacion && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Fecha Adjudicación
                        </div>
                        <div style={{ fontSize: '1rem' }}>{formatDate(contract.fecha_adjudicacion)}</div>
                    </div>
                )}

                {contract.fecha_publicacion && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Publicado
                        </div>
                        <div style={{ fontSize: '1rem' }}>{formatDate(contract.fecha_publicacion)}</div>
                    </div>
                )}

                {contract.procedimiento && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Procedimiento
                        </div>
                        <div style={{ fontSize: '1rem' }}>{contract.procedimiento}</div>
                    </div>
                )}
            </div>

            {analysis && (
                <section style={{ margin: '2rem 0' }}>
                    <h2>Resumen</h2>
                    <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#333' }}>
                        {analysis.summary_plain_es}
                    </p>

                    {analysis.keywords && analysis.keywords.length > 0 && (
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {analysis.keywords.map((kw: string, i: number) => (
                                <span key={i} style={{
                                    padding: '0.2rem 0.6rem',
                                    background: '#eef2ff',
                                    borderRadius: 12,
                                    fontSize: '0.85rem',
                                    color: '#4f46e5',
                                }}>
                                    {kw}
                                </span>
                            ))}
                        </div>
                    )}

                    {analysis.anomalies && analysis.anomalies.length > 0 && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
                            <h3 style={{ color: '#dc2626', margin: '0 0 0.5rem' }}>Posibles anomalías</h3>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                {analysis.anomalies.map((a: string, i: number) => (
                                    <li key={i} style={{ color: '#991b1b' }}>{a}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}

            {contract.descripcion && (
                <section style={{ margin: '2rem 0' }}>
                    <h2>Descripción</h2>
                    <p style={{ lineHeight: 1.6, color: '#444' }}>{contract.descripcion}</p>
                </section>
            )}

            {documents && documents.length > 0 && (
                <section style={{ margin: '2rem 0' }}>
                    <h2>Documentos</h2>
                    <ul>
                        {documents.map((doc, i) => (
                            <li key={i}>{doc.filename || `Documento ${i + 1}`}</li>
                        ))}
                    </ul>
                </section>
            )}

            {contract.url_fuente && (
                <p style={{ marginTop: '2rem', fontSize: '0.85rem' }}>
                    <a href={contract.url_fuente} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5' }}>
                        Ver en Plataforma de Contratación del Estado →
                    </a>
                </p>
            )}

            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                ID: {contract.external_id} | Actualizado: {formatDate(contract.updated_at)}
            </p>
        </div>
    );
}
