'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './SortControl.module.css';

export default function SortControl() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sortBy') || 'date';

    const handleSortChange = (sortBy: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', sortBy);
        // Reset page to 1 when sort changes
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className={styles.sortControl}>
            <label htmlFor="sort-select" className={styles.label}>
                Ordenar por:
            </label>
            <select
                id="sort-select"
                className={styles.select}
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
            >
                <option value="date">Fecha (más reciente)</option>
                <option value="impact">Impacto (mayor)</option>
            </select>
        </div>
    );
}
