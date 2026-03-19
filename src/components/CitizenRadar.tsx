import React from 'react';
import styles from './CitizenRadar.module.css';
import { Heuristics } from '@/lib/heuristics';
import { getTopicLabel, getAffectedLabel, getDisplayTitle, truncate } from '@/lib/constants';
import Link from 'next/link';

interface CitizenRadarProps {
    heuristics: Heuristics | null;
    totalDocs: number;
}

export default function CitizenRadar({ heuristics, totalDocs }: CitizenRadarProps) {
    if (!heuristics || totalDocs === 0) return null;

    const { topTopic, topAffected, highImpactCount, featuredDoc } = heuristics;

    return (
        <section className={styles.radarContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}>Panorama Actual <span className={styles.liveIndicator}>•</span></h2>
                <p className={styles.subtitle}>Análisis en tiempo real sobre los {totalDocs} documentos visibles</p>
            </header>

            <div className={styles.grid}>
                {topTopic.count > 0 && (
                    <div className={styles.insightCard}>
                        <span className={styles.insightLabel}>Tema dominante</span>
                        <strong className={styles.insightValue}>{getTopicLabel(topTopic.label)}</strong>
                        <span className={styles.insightContext}>Presente en {topTopic.count} documentos</span>
                    </div>
                )}

                {topAffected.count > 0 && (
                    <div className={styles.insightCard}>
                        <span className={styles.insightLabel}>Grupo más afectado</span>
                        <strong className={`${styles.insightValue} ${styles.highlightAffected}`}>{getAffectedLabel(topAffected.label)}</strong>
                        <span className={styles.insightContext}>Mencionado {topAffected.count} veces</span>
                    </div>
                )}

                <div className={styles.insightCard}>
                    <span className={styles.insightLabel}>Alta relevancia</span>
                    <strong className={`${styles.insightValue} ${highImpactCount > 0 ? styles.highlightImpact : ''}`}>
                        {highImpactCount} documento{highImpactCount !== 1 ? 's' : ''}
                    </strong>
                    <span className={styles.insightContext}>Con impacto nivel alto</span>
                </div>

                {featuredDoc && (
                    <Link href={`/docs/${featuredDoc.id}`} className={`${styles.insightCard} ${styles.featuredCard}`}>
                        <span className={styles.insightLabel}>Documento Destacado ✨</span>
                        <strong className={styles.featuredTitle} title={featuredDoc.title_original}>
                            {truncate(getDisplayTitle(featuredDoc), 60)}
                        </strong>
                        <span className={styles.insightContext}>Ver detalles →</span>
                    </Link>
                )}
            </div>
        </section>
    );
}
