'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
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
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<QueryResult | null>(null);
    const [facets, setFacets] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch documents
                const docsResponse = await fetch(`/api/docs?${searchParams.toString()}`);
                if (!docsResponse.ok) throw new Error('Failed to fetch documents');
                const docsData = await docsResponse.json();
                setResults(docsData);

                // Fetch facets
                const facetsResponse = await fetch('/api/facets');
                if (!facetsResponse.ok) throw new Error('Failed to fetch facets');
                const facetsData = await facetsResponse.json();
                setFacets(facetsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const skeletonArray = Array.from({ length: 8 }, (_, i) => i);
    const totalPages = results ? Math.ceil(results.total / results.pageSize) : 1;

    return (
        <div className="container">
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
                                {results && (
                                    <>
                                        {results.total} documento{results.total !== 1 ? 's' : ''} encontrado{results.total !== 1 ? 's' : ''}
                                    </>
                                )}
                            </div>
                            <SortControl />
                        </div>

                        {loading && (
                            <div className={styles.grid}>
                                {skeletonArray.map((i) => (
                                    <Skeleton key={i} />
                                ))}
                            </div>
                        )}

                        {!loading && error && (
                            <EmptyState
                                message="Error al cargar documentos"
                                suggestion={error}
                            />
                        )}

                        {!loading && !error && results && results.docs.length === 0 && (
                            <EmptyState />
                        )}

                        {!loading && !error && results && results.docs.length > 0 && (
                            <>
                                <DocsTable docs={results.docs} />
                                <Pagination
                                    currentPage={results.page}
                                    totalPages={totalPages}
                                    hasMore={results.hasMore}
                                />
                            </>
                        )}
                    </div>
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
