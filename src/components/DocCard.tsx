import Link from 'next/link';
import styles from './DocCard.module.css';
import ImpactBar from './ImpactBar';
import { Document } from '@/lib/jsonl';
import { 
    formatDate, 
    getTypeLabel, 
    getTopicLabel, 
    getAffectedLabel, 
    truncate, 
    getDisplayTitle, 
    getStatusLabel, 
    getQuickPoints,
    getImpactLevel,
    getIntentDetails
} from '@/lib/constants';

interface DocCardProps {
    doc: Document;
}

export default function DocCard({ doc }: DocCardProps) {
    const affectsToDisplay = doc.affects_to?.slice(0, 3) || [];
    const impactScore = doc.impact_index?.overall || doc.impact_index?.score || 0;
    const impactReason = doc.impact_index?.reason;
    const impactLevel = getImpactLevel(impactScore);
    const quickPoints = getQuickPoints(doc, 3);
    const hasQuickPoints = quickPoints.length > 0;

    return (
        <div className={`${styles.card} ${styles[`impact-${impactLevel}`]}`}>
            <div className={styles.header}>
                <div className={styles.badges}>
                    <span className={styles.docTypeBadge}>
                        {getTypeLabel(doc.type)}
                    </span>
                    <span className={styles.docTopicBadge}>
                        {getTopicLabel(doc.topic_primary)}
                    </span>
                    <span className={`${styles.statusBadge} ${styles[`status-${getStatusLabel(doc.type).toLowerCase()}`]}`}>
                        {getStatusLabel(doc.type)}
                    </span>
                    {doc.document_intent && getIntentDetails(doc.document_intent) && (
                        <span className={styles.intentBadge} style={{ '--intent-color': getIntentDetails(doc.document_intent)!.color } as React.CSSProperties}>
                            {getIntentDetails(doc.document_intent)!.icon} {getIntentDetails(doc.document_intent)!.label}
                        </span>
                    )}
                </div>
                <time className={styles.date} dateTime={doc.date_published}>
                    {formatDate(doc.date_published)}
                </time>
            </div>

            <h3 className={styles.title} title={doc.title_original}>
                <Link href={`/docs/${doc.id}`} className={styles.cardLink}>
                    {truncate(getDisplayTitle(doc), 110)}
                </Link>
            </h3>

            <p className={styles.entryIntoForce}>
                {doc.entry_into_force
                    ? `En vigor desde ${formatDate(doc.entry_into_force)}`
                    : `Publicado el ${formatDate(doc.date_published)}`}
            </p>

            {hasQuickPoints ? (
                <>
                    <p className={`${styles.summary} ${styles.summaryShort}`}>
                        {truncate(doc.summary_plain_es, 100)}
                    </p>
                    <ul className={styles.quickPoints}>
                        {quickPoints.map((point, index) => (
                            <li key={`${doc.id}-point-${index}`}>
                                {point.endsWith('.') ? point : `${point}.`}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p className={`${styles.summary} ${styles.summaryLong}`}>
                    {truncate(doc.summary_plain_es, 180)}
                </p>
            )}

            <div className={styles.impactSection}>
                <ImpactBar score={impactScore} reason={impactReason} />
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
        </div>
    );
}
