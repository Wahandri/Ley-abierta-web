'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './FiltersPanel.module.css';
import { TOPICS, AFFECTED_GROUPS, IMPACT_LEVELS } from '@/lib/constants';

import SearchBar from './SearchBar';
import { formatDate } from '@/lib/constants';

interface FiltersPanelProps {
    facets?: {
        topic_counts?: Record<string, number>;
        affects_counts?: Record<string, number>;
        impact_counts?: Record<string, number>;
    };
    totalResults?: number;
}

export default function FiltersPanel({ facets, totalResults = 0 }: FiltersPanelProps) {
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

                {/* Green Box */}
                <div className={styles.greenBox}>
                    <h3 className={styles.greenBoxTitle}>Documentos legislativos</h3>
                    <div className={styles.greenBoxCount}>
                        {totalResults.toLocaleString()} <span className={styles.greenBoxLabel}>resultados</span>
                    </div>
                    <div className={styles.greenBoxDate}>
                        2024 - 2025
                    </div>
                </div>

                {/* Search Bar */}
                <div className={styles.section}>
                    <SearchBar />
                </div>

                {/* Impact */}
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

                {/* Topic Accordion */}
                <div className={styles.section}>
                    <details className={styles.accordion} open>
                        <summary className={styles.accordionSummary}>
                            Tema
                            <svg className={styles.accordionIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </summary>
                        <div className={styles.scrollableList}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="topic"
                                    checked={!topic}
                                    onChange={() => updateFilter('topic', '')}
                                />
                                <span className={styles.labelText}>Todos los temas</span>
                            </label>
                            {Object.entries(TOPICS).map(([key, label]) => (
                                <label key={key} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="topic"
                                        checked={topic === key}
                                        onChange={() => updateFilter('topic', key)}
                                    />
                                    <span className={styles.labelText}>
                                        {label} {facets?.topic_counts?.[key] ? `(${facets.topic_counts[key]})` : ''}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </details>
                </div>

                {/* Affects Accordion */}
                <div className={styles.section}>
                    <details className={styles.accordion} open>
                        <summary className={styles.accordionSummary}>
                            A quién afecta
                            <svg className={styles.accordionIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </summary>
                        <div className={styles.scrollableList}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={!affects}
                                    onChange={() => updateFilter('affects', '')}
                                />
                                <span className={styles.labelText}>Todos</span>
                            </label>
                            {/* Note: Original filters allowed single selection for affects via Select. 
                                Converting to Checkbox logic for consistency, but the updateFilter uses simple replacement. 
                                We'll keep single select behavior (radio-like) but styled as items for now to match logic, 
                                or implementing multi-select would require logic change.
                                DocsPage logic handles single 'affects' param?
                                Step 12: `updateFilter('affects', e.target.value)` -> replaces.
                                So I'll stick to replacement (Radio behavior) for now to minimize logic breakage, 
                                OR update logic to allow multiple? URL supports comma?
                                ExplorerSidebar supports comma `currentAffects.includes`.
                                FiltersPanel currently supports `affects` string.
                                I'll stick to Radio behavior for `FiltersPanel` for safety, represented as Radio inputs.
                            */}
                            {Object.entries(AFFECTED_GROUPS).map(([key, label]) => (
                                <label key={key} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="affects"
                                        checked={affects === key}
                                        onChange={() => updateFilter('affects', key)}
                                    />
                                    <span className={styles.labelText}>
                                        {label} {facets?.affects_counts?.[key] ? `(${facets.affects_counts[key]})` : ''}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </details>
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
