import styles from './EmptyState.module.css';

interface EmptyStateProps {
    message?: string;
    suggestion?: string;
    onReset?: () => void;
}

export default function EmptyState({
    message = 'No se encontraron documentos',
    suggestion = 'Intenta ajustar los filtros o realizar una búsqueda diferente.',
    onReset
}: EmptyStateProps) {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>📄</div>
            <h3 className={styles.message}>{message}</h3>
            <p className={styles.suggestion}>{suggestion}</p>
            {onReset && (
                <button className={styles.resetButton} onClick={onReset}>
                    Limpiar Filtros
                </button>
            )}
        </div>
    );
}
