import styles from './ImpactBar.module.css';
import { getImpactLevel } from '@/lib/constants';

interface ImpactBarProps {
    score: number;
    height?: number;
}

export default function ImpactBar({ score, height = 8 }: ImpactBarProps) {
    const level = getImpactLevel(score);

    return (
        <div className={styles.container} style={{ height: `${height}px` }}>
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
    );
}
