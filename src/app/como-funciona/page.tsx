import styles from './page.module.css';

export default function ComoFuncionaPage() {
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Cómo funciona Ley Abierta</h1>
                    <p className={styles.subtitle}>
                        Un espacio para entender lo que se aprueba en el BOE con lenguaje claro, filtros útiles y una
                        lectura rápida de su impacto ciudadano.
                    </p>
                </header>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>La idea detrás del proyecto</h2>
                    <p>
                        Ley Abierta nace para traducir el lenguaje jurídico a explicaciones accesibles. Aquí reunimos
                        leyes, decretos y resoluciones públicas, y las acompañamos con resúmenes sencillos, contexto y
                        señales de impacto para que puedas saber qué cambia y a quién afecta.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Qué puedes hacer aquí</h2>
                    <ul className={styles.list}>
                        <li>Explorar documentos oficiales con búsquedas completas por título, tema o palabras clave.</li>
                        <li>Filtrar por impacto y grupos afectados para encontrar lo que te interesa en minutos.</li>
                        <li>Consultar resúmenes ciudadanos y notas de transparencia que explican por qué importa.</li>
                        <li>Acceder a la fuente oficial del BOE para profundizar cuando lo necesites.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Cómo se organiza la información</h2>
                    <p>
                        Cada documento se procesa una sola vez y se guarda en memoria para que la búsqueda sea rápida.
                        El sistema clasifica temas, mide el impacto en una escala de 0 a 100 y ofrece etiquetas de “a
                        quién afecta” para facilitar la lectura y la comparación.
                    </p>
                </section>

                <section className={`${styles.section} ${styles.note}`}>
                    <p>
                        Este es un proyecto personal sin ánimo de lucro, pensado para fomentar la transparencia y la
                        comprensión de las normas públicas.
                    </p>
                </section>

                <p className={styles.signature}>Desarrollado por wahandri.</p>
            </div>
        </div>
    );
}
