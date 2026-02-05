'use client';

import { useState, useCallback, Suspense } from 'react';
import styles from './page.module.css';
import ExplorerSidebar from '@/components/ExplorerSidebar';
import ExplorerResults from '@/components/ExplorerResults';
import Skeleton from '@/components/Skeleton';

export default function Home() {
  const [facets, setFacets] = useState<any>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFacetsUpdate = useCallback((newFacets: any) => {
    setFacets(newFacets);
  }, []);

  const handleTotalUpdate = useCallback((total: number) => {
    setTotalResults(total);
  }, []);

  return (
    <div className={styles.explorerPage}>
      {/* Mobile filters toggle */}
      <button
        className={styles.mobileFilterToggle}
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir filtros"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 5.83333H17.5M5.83333 10H14.1667M8.33333 14.1667H11.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Filtros
      </button>

      <div className={styles.explorerLayout}>
        {/* Sidebar */}
        <div className={styles.sidebarContainer}>
          <Suspense fallback={<Skeleton />}>
            <ExplorerSidebar
              facets={facets}
              totalResults={totalResults}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </Suspense>
        </div>

        {/* Main content */}
        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Documentos Legislativos
            </h1>
            <p className={styles.subtitle}>
              Explora todas las leyes y normativas en lenguaje claro
            </p>
          </div>

          <Suspense fallback={<div className="container"><Skeleton /></div>}>
            <ExplorerResults
              onFacetsUpdate={handleFacetsUpdate}
              onTotalUpdate={handleTotalUpdate}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
