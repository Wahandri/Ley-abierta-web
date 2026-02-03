/**
 * Constants and type definitions for Ley Abierta
 */

// Document types
export const DOCUMENT_TYPES = {
    ley: 'Ley',
    real_decreto: 'Real Decreto',
    orden: 'Orden',
    resolucion: 'Resolución',
    reglamento: 'Reglamento',
    circular: 'Circular',
    acuerdo: 'Acuerdo',
    otros: 'Otros'
};

// Topics
export const TOPICS = {
    economia: 'Economía',
    vivienda: 'Vivienda',
    sanidad: 'Sanidad',
    educacion: 'Educación',
    empleo: 'Empleo',
    justicia: 'Justicia',
    medio_ambiente: 'Medio Ambiente',
    transporte: 'Transporte',
    cultura: 'Cultura',
    tecnologia: 'Tecnología',
    defensa: 'Defensa',
    seguridad: 'Seguridad',
    agricultura: 'Agricultura',
    industria: 'Industria',
    comercio: 'Comercio',
    turismo: 'Turismo',
    otros: 'Otros'
};

// Affected groups
export const AFFECTED_GROUPS = {
    todos_ciudadanos: 'Todos los ciudadanos',
    autonomos: 'Autónomos',
    empresas: 'Empresas',
    funcionarios: 'Funcionarios',
    estudiantes: 'Estudiantes',
    pensionistas: 'Pensionistas',
    trabajadores: 'Trabajadores',
    desempleados: 'Desempleados',
    jovenes: 'Jóvenes',
    familias: 'Familias',
    discapacitados: 'Personas con discapacidad',
    inmigrantes: 'Inmigrantes',
    mayores: 'Mayores',
    mujeres: 'Mujeres'
};

// Impact levels
export const IMPACT_LEVELS = {
    low: { label: 'Bajo', min: 0, max: 39, color: '#10b981' },
    mid: { label: 'Medio', min: 40, max: 69, color: '#f59e0b' },
    high: { label: 'Alto', min: 70, max: 100, color: '#ef4444' }
};

/**
 * Get impact level for a score
 */
export function getImpactLevel(score: number): keyof typeof IMPACT_LEVELS {
    if (score >= 70) return 'high';
    if (score >= 40) return 'mid';
    return 'low';
}

/**
 * Get label for document type
 */
export function getTypeLabel(type: string): string {
    return DOCUMENT_TYPES[type as keyof typeof DOCUMENT_TYPES] || type;
}

/**
 * Get label for topic
 */
export function getTopicLabel(topic: string): string {
    return TOPICS[topic as keyof typeof TOPICS] || topic;
}

/**
 * Get label for affected group
 */
export function getAffectedLabel(group: string): string {
    return AFFECTED_GROUPS[group as keyof typeof AFFECTED_GROUPS] || group;
}

/**
 * Format date to dd/mm/yyyy
 */
export function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return dateString;
    }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get display title from document
 * Uses the first sentence of the summary if available, otherwise original title
 */
import { Document } from './jsonl';

export function getDisplayTitle(doc: Document): string {
    // Prioritize manual short title if available
    if (doc.short_title && doc.short_title.length > 5) {
        return doc.short_title;
    }

    if (doc.summary_plain_es) {
        // extract first sentence
        const match = doc.summary_plain_es.match(/^[^.]+\./);
        if (match && match[0].length > 20) {
            return match[0];
        }
        // If no dot or too short, try splitting by newline or just use the whole summary if short?
        // Let's stick to the plan: first segment by '.'
        const firstSegment = doc.summary_plain_es.split('.')[0].trim();
        if (firstSegment.length > 20) {
            return firstSegment + '.';
        }
    }
    return doc.title_original;
}
