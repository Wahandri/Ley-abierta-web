import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <span className={styles.brandName}>LegalClaridad</span>
                    <span className={styles.copyright}>© 2023. El derecho a entender es de todos.</span>
                </div>
                <div className={styles.rightSection}>
                    <a href="/privacidad" className={styles.link}>Privacidad</a>
                    <a href="/terminos" className={styles.link}>Términos</a>
                    <a href="/contacto" className={styles.link}>Contacto</a>
                </div>
            </div>
        </footer>
    );
}
