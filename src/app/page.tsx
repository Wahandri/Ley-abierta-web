import Link from 'next/link';
import styles from './page.module.css';
import DocCard from '@/components/DocCard';
import { getAllDocs } from '@/lib/documents';
import { TOPICS } from '@/lib/constants';

const TOPIC_ICONS: Record<string, string> = {
    economia: '💰',
    vivienda: '🏠',
    sanidad: '🏥',
    educacion: '📚',
    empleo: '💼',
    justicia: '⚖️',
    medio_ambiente: '🌿',
    transporte: '🚌',
    cultura: '🎭',
    tecnologia: '💻',
    defensa: '🛡️',
    seguridad: '🔒',
    agricultura: '🌾',
    industria: '🏭',
    comercio: '🏪',
    turismo: '✈️',
    otros: '📋',
};

export default async function HomePage() {
    const allDocs = await getAllDocs();

    const totalDocs = allDocs.length;
    const highImpactCount = allDocs.filter(d => (d.impact_index?.score ?? 0) >= 70).length;

    // Ventana de 30 días desde hoy
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Usar `overall` (schema v2/2026) con fallback a `score` (schema v1/2025 y anteriores)
    const getImpact = (doc: (typeof allDocs)[0]) =>
        doc.impact_index?.overall ?? doc.impact_index?.score ?? 0;

    // Destacados recientes: últimos 30 días, impacto ≥ 40, ordenados por impacto desc
    let featuredDocs = allDocs
        .filter(doc => new Date(doc.date_published) >= thirtyDaysAgo && getImpact(doc) >= 40)
        .sort((a, b) => getImpact(b) - getImpact(a))
        .slice(0, 6);

    // Si no hay suficientes, rellenar con los más recientes de todo el archivo
    if (featuredDocs.length < 6) {
        const ids = new Set(featuredDocs.map(d => d.id));
        const fallback = allDocs
            .filter(doc => !ids.has(doc.id))
            .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime())
            .slice(0, 6 - featuredDocs.length);
        featuredDocs = [...featuredDocs, ...fallback];
    }

    return (
        <div className={styles.page}>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroBadge}>Leyes del BOE en lenguaje ciudadano</div>
                    <h1 className={styles.heroTitle}>
                        Entiende las leyes<br />
                        <span className={styles.heroAccent}>que te afectan</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        {totalDocs.toLocaleString('es-ES')} documentos legislativos explicados de forma clara.
                        Sin tecnicismos. Sin letra pequeña.
                    </p>
                    <div className={styles.heroCTAs}>
                        <Link href="/docs" className={styles.ctaPrimary}>
                            Explorar documentos
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link href="/como-funciona" className={styles.ctaSecondary}>
                            Cómo funciona
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className={styles.statsSection} aria-label="Estadísticas">
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{totalDocs.toLocaleString('es-ES')}</span>
                        <span className={styles.statLabel}>documentos</span>
                    </div>
                    <div className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>22</span>
                        <span className={styles.statLabel}>años de legislación</span>
                    </div>
                    <div className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{highImpactCount.toLocaleString('es-ES')}</span>
                        <span className={styles.statLabel}>de alto impacto</span>
                    </div>
                    <div className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{Object.keys(TOPICS).length}</span>
                        <span className={styles.statLabel}>áreas temáticas</span>
                    </div>
                </div>
            </section>

            {/* ── Topics ── */}
            <section className={styles.topicsSection}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Explora por tema</h2>
                        <p className={styles.sectionSubtitle}>Encuentra las leyes que más te interesan</p>
                    </div>
                    <div className={styles.topicsGrid}>
                        {Object.entries(TOPICS).map(([key, label]) => (
                            <Link key={key} href={`/docs?topic=${key}`} className={styles.topicCard}>
                                <span className={styles.topicIcon} aria-hidden="true">{TOPIC_ICONS[key]}</span>
                                <span className={styles.topicLabel}>{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured docs ── */}
            <section className={styles.featuredSection}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeaderRow}>
                        <div>
                            <h2 className={styles.sectionTitle}>Documentos destacados recientes</h2>
                            <p className={styles.sectionSubtitle}>Los de mayor impacto publicados recientemente</p>
                        </div>
                        <Link href="/docs?sortBy=impact&sortOrder=desc" className={styles.seeAllLink}>
                            Ver todos →
                        </Link>
                    </div>
                    <div className={styles.docsGrid}>
                        {featuredDocs.map(doc => (
                            <DocCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaInner}>
                    <h2 className={styles.ctaTitle}>¿Buscas una ley en concreto?</h2>
                    <p className={styles.ctaText}>
                        Usa el explorador completo con búsqueda por texto, tema, impacto y fecha.
                    </p>
                    <Link href="/docs" className={styles.ctaPrimary}>
                        Ir al explorador
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

        </div>
    );
}
