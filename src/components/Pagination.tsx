'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
}

export default function Pagination({ currentPage, totalPages, hasMore }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <nav className={styles.pagination} aria-label="Paginación">
            <button
                className={styles.button}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
            >
                ← Anterior
            </button>

            <span className={styles.info}>
                Página {currentPage} de {totalPages}
            </span>

            <button
                className={styles.button}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasMore}
                aria-label="Página siguiente"
            >
                Siguiente →
            </button>
        </nav>
    );
}
