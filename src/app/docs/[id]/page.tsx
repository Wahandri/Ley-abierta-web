import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import styles from './page.module.css';
import ImpactBadge from '@/components/ImpactBadge';
import ImpactBar from '@/components/ImpactBar';
import DocCard from '@/components/DocCard';
import { getDocById, getRelatedDocs } from '@/lib/documents';
import {
    formatDate,
    getTypeLabel,
    getTopicLabel,
    getAffectedLabel
} from '@/lib/constants';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const doc = await getDocById(id);

    if (!doc) {
        return {
            title: 'Documento no encontrado',
        };
    }

    return {
        title: `${doc.short_title || doc.title_original} - Ley Abierta`,
        description: doc.summary_plain_es.slice(0, 160),
    };
}

export default async function DocDetailPage({ params }: Props) {
    const { id } = await params;
    const doc = await getDocById(id);

    if (!doc) {
        notFound();
    }

    const relatedDocs = await getRelatedDocs(doc, 3);
    const readingTime = doc.text_length ? Math.ceil(doc.text_length / 200) : 5; // Est. 5 min if missing

    return (
        <div className={styles.page}>
            {/* Nav */}
            <Link href="/docs" className={styles.backLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Volver
            </Link>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badges}>
                        <span className={styles.typeBadge}>
                            {getTypeLabel(doc.type)}
                        </span>
                        <span className={styles.topicBadge}>
                            {getTopicLabel(doc.topic_primary)}
                        </span>
                    </div>

                    <h1 className={styles.title}>{doc.short_title || doc.title_original}</h1>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            📅 {formatDate(doc.date_published)}
                        </div>
                        {doc.approved_by && (
                            <div className={styles.metaItem}>
                                ✍️ {doc.approved_by}
                            </div>
                        )}
                        <div className={styles.metaItem}>
                            ⏱️ {readingTime} min lectura
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <div className={styles.container}>
                {/* Left Column: Content */}
                <main className={styles.mainContent}>
                    {/* Impact Section for Mobile (hidden on desktop usually, but we keep it in sidebar for desktop. Let's start with Summary) */}

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            📄 Resumen Ciudadano
                        </h2>
                        <div className={styles.summary}>
                            {doc.summary_plain_es}
                        </div>
                    </section>

                    {doc.transparency_notes && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>💡 Por qué es importante</h2>
                            <div className={styles.transparencyNotes}>
                                {doc.transparency_notes}
                            </div>
                        </section>
                    )}

                    {doc.changes_summary && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>📝 Cambios Clave</h2>
                            <div className={styles.changesSummary}>
                                {doc.changes_summary}
                            </div>
                        </section>
                    )}

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>📋 Datos Técnicos</h2>
                        <details className={styles.details}>
                            <summary className={styles.detailsSummary}>
                                Ver ficha oficial completa
                            </summary>
                            <div className={styles.detailsContent}>
                                <div className={styles.dataGrid}>
                                    <div className={styles.dataItem}>
                                        <span className={styles.dataLabel}>Identificador</span>
                                        <span className={styles.dataValue}>{doc.id}</span>
                                    </div>
                                    <div className={styles.dataItem}>
                                        <span className={styles.dataLabel}>Fuente</span>
                                        <span className={styles.dataValue}>{doc.source}</span>
                                    </div>
                                    {doc.url_oficial && (
                                        <div className={styles.dataItem}>
                                            <span className={styles.dataLabel}>Enlace Oficial</span>
                                            <a href={doc.url_oficial} target="_blank" rel="noopener" className={styles.officialLink}>
                                                Abrir en BOE ↗
                                            </a>
                                        </div>
                                    )}
                                    {doc.pdf_path && (
                                        <div className={styles.dataItem}>
                                            <span className={styles.dataLabel}>PDF Original</span>
                                            <span className={styles.dataValue}>{doc.pdf_path}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </details>
                    </section>
                </main>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Impact Card */}
                    <div className={styles.impactCard}>
                        <div className={styles.impactHeader}>
                            <h3>Nivel de Impacto</h3>
                            <ImpactBadge score={doc.impact_index?.score || 0} />
                        </div>
                        <ImpactBar score={doc.impact_index?.score || 0} height={8} />
                        {doc.impact_index?.reason && (
                            <p className={styles.impactReason}>{doc.impact_index.reason}</p>
                        )}
                    </div>

                    {/* Metadata Card */}
                    <div className={styles.infoCard}>
                        {doc.entry_into_force && (
                            <div className={styles.infoGroup}>
                                <span className={styles.infoLabel}>Entrada en vigor</span>
                                <div className={styles.infoValue}>{formatDate(doc.entry_into_force)}</div>
                            </div>
                        )}

                        {doc.affects_to && doc.affects_to.length > 0 && (
                            <div className={styles.infoGroup}>
                                <span className={styles.infoLabel}>Afecta a</span>
                                <div className={styles.chips}>
                                    {doc.affects_to.map(g => (
                                        <span key={g} className={styles.chip}>{getAffectedLabel(g)}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {doc.keywords && doc.keywords.length > 0 && (
                            <div className={styles.infoGroup}>
                                <span className={styles.infoLabel}>Temas</span>
                                <div className={styles.chips}>
                                    {doc.keywords.slice(0, 8).map(k => (
                                        <span key={k} className={styles.keywordChip}>{k}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Related Laws Section */}
            {relatedDocs.length > 0 && (
                <div className={styles.relatedSection}>
                    <div className={styles.relatedContainer}>
                        <h2 className={styles.sectionTitle}>🔗 Relacionado</h2>
                        <div className={styles.relatedGrid}>
                            {relatedDocs.map(related => (
                                <DocCard key={related.id} doc={related} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
