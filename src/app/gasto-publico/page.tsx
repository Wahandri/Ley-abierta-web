'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    getDetailedStats,
    getContracts,
    formatImporte,
    formatMillones,
    formatNumero,
    labelEstado,
    DetalleStats,
    Contract,
    formatDate,
} from '@/lib/contracts';

const MES_LABELS: Record<string, string> = {
    '2026-03': 'Marzo 2026',
    '2026-04': 'Abril 2026',
    '2026-05': 'Mayo 2026',
};

function BarChart({ data, maxValue, height = 28 }: { data: { label: string; value: number }[]; maxValue: number; height?: number }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 110, fontSize: '0.8rem', color: '#6b7280', textAlign: 'right', flexShrink: 0 }}>{d.label}</div>
                    <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 4, height }}>
                        <div style={{
                            width: `${Math.max((d.value / maxValue) * 100, 2)}%`,
                            height: '100%',
                            background: d.value === maxValue ? '#6366f1' : '#a5b4fc',
                            borderRadius: 4,
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                    <div style={{ width: 80, fontSize: '0.8rem', fontWeight: 600, color: '#374151', textAlign: 'right' }}>{d.value.toLocaleString('es-ES')}</div>
                </div>
            ))}
        </div>
    );
}

function TransparenceBar({ score }: { score: number }) {
    const color = score >= 75 ? '#22c55e' : score >= 55 ? '#eab308' : '#ef4444';
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                <span>Transparencia media</span>
                <span style={{ fontWeight: 700, color }}>{score}/100</span>
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 6 }} />
            </div>
        </div>
    );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: '1.25rem',
            marginBottom: '1rem',
        }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em', marginBottom: '1rem', marginTop: 0 }}>{title}</h3>
            {children}
        </div>
    );
}

function KPICard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
    return (
        <div style={{ padding: '1.25rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color }}>{value}</div>
            {sub && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{sub}</div>}
        </div>
    );
}

export default function GastoPublicoPage() {
    const [stats, setStats] = useState<DetalleStats | null>(null);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Contract[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [categories, setCategories] = useState<{ categoria: string; contratos: number; importe: number }[]>([]);

    useEffect(() => {
        getDetailedStats().then(data => {
            setStats(data);
            if (data) {
                getContracts(1, 20).then(cd => setContracts(cd.contracts));
            }
            fetch('/api/contracts/stats/by-category').then(r => r.json()).then(catData => {
                if (catData.categorias) setCategories(catData.categorias);
            }).catch(() => {});
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const handleSearch = useCallback(async (q: string) => {
        if (q.length < 3) { setSearchResults([]); return; }
        setSearchLoading(true);
        try {
            const res = await fetch(`/api/contracts/search?q=${encodeURIComponent(q)}&limit=20`);
            const data = await res.json();
            setSearchResults(data.results || []);
        } catch { setSearchResults([]); }
        setSearchLoading(false);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => handleSearch(search), 400);
        return () => clearTimeout(t);
    }, [search, handleSearch]);

    if (loading || !stats) {
        return (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Cargando datos de contratación pública...</div>
            </div>
        );
    }

    const { resumen, por_mes, por_organismo, por_importe, por_estado, transparencia, anomalias } = stats;

    const maxImporteMes = por_mes.length ? Math.max(...por_mes.slice(0, 6).map(m => m.importe)) : 0;
    const maxImporteOrg = por_organismo.length ? Math.max(...por_organismo.map(o => o.importe)) : 0;
    void maxImporteMes;
    void maxImporteOrg;

    const monthData = por_mes.slice(0, 6).map(m => ({
        label: MES_LABELS[m.mes] || m.mes,
        value: m.contratos,
    }));

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>

            {/* AVISO IMPORTANTE */}
            <div style={{
                background: '#fef9c3',
                border: '1px solid #fde047',
                borderRadius: 8,
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: '#854d0e',
            }}>
                <strong>¿Qué representan estos datos?</strong> Son licitaciones publicadas en la <a href="https://contrataciondelsectorpublico.gob.es" target="_blank" rel="noopener noreferrer" style={{ color: '#854d0e', textDecoration: 'underline' }}>Plataforma de Contratación del Estado (PLACSP)</a>.
                El <strong>importe</strong> es el valor total estimado del contrato (todas las anualidades,incluyendo prorrogas y opciones), <strong>no el gasto anual</strong>. Estamos en fase de cobertura de datos de 2026.
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <KPICard label="Contratos" value={formatNumero(resumen.total)} sub="publicados en PLACSP" color="#4f46e5" />
                <KPICard label="Importe Total (estimado)" value={formatMillones(resumen.total_importe)} sub="valor total de los contratos" color="#854d0e" />
                <KPICard label="Organismos" value={formatNumero(resumen.organismos)} sub="diferentes han licitado" color="#1d4ed8" />
                <KPICard label="Puntuación Transparencia" value={`${transparencia.media}/100`} sub={`rango: ${transparencia.min} – ${transparencia.max}`} color={transparencia.media >= 75 ? '#16a34a' : transparencia.media >= 55 ? '#ca8a04' : '#dc2626'} />
            </div>

            {/* FILAS DE SECCIONES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

                {/* Gasto por mes */}
                <SectionCard title="CONTRATOS PUBLICADOS POR MES">
                    <BarChart data={monthData} maxValue={Math.max(...monthData.map(d => d.value))} />
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {por_mes.slice(0, 6).map(m => (
                            <div key={m.mes} style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                <span style={{ fontWeight: 600, color: '#374151' }}>{formatMillones(m.importe)}</span> {MES_LABELS[m.mes] || m.mes}
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Estados */}
                <SectionCard title="ESTADO DE LOS CONTRATOS">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {por_estado.map(e => (
                            <div key={e.estado} style={{
                                padding: '0.75rem',
                                borderRadius: 8,
                                background: e.estado === 'RES' ? '#f0fdf4' :
                                           e.estado === 'PUB' ? '#eff6ff' :
                                           e.estado === 'ADJ' ? '#faf5ff' :
                                           e.estado === 'EV' ? '#fef3c7' : '#f9fafb',
                                border: '1px solid #e5e7eb',
                            }}>
                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#6b7280' }}>{labelEstado(e.estado)}</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#374151' }}>{e.contratos}</div>
                                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{formatMillones(e.importe)}</div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            {/* Top organismos */}
            <SectionCard title="TOP 20 ORGANISMOS POR IMPORTE">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem 0.5rem', color: '#6b7280', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase' }}>#</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem', color: '#6b7280', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase' }}>Organismo</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem', color: '#6b7280', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase' }}>Contratos</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem', color: '#6b7280', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase' }}>Importe</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem', color: '#6b7280', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase' }}>Transp.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {por_organismo.map((o, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '0.5rem 0.5rem', color: '#9ca3af', width: 24 }}>{i + 1}</td>
                                <td style={{ padding: '0.5rem', fontWeight: 500, color: '#374151', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={o.organismo}>{o.organismo}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'right', color: '#6b7280' }}>{o.contratos}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600, color: '#374151' }}>{formatMillones(o.importe)}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: 10,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: o.transparencia >= 75 ? '#dcfce7' : o.transparencia >= 55 ? '#fef9c3' : '#fee2e2',
                                        color: o.transparencia >= 75 ? '#166534' : o.transparencia >= 55 ? '#854d0e' : '#991b1b',
                                    }}>{o.transparencia}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </SectionCard>

            {/* Distribución por importe */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <SectionCard title="DISTRIBUCIÓN POR TAMAÑO DE CONTRATO">
                    <BarChart
                        data={por_importe.map(r => ({ label: r.rango, value: r.contratos }))}
                        maxValue={Math.max(...por_importe.map(r => r.contratos))}
                    />
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total: {por_importe.reduce((s, r) => s + r.contratos, 0).toLocaleString('es-ES')} contratos</span>
                    </div>
                </SectionCard>

                <SectionCard title="TRANSPARENCIA Y CUMPLIMIENTO">
                    <TransparenceBar score={transparencia.media} />
                    <div style={{ marginTop: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Contratos con posibles anomalías</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#dc2626' }}>{formatNumero(anomalias.total)}</div>
                            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                de {formatNumero(resumen.total)} contratos ({((anomalias.total / resumen.total) * 100).toFixed(0)}%)
                            </div>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                            Procedimientos negociados, emergencias, importes elevados, adjudicatario no publicado
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* Gasto por categoría presupuestaria */}
            {categories.length > 0 && (
                <SectionCard title="GASTO POR CATEGORÍA PRESUPUESTARIA">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {categories.map(cat => (
                            <div key={cat.categoria} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 130, fontSize: '0.8rem', color: '#6b7280', textAlign: 'right', flexShrink: 0 }}>{cat.categoria}</div>
                                <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 4, height: 24 }}>
                                    <div style={{
                                        width: `${Math.max((cat.importe / categories[0].importe) * 100, 2)}%`,
                                        height: '100%',
                                        background: cat.categoria === 'Otros' ? '#d1d5db' : '#818cf8',
                                        borderRadius: 4,
                                        transition: 'width 0.4s ease',
                                    }} />
                                </div>
                                <div style={{ width: 90, fontSize: '0.8rem', fontWeight: 600, color: '#374151', textAlign: 'right' }}>
                                    {formatMillones(cat.importe)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#9ca3af' }}>
                        Clasificación por keywords en nombre del organismo · &quot;Otros&quot; = organismos sin categoría detectada
                    </div>
                </SectionCard>
            )}

            {/* Búsqueda */}
            <SectionCard title="BUSCAR CONTRATOS">
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <input
                        type="text"
                        placeholder="Buscar por título, organismo, procedimiento..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.6rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: '0.9rem',
                            outline: 'none',
                        }}
                    />
                </div>
                {searchLoading && <div style={{ color: '#9ca3af', fontSize: '0.85rem', padding: '0.5rem 0' }}>Buscando...</div>}
                {searchResults.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 320, overflowY: 'auto' }}>
                        {searchResults.map(c => (
                            <Link
                                key={c.id}
                                href={`/contratos/${c.id}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    padding: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 6,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.85rem',
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600, color: '#111' }}>{c.titulo}</div>
                                    <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: 2 }}>{c.organismo}</div>
                                </div>
                                <div style={{ fontWeight: 700, color: '#374151', whiteSpace: 'nowrap', marginLeft: 12, fontSize: '0.85rem' }}>
                                    {formatImporte(c.importe)}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {search.length >= 3 && !searchLoading && searchResults.length === 0 && (
                    <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No se encontraron contratos</div>
                )}
            </SectionCard>

            {/* Contratos recientes */}
            <SectionCard title="CONTRATOS RECIENTES">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {contracts.map(c => (
                        <Link
                            key={c.id}
                            href={`/contratos/${c.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: 6,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.titulo}</div>
                                <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: 2 }}>
                                    {c.organismo}
                                    {c.procedimiento && <span style={{ marginLeft: 8, color: '#a5b4fc' }}>· {c.procedimiento}</span>}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', marginLeft: 12, flexShrink: 0 }}>
                                <div style={{ fontWeight: 700, color: '#374151', fontSize: '0.85rem' }}>{formatImporte(c.importe)}</div>
                                {c.fecha_publicacion && <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>{formatDate(c.fecha_publicacion)}</div>}
                            </div>
                        </Link>
                    ))}
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Link href="/contratos" style={{
                        display: 'inline-block',
                        padding: '0.6rem 1.5rem',
                        background: '#4f46e5',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                    }}>
                        Ver todos los contratos →
                    </Link>
                </div>
            </SectionCard>

            {/* Fuentes */}
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', marginTop: '2rem', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                Datos de la Plataforma de Contratación del Estado · Actualización diaria · Período: {resumen.oldest ? formatDate(resumen.oldest) : '—'} — {resumen.newest ? formatDate(resumen.newest) : '—'}
            </div>
        </div>
    );
}