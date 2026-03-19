import styles from './Skeleton.module.css';

export default function Skeleton() {
    return (
        <div className={styles.skeleton}>
            <div className={styles.header}>
                <div className={styles.badges}>
                    <div className={styles.badge} />
                    <div className={styles.badge} />
                    <div className={styles.badge} />
                </div>
                <div className={styles.date} />
            </div>
            
            <div className={styles.title} />
            <div className={styles.titleShort} />
            
            <div className={styles.context} />
            
            <div className={styles.summary} />
            <div className={styles.summary} />
            <div className={styles.summaryShort} />

            <div className={styles.impactSection}>
                <div className={styles.impactHeader}>
                    <div className={styles.impactLabel} />
                    <div className={styles.impactScore} />
                </div>
                <div className={styles.impactBar} />
            </div>

            <div className={styles.tags}>
                <div className={styles.tag} />
                <div className={styles.tag} />
            </div>
        </div>
    );
}
