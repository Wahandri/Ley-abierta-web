import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <h3 className={styles.title}>Ley Abierta / El Vigilante</h3>
                        <p className={styles.tagline}>
                            Leyes y documentos públicos explicados en lenguaje claro
                        </p>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.section}>
                            <h4 className={styles.sectionTitle}>Navegación</h4>
                            <ul className={styles.list}>
                                <li><a href="/">Inicio</a></li>
                                <li><a href="/docs">Documentos</a></li>
                                <li><a href="/docs?view=topics">Temas</a></li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h4 className={styles.sectionTitle}>Información</h4>
                            <ul className={styles.list}>
                                <li><a href="https://www.boe.es" target="_blank" rel="noopener noreferrer">BOE Oficial</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Ley Abierta. Datos fuente: BOE.
                    </p>
                </div>
            </div>
        </footer>
    );
}
