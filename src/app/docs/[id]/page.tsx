import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import styles from './page.module.css';
import CircularProgress from '@/components/CircularProgress';
import DocCard from '@/components/DocCard';
import { getDocById, getRelatedDocs } from '@/lib/documents';
import {
    formatDate,
    getTopicLabel,
    getAffectedLabel
} from '@/lib/constants';
import DetailActions from '@/components/DetailActions';

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
    const transparencyNotes = [
        `Fuente oficial: ${doc.source || 'Boletín Oficial del Estado'} (${doc.id}).`,
        doc.updated_at
            ? `Última actualización registrada: ${formatDate(doc.updated_at)}.`
            : `Publicado oficialmente el ${formatDate(doc.date_published)}.`,
        doc.entry_into_force
            ? `Entrada en vigor: ${formatDate(doc.entry_into_force)}.`
            : 'No se indica una fecha de entrada en vigor diferenciada en los metadatos.',
        doc.changes_summary
            ? `Cambios clave identificados: ${doc.changes_summary}`
            : 'No hay resumen de cambios adicional disponible en los datos.'
    ];

    return (
        <div className={styles.page}>
            {/* Breadcrumb Navigation */}
            <nav className={styles.breadcrumb}>
                <Link href="/">Inicio</Link>
                <span className={styles.separator}>›</span>
                <Link href="/docs">Biblioteca</Link>
                <span className={styles.separator}>›</span>
                <span className={styles.current}>{doc.short_title || doc.title_original}</span>
            </nav>

            {/* Hero Section - Dark Navy Background */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    {/* Category/Topic Badge */}
                    <div className={styles.categoryBadge}>
                        {getTopicLabel(doc.topic_primary).toUpperCase()}
                    </div>

                    {/* Main Title */}
                    <h1 className={styles.title}>{doc.short_title || doc.title_original}</h1>

                    {/* Official Title Box */}
                    <div className={styles.officialTitleBox}>
                        <div className={styles.officialTitleIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div>
                            <div className={styles.officialTitleLabel}>TÍTULO OFICIAL (BOE)</div>
                            <div className={styles.officialTitleText}>{doc.title_original}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <div className={styles.container}>
                {/* Left Column: Content */}
                <main className={styles.mainContent}>
                    {/* Citizen Summary */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📄</span>
                            Resumen Ciudadano
                        </h2>
                        <div className={styles.summary}>
                            {doc.summary_plain_es}
                        </div>
                    </section>

                    {/* Lo importante de un vistazo */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>👁️</span>
                            Lo importante de un vistazo
                        </h2>
                        <div className={styles.infoCardsGrid}>
                            {/* Card 1: Who is affected */}
                            <div className={styles.infoCardSmall}>
                                <div className={styles.infoCardIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3 className={styles.infoCardTitle}>¿A quién afecta?</h3>
                                <p className={styles.infoCardText}>
                                    {doc.affects_to && doc.affects_to.length > 0
                                        ? doc.affects_to.map(g => getAffectedLabel(g)).join(', ')
                                        : 'No especificado en la ficha oficial.'}
                                </p>
                            </div>

                            {/* Card 2: When it takes effect */}
                            <div className={styles.infoCardSmall}>
                                <div className={styles.infoCardIcon} style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <h3 className={styles.infoCardTitle}>¿Cuándo entra en vigor?</h3>
                                <p className={styles.infoCardText}>
                                    {doc.entry_into_force
                                        ? `Entrada en vigor registrada: ${formatDate(doc.entry_into_force)}.`
                                        : `Publicada el ${formatDate(doc.date_published)}.`}
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* BOE Official Data - Expandable */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📋</span>
                            Datos Oficiales (BOE)
                        </h2>
                        <details className={styles.details}>
                            <summary className={styles.detailsSummary}>
                                <span>Ver ficha oficial completa</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </summary>
                            <div className={styles.detailsContent}>
                                <div className={styles.boeDataGrid}>
                                    <div className={styles.boeDataRow}>
                                        <span className={styles.boeDataLabel}>CÓDIGO BOE</span>
                                        <span className={styles.boeDataValue}>{doc.id}</span>
                                    </div>
                                    <div className={styles.boeDataRow}>
                                        <span className={styles.boeDataLabel}>PUBLICACIÓN</span>
                                        <span className={styles.boeDataValue}>{formatDate(doc.date_published)}</span>
                                    </div>
                                    <div className={styles.boeDataRow}>
                                        <span className={styles.boeDataLabel}>REFERENCIA</span>
                                        <span className={styles.boeDataValue}>{doc.source}</span>
                                    </div>
                                    {doc.url_oficial && (
                                        <div className={styles.boeDataRow}>
                                            <span className={styles.boeDataLabel}></span>
                                            <a href={doc.url_oficial} target="_blank" rel="noopener" className={styles.officialLink}>
                                                Ver PDF oficial ↗
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </details>
                    </section>
                </main>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Circular Impact Score */}
                    <div className={styles.impactCard}>
                        <CircularProgress score={doc.impact_index?.score || 0} />
                        {doc.impact_index?.reason && (
                            <p className={styles.impactDescription}>
                                {doc.impact_index.reason}
                            </p>
                        )}
                    </div>

                    {/* Transparency Notes */}
                    <div className={styles.transparencyCard}>
                        <h3 className={styles.transparencyTitle}>
                            <span className={styles.infoIcon}>ℹ️</span>
                            Notas de Transparencia
                        </h3>
                        <ul className={styles.transparencyList}>
                            <li className={styles.transparencyItem}>
                                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{transparencyNotes[0]}</span>
                            </li>
                            <li className={styles.transparencyItem}>
                                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{transparencyNotes[1]}</span>
                            </li>
                            <li className={styles.transparencyItem}>
                                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{transparencyNotes[2]}</span>
                            </li>
                            <li className={styles.transparencyItem}>
                                <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{transparencyNotes[3]}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <DetailActions urlOficial={doc.url_oficial} title={doc.short_title || doc.title_original} />
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
