import Link from 'next/link';
import styles from './DocCard.module.css';
import ImpactBadge from './ImpactBadge';
import ImpactBar from './ImpactBar';
import { Document } from '@/lib/jsonl';
import { formatDate, getTypeLabel, getTopicLabel, getAffectedLabel, truncate, getDisplayTitle } from '@/lib/constants';

interface DocCardProps {
    doc: Document;
}

export default function DocCard({ doc }: DocCardProps) {
    const affectsToDisplay = doc.affects_to?.slice(0, 2) || [];
    const remainingAffects = (doc.affects_to?.length || 0) - affectsToDisplay.length;

    return (
        <Link href={`/docs/${doc.id}`} className={styles.card}>
            <div className={styles.header}>
                <time className={styles.date} dateTime={doc.date_published}>
                    {formatDate(doc.date_published)}
                </time>
                <div className={styles.badges}>
                    <span className={`${styles.badge} ${styles.typeBadge}`}>
                        {getTypeLabel(doc.type)}
                    </span>
                    <span className={`${styles.badge} ${styles.topicBadge}`}>
                        {getTopicLabel(doc.topic_primary)}
                    </span>
                </div>
            </div>

            <h3 className={styles.title}>
                {truncate(getDisplayTitle(doc), 120)}
            </h3>

            <div className={styles.impact}>
                <div className={styles.impactHeader}>
                    <span className={styles.impactLabel}>Impacto</span>
                    <ImpactBadge score={doc.impact_index?.score || 0} showScore={false} />
                </div>
                <ImpactBar score={doc.impact_index?.score || 0} />
            </div>

            {affectsToDisplay.length > 0 && (
                <div className={styles.affects}>
                    <span className={styles.affectsLabel}>Afecta a:</span>
                    <div className={styles.affectsChips}>
                        {affectsToDisplay.map((group) => (
                            <span key={group} className={styles.affectChip}>
                                {getAffectedLabel(group)}
                            </span>
                        ))}
                        {remainingAffects > 0 && (
                            <span className={styles.affectChip}>+{remainingAffects}</span>
                        )}
                    </div>
                </div>
            )}

            <p className={styles.summary}>
                {truncate(doc.summary_plain_es, 160)}
            </p>
        </Link>
    );
}
