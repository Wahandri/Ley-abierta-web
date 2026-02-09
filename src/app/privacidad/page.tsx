import styles from './privacidad.module.css';

export default function PrivacidadPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Política de Privacidad</h1>

                <section className={styles.section}>
                    <h2>1. Información General</h2>
                    <p>
                        Ley Abierta es un proyecto de transparencia legislativa que facilita el acceso
                        a información oficial del Boletín Oficial del Estado (BOE). Este proyecto está
                        comprometido con la protección de la privacidad de sus usuarios.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Datos Recopilados</h2>
                    <p>
                        Esta plataforma no recopila datos personales de los usuarios. No utilizamos cookies
                        de seguimiento, no almacenamos información personal identificable, ni compartimos
                        datos con terceros.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. Fuente de Datos</h2>
                    <p>
                        Toda la información legislativa mostrada en esta plataforma proviene directamente
                        del Boletín Oficial del Estado (BOE) y es de dominio público. Los resúmenes y
                        análisis son generados mediante procesamiento automatizado.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>4. Uso de la Plataforma</h2>
                    <p>
                        El uso de Ley Abierta es completamente gratuito y no requiere registro.
                        Los usuarios pueden navegar, buscar y leer documentos legislativos sin
                        proporcionar ningún dato personal.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Cambios en la Política</h2>
                    <p>
                        Nos reservamos el derecho de actualizar esta política de privacidad en cualquier
                        momento. Los cambios serán publicados en esta página.
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
