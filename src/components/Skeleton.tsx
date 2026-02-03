import styles from './Skeleton.module.css';

export default function Skeleton() {
    return (
        <div className={styles.skeleton}>
            <div className={styles.header} />
            <div className={styles.badges}>
                <div className={styles.badge} />
                <div className={styles.badge} />
            </div>
            <div className={styles.title} />
            <div className={styles.impact} />
            <div className={styles.text} />
            <div className={styles.text} />
            <div className={styles.button} />
        </div>
    );
}
