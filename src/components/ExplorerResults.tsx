'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './ExplorerResults.module.css';
import DocCard from './DocCard';
import Pagination from './Pagination';
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
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<QueryResult | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch documents and facets in parallel
                const [docsResponse, facetsResponse] = await Promise.all([
                    fetch(`/api/docs?${searchParams.toString()}`),
                    fetch('/api/facets')
                ]);

                if (!docsResponse.ok) throw new Error('Failed to fetch documents');
                if (!facetsResponse.ok) throw new Error('Failed to fetch facets');

                const docsData = await docsResponse.json();
                const facetsData = await facetsResponse.json();

                setResults(docsData);

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

        fetchData();
    }, [searchParams, onFacetsUpdate, onTotalUpdate]);

    const skeletonArray = Array.from({ length: 9 }, (_, i) => i);
    const totalPages = results ? Math.ceil(results.total / results.pageSize) : 1;

    return (
        <div className={styles.results}>
            {/* Loading state */}
            {loading && (
                <div className={styles.grid}>
                    {skeletonArray.map((i) => (
                        <Skeleton key={i} />
                    ))}
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
            {!loading && !error && results && results.docs.length === 0 && (
                <EmptyState
                    message="No hay resultados con estos filtros"
                    suggestion="Prueba a quitar algunos filtros o cambiar tu búsqueda"
                />
            )}

            {/* Results */}
            {!loading && !error && results && results.docs.length > 0 && (
                <>
                    <div className={styles.resultsHeader}>
                        <p className={styles.resultsInfo}>
                            Mostrando <strong>{((results.page - 1) * results.pageSize) + 1}-{Math.min(results.page * results.pageSize, results.total)}</strong> de <strong>{results.total.toLocaleString()}</strong> documento{results.total !== 1 ? 's' : ''}
                        </p>
                        <SortControl />
                    </div>

                    <div className={styles.grid}>
                        {results.docs.map((doc) => (
                            <DocCard key={doc.id} doc={doc} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.paginationContainer}>
                            <Pagination
                                currentPage={results.page}
                                totalPages={totalPages}
                                hasMore={results.hasMore}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
