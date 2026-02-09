import styles from './contacto.module.css';

export default function ContactoPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Contacto</h1>

                <section className={styles.section}>
                    <h2>¿Tienes alguna pregunta o sugerencia?</h2>
                    <p>
                        Ley Abierta es un proyecto de código abierto dedicado a democratizar el acceso
                        a la información legislativa en España. Nos encantaría escuchar tus comentarios,
                        ideas o reportes de problemas.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>GitHub</h2>
                    <p>
                        La mejor manera de contribuir, reportar errores o sugerir mejoras es a través
                        de nuestro repositorio en GitHub:
                    </p>
                    <a
                        href="https://github.com/Wahandri/Ley-abierta-web"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.githubLink}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        github.com/Wahandri/Ley-abierta-web
                    </a>
                </section>

                <section className={styles.section}>
                    <h2>Desarrollador</h2>
                    <p>
                        Este proyecto ha sido desarrollado por Wahandri. Puedes conocer más sobre
                        otros proyectos en:
                    </p>
                    <a
                        href="https://wahandri.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.portfolioLink}
                    >
                        wahandri.github.io
                    </a>
                </section>

                <section className={styles.section}>
                    <h2>Contribuciones</h2>
                    <p>
                        Ley Abierta es un proyecto de código abierto y siempre estamos abiertos a
                        contribuciones de la comunidad. Ya seas desarrollador, diseñador, o simplemente
                        un usuario interesado, tu ayuda es bienvenida.
                    </p>
                    <p>
                        Las áreas donde puedes contribuir incluyen:
                    </p>
                    <ul>
                        <li>Mejoras en el código y optimizaciones</li>
                        <li>Correcciones en los resúmenes generados automáticamente</li>
                        <li>Diseño y experiencia de usuario</li>
                        <li>Documentación y traducciones</li>
                        <li>Reportes de errores y sugerencias de características</li>
                    </ul>
                </section>

                <section className={styles.infoBox}>
                    <h3>Nota Importante</h3>
                    <p>
                        Ley Abierta es un proyecto informativo y no proporciona asesoramiento legal.
                        Para consultas legales específicas, por favor contacta con un profesional
                        del derecho.
                    </p>
                </section>
            </div>
        </div>
    );
}
