'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './FiltersPanel.module.css';
import { TOPICS, AFFECTED_GROUPS, IMPACT_LEVELS } from '@/lib/constants';

interface FiltersPanelProps {
    facets?: {
        topic_counts?: Record<string, number>;
        affects_counts?: Record<string, number>;
        impact_counts?: Record<string, number>;
    };
}

export default function FiltersPanel({ facets }: FiltersPanelProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const topic = searchParams.get('topic') || '';
    const affects = searchParams.get('affects') || '';
    const impact = searchParams.get('impact') || '';

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete('page'); // Reset to page 1
        router.push(`?${params.toString()}`);
    };

    const clearAllFilters = () => {
        const params = new URLSearchParams();
        const q = searchParams.get('q');
        if (q) params.set('q', q);
        router.push(`?${params.toString()}`);
    };

    const hasActiveFilters = topic || affects || impact;

    return (
        <>
            <button
                className={styles.toggleButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                Filtros {hasActiveFilters && `(${[topic, affects, impact].filter(Boolean).length})`}
            </button>

            <aside className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Filtros</h3>
                    <button
                        className={styles.closeButton}
                        onClick={() => setIsOpen(false)}
                        aria-label="Cerrar filtros"
                    >
                        ×
                    </button>
                </div>

                {hasActiveFilters && (
                    <button
                        className={styles.clearButton}
                        onClick={clearAllFilters}
                    >
                        Limpiar filtros
                    </button>
                )}

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Impacto</h4>
                    <div className={styles.buttonGroup}>
                        {Object.entries(IMPACT_LEVELS).map(([key, config]) => (
                            <button
                                key={key}
                                className={`${styles.filterButton} ${impact === key ? styles.active : ''}`}
                                onClick={() => updateFilter('impact', impact === key ? '' : key)}
                            >
                                {config.label}
                                {facets?.impact_counts?.[key] && (
                                    <span className={styles.count}>({facets.impact_counts[key]})</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Tema</h4>
                    <select
                        className={styles.select}
                        value={topic}
                        onChange={(e) => updateFilter('topic', e.target.value)}
                    >
                        <option value="">Todos los temas</option>
                        {Object.entries(TOPICS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label} {facets?.topic_counts?.[key] ? `(${facets.topic_counts[key]})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>A quién afecta</h4>
                    <select
                        className={styles.select}
                        value={affects}
                        onChange={(e) => updateFilter('affects', e.target.value)}
                    >
                        <option value="">Todos</option>
                        {Object.entries(AFFECTED_GROUPS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label} {facets?.affects_counts?.[key] ? `(${facets.affects_counts[key]})` : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </aside>

            {isOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
