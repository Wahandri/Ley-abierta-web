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
    getAffectedLabel,
    getQuickPoints,
    getIntentDetails
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
    const quickPoints = getQuickPoints(doc, 3);

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
            <nav className={styles.breadcrumb}>
                <Link href="/">Inicio</Link>
                <span className={styles.separator}>›</span>
                <Link href="/docs">Biblioteca</Link>
                <span className={styles.separator}>›</span>
                <span className={styles.current}>{doc.short_title || doc.title_original}</span>
            </nav>

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badgesWrapper}>
                        <div className={styles.categoryBadge}>
                            {getTopicLabel(doc.topic_primary).toUpperCase()}
                        </div>
                        {doc.document_intent && getIntentDetails(doc.document_intent) && (
                            <div className={styles.intentBadge} style={{ '--intent-color': getIntentDetails(doc.document_intent)!.color } as React.CSSProperties}>
                                <span>{getIntentDetails(doc.document_intent)!.icon}</span>
                                <span>{getIntentDetails(doc.document_intent)!.label}</span>
                            </div>
                        )}
                    </div>

                    <h1 className={styles.title}>{doc.short_title || doc.title_original}</h1>

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

            <div className={styles.container}>
                <main className={styles.mainContent}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📄</span>
                            Resumen Ciudadano
                        </h2>
                        <div className={styles.summary}>
                            {doc.summary_plain_es}
                        </div>
                    </section>

                    {doc.what_changes && doc.what_changes.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>⚡</span>
                                Cambios Principales
                            </h2>
                            <ul className={styles.changesList}>
                                {doc.what_changes.slice(0, 4).map((change, idx) => (
                                    <li key={`change-${idx}`} className={styles.changeItem}>
                                        <svg className={styles.changeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>{change}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📋</span>
                            Ficha oficial
                        </h2>
                        <div className={styles.boeDataContainer}>
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
                    </section>
                </main>

                <aside className={styles.sidebar}>
                    <div className={styles.impactCard}>
                        <CircularProgress score={doc.impact_index?.overall || doc.impact_index?.score || 0} />
                        <p className={styles.impactDescription}>
                            {doc.impact_index?.reason || 'Sin explicación de impacto disponible en los datos.'}
                        </p>

                        {(doc.impact_index?.economico !== undefined || doc.impact_index?.opacidad !== undefined) && (
                            <div className={styles.subImpacts}>
                                {doc.impact_index.economico !== undefined && (
                                    <div className={styles.subImpactItem}>
                                        <div className={styles.subImpactHeader}>
                                            <span>Impacto Económico</span>
                                            <span className={styles.subImpactScore}>{doc.impact_index.economico}/100</span>
                                        </div>
                                        <div className={styles.progressBarBg}>
                                            <div className={styles.progressBarFill} style={{ width: `${doc.impact_index.economico}%`, backgroundColor: '#3b82f6' }}></div>
                                        </div>
                                    </div>
                                )}
                                {doc.impact_index.opacidad !== undefined && (
                                    <div className={styles.subImpactItem}>
                                        <div className={styles.subImpactHeader}>
                                            <span>Nivel de Opacidad</span>
                                            <span className={styles.subImpactScore}>{doc.impact_index.opacidad}/100</span>
                                        </div>
                                        <div className={styles.progressBarBg}>
                                            <div className={styles.progressBarFill} style={{ width: `${doc.impact_index.opacidad}%`, backgroundColor: '#ef4444' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.contextCard}>
                        <h3 className={styles.contextTitle}>Datos clave</h3>

                        <div className={styles.contextItem}>
                            <h4 className={styles.contextItemTitle}>¿A quién afecta?</h4>
                            <p className={styles.contextItemText}>
                                {doc.affects_to && doc.affects_to.length > 0
                                    ? doc.affects_to.map(g => getAffectedLabel(g)).join(', ')
                                    : 'No especificado en la ficha oficial.'}
                            </p>
                        </div>

                        {doc.who_benefits && doc.who_benefits.length > 0 && (
                            <div className={styles.contextItem}>
                                <h4 className={styles.contextItemTitle}>Beneficiarios</h4>
                                <ul className={styles.agentList}>
                                    {doc.who_benefits.map((agent, idx) => (
                                        <li key={`benefit-${idx}`} className={styles.agentItem}>👍 {agent}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {doc.who_might_pay && doc.who_might_pay.length > 0 && (
                            <div className={styles.contextItem}>
                                <h4 className={styles.contextItemTitle}>Afectados / Coste</h4>
                                <ul className={styles.agentList}>
                                    {doc.who_might_pay.map((agent, idx) => (
                                        <li key={`pay-${idx}`} className={styles.agentItem}>📉 {agent}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className={styles.contextItem}>
                            <h4 className={styles.contextItemTitle}>¿Cuándo entra en vigor?</h4>
                            <p className={styles.contextItemText}>
                                {doc.entry_into_force
                                    ? `Entrada en vigor registrada: ${formatDate(doc.entry_into_force)}.`
                                    : `Publicada el ${formatDate(doc.date_published)}.`}
                            </p>
                        </div>

                        <div className={styles.contextItem}>
                            <h4 className={styles.contextItemTitle}>Cambios clave</h4>
                            <p className={styles.contextItemText}>
                                {doc.changes_summary ?? 'No hay resumen de cambios en los datos.'}
                            </p>
                        </div>

                        {quickPoints.length > 0 && (
                            <div className={styles.contextItem}>
                                <h4 className={styles.contextItemTitle}>Resumen rápido</h4>
                                <ul className={styles.quickPointsList}>
                                    {quickPoints.map((point, index) => (
                                        <li key={`${doc.id}-quick-${index}`}>
                                            {point.endsWith('.') ? point : `${point}.`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

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

                    <DetailActions urlOficial={doc.url_oficial} title={doc.short_title || doc.title_original} />
                </aside>
            </div>

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
