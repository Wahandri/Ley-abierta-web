import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

interface Document {
  id: string;
  type: string;
  title_original: string;
  short_title?: string;
  summary_plain_es?: string;
  date_published: string;
  topic_primary: string;
  impact_index?: { score?: number; overall?: number; reason?: string } | null;
}

async function fetchRecentGastoDocs(): Promise<Document[]> {
  const apiUrl = process.env.BOE_API_URL || 'http://localhost:8000';
  try {
    const res = await fetch(
      `${apiUrl}/boe/docs?q=gasto&topic=economia&page_size=15&sort_by=date&sort_order=desc`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.docs || [];
  } catch {
    return [];
  }
}

async function fetchGastoStats(): Promise<{ total: number; highImpact: number }> {
  const apiUrl = process.env.BOE_API_URL || 'http://localhost:8000';
  try {
    const statsRes = await fetch(`${apiUrl}/boe/stats`, { cache: 'no-store' });
    const statsData = await statsRes.json();

    const allRes = await fetch(
      `${apiUrl}/boe/docs?topic=economia&page_size=500`,
      { cache: 'no-store' }
    );
    let economiaTotal = 0;
    let economiaHigh = 0;
    if (allRes.ok) {
      const allData = await allRes.json();
      economiaTotal = allData.total || 0;
      economiaHigh = (allData.docs || []).filter((d: Document) => {
        const idx = d.impact_index;
        if (!idx) return false;
        return (idx.overall ?? idx.score ?? 0) >= 70;
      }).length;
    }

    return { total: economiaTotal, highImpact: economiaHigh };
  } catch {
    return { total: 0, highImpact: 0 };
  }
}

export default async function GastoPublicoPage() {
  const [stats, recentDocs] = await Promise.all([
    fetchGastoStats(),
    fetchRecentGastoDocs(),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gasto Público</h1>
          <p className={styles.subtitle}>
            Documentos del BOE sobre presupuestos, contratación pública, subvenciones y
            control del gasto del Estado — explicados en lenguaje claro.
          </p>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.total.toLocaleString()}</span>
            <span className={styles.statLabel}>Documentos de economía</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.highImpact.toLocaleString()}</span>
            <span className={styles.statLabel}>Alto impacto</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{recentDocs.length}</span>
            <span className={styles.statLabel}>Últimos sobre gasto</span>
          </div>
        </div>

        <div className={styles.intro}>
          <p>
            <strong>¿Qué es el gasto público?</strong> Son los recursos que el Estado y las
            administraciones destinan a servicios públicos, inversiones, subvenciones y
            contrataciones. Cada año, cientos de normas del BOE regulan cómo se presupuesta,
            ejecuta y controla este gasto. Aquí reunimos las más relevantes para que puedas
            seguirlas sin necesidad de ser experto en derecho administrativo.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Documentos recientes</h2>
          {recentDocs.length > 0 ? (
            <div className={styles.docList}>
              {recentDocs.map((doc) => (
                <Link key={doc.id} href={`/docs/${doc.id}`} className={styles.docCard}>
                  <span className={styles.docTitle}>
                    {doc.short_title || doc.title_original}
                  </span>
                  <span className={styles.docSummary}>{doc.summary_plain_es}</span>
                  <div className={styles.docMeta}>
                    <span className={styles.docType}>{doc.type}</span>
                    <span>{new Date(doc.date_published).toLocaleDateString('es-ES')}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              No se pudieron cargar los documentos. Verifica que el backend esté corriendo.
            </div>
          )}
        </section>

        <div className={styles.linkGroup}>
          <Link href="/?topic=economia" className={styles.explorerLink}>
            Ver todos en el explorador →
          </Link>
        </div>
      </div>
    </div>
  );
}
