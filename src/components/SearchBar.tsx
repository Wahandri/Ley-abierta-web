'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './SearchBar.module.css';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (query.trim()) {
                params.set('q', query);
            } else {
                params.delete('q');
            }

            params.delete('page'); // Reset to page 1 on new search

            router.push(`?${params.toString()}`);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className={styles.searchBar}>
            <input
                type="search"
                className={styles.input}
                placeholder="Buscar por título, palabras clave o contenido..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar documentos"
            />
            <span className={styles.icon}>🔍</span>
        </div>
    );
}
