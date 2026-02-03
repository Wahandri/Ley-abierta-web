import Link from 'next/link';
import styles from './DocsTable.module.css';
import { Document } from '@/lib/jsonl';
import { formatDate, getTypeLabel, truncate, getDisplayTitle } from '@/lib/constants';

interface DocsTableProps {
    docs: Document[];
}

export default function DocsTable({ docs }: DocsTableProps) {
    const getImpactClass = (score: number) => {
        if (score >= 80) return styles.impactHigh;
        if (score >= 50) return styles.impactMedium;
        return styles.impactLow;
    };

    const getImpactLabel = (score: number) => {
        if (score >= 80) return 'Alto';
        if (score >= 50) return 'Medio';
        return 'Bajo';
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.dateCol}>Fecha</th>
                        <th className={styles.typeCol}>Tipo</th>
                        <th className={styles.titleCol}>Título</th>
                        <th className={styles.impactCol}>Impacto</th>
                        <th className={styles.linkCol}>BOE</th>
                    </tr>
                </thead>
                <tbody>
                    {docs.map((doc) => (
                        <tr key={doc.id} className={styles.row}>
                            <td className={styles.dateCol}>
                                {formatDate(doc.date_published)}
                            </td>
                            <td className={styles.typeCol}>
                                <span className={styles.typeTag}>
                                    {getTypeLabel(doc.type)}
                                </span>
                            </td>
                            <td className={styles.titleCol}>
                                <Link href={`/docs/${doc.id}`} className={styles.titleLink}>
                                    {truncate(getDisplayTitle(doc), 100)}
                                </Link>
                            </td>
                            <td className={styles.impactCol}>
                                <span className={`${styles.impactBadge} ${getImpactClass(doc.impact_index?.score || 0)}`}>
                                    {getImpactLabel(doc.impact_index?.score || 0)}
                                </span>
                            </td>
                            <td className={styles.linkCol}>
                                <a
                                    href={doc.url_oficial}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.externalLink}
                                    title="Ver documento oficial"
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
