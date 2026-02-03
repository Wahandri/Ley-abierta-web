'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './ExplorerSidebar.module.css';
import { TOPICS, AFFECTED_GROUPS, IMPACT_LEVELS, formatDate } from '@/lib/constants';

interface ExplorerSidebarProps {
    facets?: {
        topic_counts?: Record<string, number>;
        affects_counts?: Record<string, number>;
        impact_counts?: Record<string, number>;
    };
    totalResults?: number;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function ExplorerSidebar({ facets, totalResults = 0, isOpen = false, onClose }: ExplorerSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const sidebarRef = useRef<HTMLElement>(null);

    // Local state for search input (debounced)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    // Current filters from URL
    const currentTopic = searchParams.get('topic') || '';
    const currentImpact = searchParams.get('impact') || '';
    const currentAffects = searchParams.get('affects')?.split(',').filter(Boolean) || [];
    const currentFrom = searchParams.get('from') || '';
    const currentTo = searchParams.get('to') || '';
    const currentSort = searchParams.get('sortBy') || 'date';

    // Update local search state when URL changes (e.g., browser back/forward)
    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    // ESC key handler for mobile drawer
    useEffect(() => {
        if (!isOpen || !onClose) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus trap for mobile drawer
    useEffect(() => {
        if (!isOpen || !sidebarRef.current) return;

        const sidebar = sidebarRef.current;
        const focusableElements = sidebar.querySelectorAll<HTMLElement>(
            'button, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        sidebar.addEventListener('keydown', handleTab);

        // Focus first element when drawer opens
        setTimeout(() => firstElement?.focus(), 100);

        return () => sidebar.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (searchQuery !== currentQ) {
                updateURL({ q: searchQuery || undefined });
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const updateURL = useCallback((updates: Record<string, string | string[] | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Apply updates
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
                params.delete(key);
            } else if (Array.isArray(value)) {
                params.set(key, value.join(','));
            } else {
                params.set(key, value);
            }
        });

        // Reset page to 1 when filters change
        if (Object.keys(updates).some(k => k !== 'page')) {
            params.delete('page');
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    const handleImpactClick = (impact: string) => {
        updateURL({ impact: currentImpact === impact ? undefined : impact });
    };

    const handleTopicChange = (topic: string) => {
        updateURL({ topic: topic || undefined });
    };

    const handleAffectsToggle = (affect: string) => {
        const newAffects = currentAffects.includes(affect)
            ? currentAffects.filter(a => a !== affect)
            : [...currentAffects, affect];
        updateURL({ affects: newAffects.length > 0 ? newAffects : undefined });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        router.push(pathname);
    };

    const hasActiveFilters = !!(searchQuery || currentTopic || currentImpact || currentAffects.length > 0 || currentFrom || currentTo);
    const activeFilterCount = [currentTopic, currentImpact, currentAffects.length > 0, currentFrom, currentTo].filter(Boolean).length;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className={styles.overlay}
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside ref={sidebarRef} className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Filtros</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                    >
                        ×
                    </button>
                </div>

                {/* Green Box: Results & Date */}
                <div className={styles.greenBox}>
                    <h3 className={styles.greenBoxTitle}>Documentos legislativos</h3>
                    <div className={styles.greenBoxCount}>
                        {totalResults.toLocaleString()} <span className={styles.greenBoxLabel}>resultados</span>
                    </div>
                </div>

                {/* Search */}
                <div className={styles.section}>
                    <label htmlFor="search-input" className={styles.sectionTitle}>
                        Buscar
                    </label>
                    <input
                        id="search-input"
                        type="search"
                        className={styles.searchInput}
                        placeholder="Título, resumen o palabras clave..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Buscar documentos"
                    />
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        className={styles.clearButton}
                        onClick={handleClearFilters}
                    >
                        Limpiar filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </button>
                )}

                {/* Impact */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Impacto</h3>
                    <div className={styles.impactGroup}>
                        {Object.entries(IMPACT_LEVELS).map(([key, config]) => (
                            <button
                                key={key}
                                className={`${styles.impactButton} ${currentImpact === key ? styles.active : ''}`}
                                onClick={() => handleImpactClick(key)}
                                data-impact={key}
                            >
                                <span className={styles.impactLabel}>{config.label}</span>
                                {facets?.impact_counts?.[key as keyof typeof facets.impact_counts] !== undefined && (
                                    <span className={styles.count}>
                                        {facets.impact_counts[key as keyof typeof facets.impact_counts]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date range */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Fecha de publicación</h3>
                    <div className={styles.dateRange}>
                        <label className={styles.dateLabel}>
                            <span className={styles.dateLabelText}>Desde</span>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={currentFrom}
                                onChange={(e) => updateURL({ from: e.target.value || undefined })}
                            />
                        </label>
                        <label className={styles.dateLabel}>
                            <span className={styles.dateLabelText}>Hasta</span>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={currentTo}
                                onChange={(e) => updateURL({ to: e.target.value || undefined })}
                            />
                        </label>
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
                                    value=""
                                    checked={!currentTopic}
                                    onChange={() => handleTopicChange('')}
                                />
                                <span className={styles.labelText}>Todos los temas</span>
                            </label>
                            {Object.entries(TOPICS).map(([key, label]) => (
                                <label key={key} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="topic"
                                        value={key}
                                        checked={currentTopic === key}
                                        onChange={() => handleTopicChange(key)}
                                    />
                                    <span className={styles.labelText}>
                                        {label}
                                        {facets?.topic_counts?.[key] !== undefined && (
                                            <span className={styles.count}>({facets.topic_counts[key]})</span>
                                        )}
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
                            {Object.entries(AFFECTED_GROUPS).map(([key, label]) => (
                                <label key={key} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={currentAffects.includes(key)}
                                        onChange={() => handleAffectsToggle(key)}
                                    />
                                    <span className={styles.labelText}>
                                        {label}
                                        {facets?.affects_counts?.[key] !== undefined && (
                                            <span className={styles.count}>({facets.affects_counts[key]})</span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </details>
                </div>
            </aside>
        </>
    );
}
