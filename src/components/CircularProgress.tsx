'use client';

import styles from './CircularProgress.module.css';

interface CircularProgressProps {
    score: number; // 0-100
    size?: number;
    strokeWidth?: number;
    label?: string;
}

export default function CircularProgress({
    score,
    size = 180,
    strokeWidth = 12,
    label = 'PUNTUACIÓN DE IMPACTO'
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className={styles.container}>
            <div className={styles.label}>{label}</div>
            <div className={styles.circleWrapper}>
                <svg
                    width={size}
                    height={size}
                    className={styles.svg}
                >
                    {/* Background circle */}
                    <circle
                        className={styles.circleBackground}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="none"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    {/* Progress circle */}
                    <circle
                        className={styles.circleProgress}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="none"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className={styles.scoreWrapper}>
                    <div className={styles.score}>{score}</div>
                    <div className={styles.scoreLabel}>sobre 100</div>
                </div>
            </div>
            <div className={styles.impactLabel}>Alto Impacto Ciudadano</div>
        </div>
    );
}
