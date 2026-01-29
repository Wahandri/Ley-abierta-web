'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ExplorerResults.module.css';
import DocCard from './DocCard';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';
import SortControl from './SortControl';
import { Document } from '@/lib/jsonl';

interface QueryResult {
    docs: Document[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

interface Facets {
    topic_counts: Record<string, number>;
    affects_counts: Record<string, number>;
    impact_counts: Record<string, number>;
}

interface ExplorerResultsProps {
    onFacetsUpdate?: (facets: Facets) => void;
    onTotalUpdate?: (total: number) => void;
}

export default function ExplorerResults({ onFacetsUpdate, onTotalUpdate }: ExplorerResultsProps) {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [docs, setDocs] = useState<Document[]>([]);
    const [totalResults, setTotalResults] = useState(0);
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

    // Initial fetch and reset on params change
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            setPage(1);

            try {
                // Fetch documents and facets
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', '1');

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

                // Notify parent components
                if (onFacetsUpdate) onFacetsUpdate(facetsData);
                if (onTotalUpdate) onTotalUpdate(docsData.total);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [searchParams, onFacetsUpdate, onTotalUpdate]);

    // Fetch more pages
    useEffect(() => {
        if (page === 1) return; // Already handled by initial fetch

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

    const skeletonArray = Array.from({ length: 9 }, (_, i) => i);

    return (
        <div className={styles.results}>
            {/* Sort Control */}
            {totalResults > 0 && !loading && (
                <div className={styles.resultsHeader}>
                    <p className={styles.resultsInfo}>
                        Mostrando <strong>{docs.length}</strong> de <strong>{totalResults.toLocaleString()}</strong> documento{totalResults !== 1 ? 's' : ''}
                    </p>
                    <SortControl />
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <EmptyState
                    message="No se pudieron cargar los documentos"
                    suggestion={error}
                />
            )}

            {/* Empty state */}
            {!loading && !error && docs.length === 0 && (
                <EmptyState
                    message="No hay resultados con estos filtros"
                    suggestion="Prueba a quitar algunos filtros o cambiar tu búsqueda"
                />
            )}

            {/* Results Grid */}
            <div className={styles.grid}>
                {docs.map((doc, index) => {
                    if (docs.length === index + 1) {
                        return (
                            <div ref={lastDocRef} key={doc.id}>
                                <DocCard doc={doc} />
                            </div>
                        );
                    } else {
                        return <DocCard key={doc.id} doc={doc} />;
                    }
                })}

                {/* Initial Loading Skeletons */}
                {loading && (
                    <>
                        {skeletonArray.map((i) => (
                            <Skeleton key={i} />
                        ))}
                    </>
                )}

                {/* Loading More Skeletons */}
                {loadingMore && (
                    <>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={`more-${i}`} />
                        ))}
                    </>
                )}
            </div>

            {!hasMore && docs.length > 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No hay más documentos para mostrar.
                </div>
            )}
        </div>
    );
}
