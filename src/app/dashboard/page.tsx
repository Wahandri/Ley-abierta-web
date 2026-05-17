import Link from 'next/link';
import styles from './page.module.css';
import { getAllDocs } from '@/lib/documents';
import { TOPICS } from '@/lib/constants';

const TOPIC_ICONS: Record<string, string> = {
  economia: '💰', vivienda: '🏠', sanidad: '🏥', educacion: '📚',
  empleo: '💼', justicia: '⚖️', medio_ambiente: '🌿', transporte: '🚌',
  cultura: '🎭', tecnologia: '💻', defensa: '🛡️', seguridad: '🔒',
  agricultura: '🌾', industria: '🏭', comercio: '🏪', turismo: '✈️', otros: '📋',
};

export default async function DashboardPage() {
  const allDocs = await getAllDocs();
  const total = allDocs.length;
  const highImpact = allDocs.filter(d => (d.impact_index?.score ?? 0) >= 70).length;

  const topicCounts: Record<string, number> = {};
  for (const doc of allDocs) {
    const t = doc.topic_primary || 'otros';
    topicCounts[t] = (topicCounts[t] || 0) + 1;
  }
  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const typeCounts: Record<string, number> = {};
  for (const doc of allDocs) {
    const t = doc.type || 'otro';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  }
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const years = new Set(allDocs.map(d => d.date_published?.slice(0, 4)).filter(Boolean));
  const totalYears = years.size;

  const docsPerYear: Record<string, number> = {};
  for (const doc of allDocs) {
    const y = doc.date_published?.slice(0, 4);
    if (y) docsPerYear[y] = (docsPerYear[y] || 0) + 1;
  }

  const latestYear = Math.max(...Object.keys(docsPerYear).map(Number));
  const latestYearCount = docsPerYear[latestYear] || 0;

  const getImpact = (doc: typeof allDocs[0]) => doc.impact_index?.overall ?? doc.impact_index?.score ?? 0;
  const avgImpact = total > 0 ? Math.round(allDocs.reduce((s, d) => s + getImpact(d), 0) / total) : 0;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Estadísticas generales del archivo documental</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{total.toLocaleString()}</span>
            <span className={styles.statLabel}>Documentos totales</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalYears}</span>
            <span className={styles.statLabel}>Años de legislación</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{highImpact.toLocaleString()}</span>
            <span className={styles.statLabel}>Alto impacto</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{avgImpact}</span>
            <span className={styles.statLabel}>Impacto promedio</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{latestYear}</span>
            <span className={styles.statLabel}>Último año</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{latestYearCount.toLocaleString()}</span>
            <span className={styles.statLabel}>Documentos en {latestYear}</span>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Temas principales</h2>
            <div className={styles.barList}>
              {sortedTopics.map(([key, count]) => {
                const pct = Math.round((count / total) * 100);
                return (
                  <Link key={key} href={`/?topic=${key}`} className={styles.barRow}>
                    <span className={styles.barIcon}>{TOPIC_ICONS[key] || '📋'}</span>
                    <span className={styles.barLabel}>{TOPICS[key as keyof typeof TOPICS] || key}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.barCount}>{count.toLocaleString()}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Tipos de documento</h2>
            <div className={styles.barList}>
              {sortedTypes.map(([key, count]) => {
                const pct = Math.round((count / total) * 100);
                return (
                  <Link key={key} href={`/?type=${key}`} className={styles.barRow}>
                    <span className={styles.barLabel}>{key}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.barCount}>{count.toLocaleString()}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Documentos por año</h2>
          <div className={styles.yearGrid}>
            {Object.entries(docsPerYear)
              .sort(([a], [b]) => Number(b) - Number(a))
              .slice(0, 15)
              .map(([year, count]) => {
                const maxCount = Math.max(...Object.values(docsPerYear));
                const heightPct = Math.round((count / maxCount) * 100);
                return (
                  <div key={year} className={styles.yearBar}>
                    <span className={styles.yearCount}>{count}</span>
                    <div className={styles.yearTrack}>
                      <div className={styles.yearFill} style={{ height: `${heightPct}%` }} />
                    </div>
                    <span className={styles.yearLabel}>{year}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
