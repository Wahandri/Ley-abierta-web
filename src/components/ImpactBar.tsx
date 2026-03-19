import styles from './ImpactBar.module.css';
import { getImpactLevel, IMPACT_LEVELS } from '@/lib/constants';

interface ImpactBarProps {
    score: number;
    reason?: string;
    height?: number;
}

export default function ImpactBar({ score, reason, height = 6 }: ImpactBarProps) {
    const level = getImpactLevel(score);
    const impactLabel = IMPACT_LEVELS[level].label;

    return (
        <div className={styles.wrapper}>
            <div className={styles.impactHeader}>
                <span className={styles.impactLabel}>Impacto {impactLabel}</span>
                <span className={`${styles.impactScore} ${styles[`score-${level}`]}`}>{score}/100</span>
            </div>
            <div 
                className={styles.container} 
                style={{ height: `${height}px` }}
                title={reason || `Puntuación de impacto: ${score}/100`}
            >
                <div
                    className={`${styles.bar} ${styles[level]}`}
                    style={{ width: `${score}%` }}
                    role="progressbar"
                    aria-valuenow={score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Impacto: ${score}%`}
                />
            </div>
        </div>
    );
}
