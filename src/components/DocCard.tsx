import Link from 'next/link';
import styles from './DocCard.module.css';
import ImpactBar from './ImpactBar';
import { Document } from '@/lib/jsonl';
import { formatDate, getTypeLabel, getTopicLabel, getAffectedLabel, truncate, getDisplayTitle } from '@/lib/constants';

interface DocCardProps {
    doc: Document;
}

export default function DocCard({ doc }: DocCardProps) {
    const affectsToDisplay = doc.affects_to?.slice(0, 2) || [];
    const impactScore = doc.impact_index?.score || 0;

    return (
        <Link href={`/docs/${doc.id}`} className={styles.card}>
            <div className={styles.header}>
                <div className={styles.badges}>
                    <span className={styles.docTypeBadge}>
                        {getTypeLabel(doc.type)}
                    </span>
                    <span className={styles.docTypeBadge}>
                        {getTopicLabel(doc.topic_primary)}
                    </span>
                </div>
                <time className={styles.date} dateTime={doc.date_published}>
                    {formatDate(doc.date_published)}
                </time>
            </div>

            <h3 className={styles.title}>
                {truncate(getDisplayTitle(doc), 100)}
            </h3>

            <p className={styles.summary}>
                {truncate(doc.summary_plain_es, 160)}
            </p>

            <div className={styles.impactSection}>
                <div className={styles.impactHeader}>
                    <span className={styles.impactLabel}>Impacto Social</span>
                    <span className={styles.impactScore}>{impactScore}/100</span>
                </div>
                <ImpactBar score={impactScore} />
            </div>

            {affectsToDisplay.length > 0 && (
                <div className={styles.tags}>
                    {affectsToDisplay.map((group) => (
                        <span key={group} className={styles.tag}>
                            {getAffectedLabel(group)}
                        </span>
                    ))}
                </div>
            )}
        </Link>
    );
}
