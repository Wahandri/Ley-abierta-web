import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topSection}>
                    <div className={styles.brandSection}>
                        <span className={styles.brandName}>Ley Abierta</span>
                        <span className={styles.copyright}>© 2026. El derecho a entender es de todos.</span>
                    </div>
                    <div className={styles.linksSection}>
                        <a href="/privacidad" className={styles.link}>Privacidad</a>
                        <a href="/terminos" className={styles.link}>Términos</a>
                        <a href="/contacto" className={styles.link}>Contacto</a>
                        <a href="https://github.com/Wahandri/Ley-abierta-web" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
                    </div>
                </div>
                <div className={styles.developerSection}>
                    <span className={styles.developerText}>
                        Desarrollado por:{' '}
                        <a
                            href="https://wahandri.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.developerLink}
                        >
                            Wahandri
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
