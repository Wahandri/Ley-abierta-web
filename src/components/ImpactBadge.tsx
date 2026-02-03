import styles from './ImpactBadge.module.css';
import { getImpactLevel, IMPACT_LEVELS } from '@/lib/constants';

interface ImpactBadgeProps {
    score: number;
    showScore?: boolean;
}

export default function ImpactBadge({ score, showScore = true }: ImpactBadgeProps) {
    const level = getImpactLevel(score);
    const config = IMPACT_LEVELS[level];

    return (
        <span className={`${styles.badge} ${styles[level]}`}>
            {config.label}
            {showScore && <span className={styles.score}> ({score})</span>}
        </span>
    );
}
