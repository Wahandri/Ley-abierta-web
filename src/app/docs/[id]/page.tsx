import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import styles from './page.module.css';
import ImpactBadge from '@/components/ImpactBadge';
import ImpactBar from '@/components/ImpactBar';
import { getDocById } from '@/lib/documents';
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
        title: `${doc.title_original} - Ley Abierta`,
        description: doc.summary_plain_es.slice(0, 160),
    };
}

export default async function DocDetailPage({ params }: Props) {
    const { id } = await params;
    const doc = await getDocById(id);

    if (!doc) {
        notFound();
    }

    return (
        <div className="container">
            <div className={styles.page}>
                <Link href="/docs" className={styles.backLink}>
                    ← Volver al listado
                </Link>

                <article className={styles.article}>
                    {/* Header */}
                    <header className={styles.header}>
                        <div className={styles.badges}>
                            <span className={styles.typeBadge}>
                                {getTypeLabel(doc.type)}
                            </span>
                            <span className={styles.topicBadge}>
                                {getTopicLabel(doc.topic_primary)}
                            </span>
                        </div>

                        <h1 className={styles.title}>{doc.title_original}</h1>

                        <div className={styles.meta}>
                            <time dateTime={doc.date_published} className={styles.metaItem}>
                                📅 {formatDate(doc.date_published)}
                            </time>
                            {doc.approved_by && (
                                <span className={styles.metaItem}>
                                    ✍️ {doc.approved_by}
                                </span>
                            )}
                        </div>

                        <div className={styles.impactSection}>
                            <div className={styles.impactHeader}>
                                <h3>Nivel de impacto</h3>
                                <ImpactBadge score={doc.impact_index?.score || 0} />
                            </div>
                            <ImpactBar score={doc.impact_index?.score || 0} height={12} />
                            {doc.impact_index?.reason && (
                                <p className={styles.impactReason}>{doc.impact_index.reason}</p>
                            )}
                        </div>
                    </header>

                    {/* Summary */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>📄 Resumen ciudadano</h2>
                        <div className={styles.summary}>
                            {doc.summary_plain_es}
                        </div>
                    </section>

                    {/* Quick Overview Cards */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>⚡ Lo importante de un vistazo</h2>
                        <div className={styles.cardsGrid}>
                            {doc.affects_to && doc.affects_to.length > 0 && (
                                <div className={styles.card}>
                                    <h3 className={styles.cardTitle}>A quién afecta</h3>
                                    <div className={styles.affectsChips}>
                                        {doc.affects_to.map((group) => (
                                            <span key={group} className={styles.affectChip}>
                                                {getAffectedLabel(group)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {doc.approved_by && (
                                <div className={styles.card}>
                                    <h3 className={styles.cardTitle}>Quién aprueba</h3>
                                    <p className={styles.cardText}>{doc.approved_by}</p>
                                </div>
                            )}

                            {doc.entry_into_force && (
                                <div className={styles.card}>
                                    <h3 className={styles.cardTitle}>Entrada en vigor</h3>
                                    <p className={styles.cardText}>
                                        {formatDate(doc.entry_into_force)}
                                    </p>
                                </div>
                            )}

                            {doc.keywords && doc.keywords.length > 0 && (
                                <div className={styles.card}>
                                    <h3 className={styles.cardTitle}>Palabras clave</h3>
                                    <div className={styles.keywords}>
                                        {doc.keywords.map((keyword) => (
                                            <span key={keyword} className={styles.keyword}>
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Why you should know */}
                    {doc.transparency_notes && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>💡 Por qué deberías saber esto</h2>
                            <div className={styles.transparencyNotes}>
                                {doc.transparency_notes}
                            </div>
                        </section>
                    )}

                    {/* Changes Summary */}
                    {doc.changes_summary && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>📝 Resumen de cambios</h2>
                            <div className={styles.changesSummary}>
                                {doc.changes_summary}
                            </div>
                        </section>
                    )}

                    {/* Official Data */}
                    <section className={styles.section}>
                        <details className={styles.details}>
                            <summary className={styles.detailsSummary}>
                                📋 Datos oficiales
                            </summary>
                            <div className={styles.detailsContent}>
                                <div className={styles.dataGrid}>
                                    <div className={styles.dataItem}>
                                        <span className={styles.dataLabel}>ID:</span>
                                        <span className={styles.dataValue}>{doc.id}</span>
                                    </div>
                                    <div className={styles.dataItem}>
                                        <span className={styles.dataLabel}>Fuente:</span>
                                        <span className={styles.dataValue}>{doc.source}</span>
                                    </div>
                                    <div className={styles.dataItem}>
                                        <span className={styles.dataLabel}>Versión:</span>
                                        <span className={styles.dataValue}>{doc.version}</span>
                                    </div>
                                    {doc.section && (
                                        <div className={styles.dataItem}>
                                            <span className={styles.dataLabel}>Sección:</span>
                                            <span className={styles.dataValue}>{doc.section}</span>
                                        </div>
                                    )}
                                    <div className={styles.dataItem}>
                                        <span className={styles.dataLabel}>Creado:</span>
                                        <span className={styles.dataValue}>
                                            {formatDate(doc.created_at)}
                                        </span>
                                    </div>
                                    {doc.updated_at && (
                                        <div className={styles.dataItem}>
                                            <span className={styles.dataLabel}>Actualizado:</span>
                                            <span className={styles.dataValue}>
                                                {formatDate(doc.updated_at)}
                                            </span>
                                        </div>
                                    )}
                                    <div className={styles.dataItem}>
                                        <span className={styles.dataLabel}>URL oficial:</span>
                                        <a
                                            href={doc.url_oficial}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.officialLink}
                                        >
                                            Ver en BOE →
                                        </a>
                                    </div>
                                    {doc.pdf_path && (
                                        <div className={styles.dataItem}>
                                            <span className={styles.dataLabel}>PDF:</span>
                                            <span className={styles.dataValue}>{doc.pdf_path}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </details>
                    </section>
                </article>
            </div>
        </div>
    );
}
