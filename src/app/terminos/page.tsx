import styles from './terminos.module.css';

export default function TerminosPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Términos de Uso</h1>

                <section className={styles.section}>
                    <h2>1. Aceptación de Términos</h2>
                    <p>
                        Al acceder y utilizar Ley Abierta, aceptas estar sujeto a estos términos de uso.
                        Si no estás de acuerdo con estos términos, por favor no utilices la plataforma.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Propósito del Servicio</h2>
                    <p>
                        Ley Abierta es una plataforma educativa y de transparencia que facilita el acceso
                        a la información legislativa oficial de España publicada en el BOE. El objetivo es
                        democratizar el acceso al conocimiento legal.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. Limitación de Responsabilidad</h2>
                    <p>
                        La información presentada en Ley Abierta se proporciona "tal cual" con fines
                        informativos y educativos. Aunque nos esforzamos por la precisión, no garantizamos
                        la exactitud, integridad o actualidad de la información.
                    </p>
                    <p>
                        Los resúmenes y análisis son generados automáticamente y no constituyen asesoramiento
                        legal. Para asuntos legales específicos, consulta con un profesional cualificado.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>4. Fuente Oficial</h2>
                    <p>
                        La fuente oficial y definitiva de toda legislación española es el Boletín Oficial
                        del Estado (BOE) disponible en{' '}
                        <a
                            href="https://www.boe.es"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            www.boe.es
                        </a>
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Uso Responsable</h2>
                    <p>
                        Te comprometes a utilizar Ley Abierta de manera responsable y legal. No está
                        permitido:
                    </p>
                    <ul>
                        <li>Realizar scraping automatizado o sobrecargar los servidores</li>
                        <li>Intentar acceder a áreas no autorizadas de la plataforma</li>
                        <li>Distribuir malware o contenido dañino</li>
                        <li>Utilizar la plataforma para fines ilegales</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>6. Propiedad Intelectual</h2>
                    <p>
                        El contenido legislativo es de dominio público. El código fuente de Ley Abierta
                        está disponible en GitHub bajo licencia de código abierto. El diseño y la
                        presentación de la plataforma están protegidos por derechos de autor.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>7. Modificaciones</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento.
                        Las modificaciones entrarán en vigor al ser publicadas en esta página.
                    </p>
                </section>

                <section className={styles.section}>
                    <p className={styles.updateDate}>
                        Última actualización: Febrero 2026
                    </p>
                </section>
            </div>
        </div>
    );
}
