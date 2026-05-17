'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import ExplorerSidebar from '@/components/ExplorerSidebar';
import DocCard from '@/components/DocCard';
import SortControl from '@/components/SortControl';
import EmptyState from '@/components/EmptyState';
import { Document } from '@/lib/jsonl';

interface QueryResult {
  docs: Document[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  latestDocumentDate?: string | null;
  oldestDocumentDate?: string | null;
}

interface FacetsData {
  topic_counts?: Record<string, number>;
  affects_counts?: Record<string, number>;
  impact_counts?: Record<string, number>;
  type_counts?: Record<string, number>;
  status_counts?: Record<string, number>;
  jurisdiction_counts?: Record<string, number>;
  ministry_counts?: Record<string, number>;
}

function HomeContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [docs, setDocs] = useState<Document[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [facets, setFacets] = useState<FacetsData | undefined>(undefined);
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const [oldestDate, setOldestDate] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastDocRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => p + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        const [docsRes, facetsRes] = await Promise.all([
          fetch(`/api/docs?${params}`),
          fetch('/api/facets'),
        ]);
        if (!docsRes.ok) throw new Error('Error al cargar documentos');
        if (!facetsRes.ok) throw new Error('Error al cargar facetas');
        const data: QueryResult = await docsRes.json();
        const facetsData = await facetsRes.json();
        setDocs(data.docs);
        setTotalResults(data.total);
        setHasMore(data.hasMore);
        setFacets(facetsData ?? undefined);
        setLatestDate(data.latestDocumentDate ?? null);
        setOldestDate(data.oldestDocumentDate ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    if (page === 1) return;
    const loadMore = async () => {
      setLoadingMore(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        const res = await fetch(`/api/docs?${params}`);
        if (!res.ok) throw new Error('Error');
        const data: QueryResult = await res.json();
        setDocs(prev => [...prev, ...data.docs]);
        setHasMore(data.hasMore);
      } catch {
        // silent
      } finally {
        setLoadingMore(false);
      }
    };
    loadMore();
  }, [page, searchParams]);

  const skeletonArray = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brand}>
            <img src="/logo.png" alt="Ley Abierta" className={styles.logo} />
            <div className={styles.stats}>
              <span className={styles.stat}>
                <strong>{totalResults.toLocaleString()}</strong> documentos
              </span>
              <span className={styles.statDot}>·</span>
              <span className={styles.stat}>22 años de legislación</span>
            </div>
          </div>
          <div className={styles.topActions}>
            <button
              className={styles.filterBtn}
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filtros
            </button>
            <SortControl />
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <ExplorerSidebar
            facets={facets}
            totalResults={totalResults}
            latestDocumentDate={latestDate}
            oldestDocumentDate={oldestDate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        <main className={styles.main}>
          {loading && docs.length === 0 && (
            <div className={styles.grid}>
              {skeletonArray.map(i => (
                <div key={i} className={styles.skeleton}>Cargando...</div>
              ))}
            </div>
          )}

          {!loading && error && <EmptyState message="Error" suggestion={error} />}
          {!loading && !error && docs.length === 0 && <EmptyState />}

          {docs.length > 0 && (
            <>
              <div className={styles.grid}>
                {docs.map(doc => (
                  <DocCard key={doc.id} doc={doc} />
                ))}
              </div>
              {hasMore && (
                <div ref={lastDocRef} className={styles.sentinel}>
                  {loadingMore && <span className={styles.loadingMore}>Cargando más...</span>}
                </div>
              )}
              {!hasMore && docs.length > 0 && (
                <p className={styles.endMsg}>Todos los documentos cargados</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Cargando...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
