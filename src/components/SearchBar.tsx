'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './SearchBar.module.css';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [isFocused, setIsFocused] = useState(false);

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
        }, 250); // 250ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className={`${styles.searchBar} ${isFocused ? styles.focused : ''}`}>
            <div className={styles.iconLeft}>
                <span className="material-symbols-outlined">search</span>
            </div>
            <input
                type="search"
                className={styles.input}
                placeholder="Busca leyes, decretos o normativas en lenguaje claro..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-label="Buscar documentos"
            />
            <div className={styles.rightSection}>
                <div className={`${styles.spinner} ${isFocused ? styles.spinnerVisible : ''}`}></div>
                <kbd className={styles.kbd}>
                    <span>Cmd</span><span>K</span>
                </kbd>
            </div>
        </div>
    );
}
