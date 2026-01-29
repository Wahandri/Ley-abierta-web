'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import styles from './page.module.css';
import SearchBar from '@/components/SearchBar';
import FiltersPanel from '@/components/FiltersPanel';
import DocsTable from '@/components/DocsTable';
import SortControl from '@/components/SortControl';
import Pagination from '@/components/Pagination';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { Document } from '@/lib/jsonl';

interface QueryResult {
    docs: Document[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

function DocsContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [docs, setDocs] = useState<Document[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [facets, setFacets] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastDocRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    // Initial fetch
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setPage(1);

            try {
                // Determine params
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', '1');

                // Fetch documents and facets
                const [docsResponse, facetsResponse] = await Promise.all([
                    fetch(`/api/docs?${params.toString()}`),
                    fetch('/api/facets')
                ]);

                if (!docsResponse.ok) throw new Error('Failed to fetch documents');
                if (!facetsResponse.ok) throw new Error('Failed to fetch facets');

                const docsData: QueryResult = await docsResponse.json();
                const facetsData = await facetsResponse.json();

                setDocs(docsData.docs);
                setTotalResults(docsData.total);
                setHasMore(docsData.hasMore);
                setFacets(facetsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    // Fetch more pages
    useEffect(() => {
        if (page === 1) return;

        const fetchMoreData = async () => {
            setLoadingMore(true);
            try {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', page.toString());

                const response = await fetch(`/api/docs?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch more documents');

                const data: QueryResult = await response.json();

                setDocs(prev => [...prev, ...data.docs]);
                setHasMore(data.hasMore);
            } catch (err) {
                console.error('Error fetching more data:', err);
            } finally {
                setLoadingMore(false);
            }
        };

        fetchMoreData();
    }, [page, searchParams]);

    const skeletonArray = Array.from({ length: 8 }, (_, i) => i);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Documentos</h1>
                <p className={styles.subtitle}>
                    Explora todas las leyes y documentos públicos
                </p>
            </div>

            <div className={styles.searchSection}>
                <p className={styles.introText}>
                    Todas las leyes y sus documentos oficiales.
                </p>
                <SearchBar />
            </div>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <FiltersPanel facets={facets} />
                </aside>

                <div className={styles.main}>
                    <div className={styles.toolbar}>
                        <div className={styles.resultsInfo}>
                            {totalResults > 0 && (
                                <>
                                    {totalResults} documento{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                                </>
                            )}
                        </div>
                        <SortControl />
                    </div>

                    {!loading && error && (
                        <EmptyState
                            message="Error al cargar documentos"
                            suggestion={error}
                        />
                    )}

                    {!loading && !error && docs.length === 0 && (
                        <EmptyState />
                    )}

                    {(loading || docs.length > 0) && !error && (
                        <>
                            {/* We wrap DocsTable content to handle infinite scroll rows 
                                For table with infinite scroll, it's tricky because <tr> needs to be direct child.
                                DocsTable receives `docs` array. If we want ref on last element, we might need to modify DocsTable.
                                
                                OPTION: Pass `lastRowRef` to DocsTable?
                                Let's modify DocsTable to accept a ref or just render rows here?
                                DocsTable encapsulates the table structure.
                                Let's pass all docs to DocsTable, but we need the sentinel.
                                
                                Actually, placing a div sentinel BELOW the table is easier for table infinite scroll.
                            */}

                            {docs.length > 0 && <DocsTable docs={docs} />}

                            {/* Sentinel for infinite scroll */}
                            {hasMore && (
                                <div ref={lastDocRef} style={{ height: '20px', margin: '20px 0' }}>
                                    {(loadingMore || loading) && (
                                        <div style={{ textAlign: 'center' }}>Cargando más...</div>
                                    )}
                                </div>
                            )}

                            {loading && docs.length === 0 && (
                                <div className={styles.grid}>
                                    {skeletonArray.map((i) => (
                                        <Skeleton key={i} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DocsPage() {
    return (
        <Suspense fallback={<div className="container"><Skeleton /></div>}>
            <DocsContent />
        </Suspense>
    );
}
