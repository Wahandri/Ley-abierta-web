import { Document, parseJSONL, getDataFilePath } from './jsonl';
import { getImpactLevel } from './constants';

// In-memory cache
let documentsCache: Document[] | null = null;
let cacheInitialized = false;

/**
 * Initialize cache by parsing JSONL file once
 */
async function initializeCache(): Promise<void> {
    if (cacheInitialized) return;

    try {
        const filePath = getDataFilePath();
        documentsCache = await parseJSONL(filePath);
        cacheInitialized = true;
        console.log(`✓ Loaded ${documentsCache.length} documents into cache`);
    } catch (error) {
        console.error('Failed to initialize document cache:', error);
        documentsCache = [];
        cacheInitialized = true;
    }
}

/**
 * Get all documents from cache
 */
export async function getAllDocs(): Promise<Document[]> {
    await initializeCache();
    return documentsCache || [];
}

/**
 * Get document by ID
 */
export async function getDocById(id: string): Promise<Document | null> {
    await initializeCache();
    const doc = documentsCache?.find(d => d.id === id);
    return doc || null;
}

/**
 * Query documents with filters
 */
export interface QueryOptions {
    q?: string; // Search query
    topic?: string;
    affects?: string | string[]; // Support multi-select
    impact?: 'low' | 'mid' | 'high';
    from?: string; // ISO date
    to?: string; // ISO date
    page?: number;
    pageSize?: number;
    sortBy?: 'date' | 'impact';
    sortOrder?: 'asc' | 'desc';
}

export interface QueryResult {
    docs: Document[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export async function queryDocs(options: QueryOptions = {}): Promise<QueryResult> {
    await initializeCache();

    const {
        q,
        topic,
        affects,
        impact,
        from,
        to,
        page = 1,
        pageSize = 20,
        sortBy = 'date',
        sortOrder = 'desc'
    } = options;

    let filtered = documentsCache || [];

    // Text search (in title, summary, keywords)
    if (q && q.trim()) {
        const query = q.toLowerCase();
        filtered = filtered.filter(doc => {
            const inTitle = doc.title_original.toLowerCase().includes(query);
            const inSummary = doc.summary_plain_es.toLowerCase().includes(query);
            const inKeywords = doc.keywords.some(k => k.toLowerCase().includes(query));
            return inTitle || inSummary || inKeywords;
        });
    }

    // Topic filter
    if (topic) {
        filtered = filtered.filter(doc => doc.topic_primary === topic);
    }

    // Affects filter (supports multi-select)
    if (affects) {
        const affectsArray = Array.isArray(affects) ? affects : [affects];
        filtered = filtered.filter(doc =>
            doc.affects_to && doc.affects_to.length > 0 && affectsArray.some(a => doc.affects_to!.includes(a))
        );
    }

    // Impact filter
    if (impact) {
        filtered = filtered.filter(doc => {
            const level = getImpactLevel(doc.impact_index?.score || 0);
            return level === impact;
        });
    }

    // Date range filter
    if (from) {
        const fromDate = new Date(from);
        filtered = filtered.filter(doc => new Date(doc.date_published) >= fromDate);
    }
    if (to) {
        const toDate = new Date(to);
        filtered = filtered.filter(doc => new Date(doc.date_published) <= toDate);
    }

    // Sorting
    filtered.sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'date') {
            const dateA = new Date(a.date_published).getTime();
            const dateB = new Date(b.date_published).getTime();
            comparison = dateB - dateA; // Default: newest first
        } else if (sortBy === 'impact') {
            comparison = (b.impact_index?.score || 0) - (a.impact_index?.score || 0);
        }

        return sortOrder === 'asc' ? -comparison : comparison;
    });

    // Pagination
    const total = filtered.length;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const docs = filtered.slice(startIdx, endIdx);
    const hasMore = endIdx < total;

    return {
        docs,
        total,
        page,
        pageSize,
        hasMore
    };
}

/**
 * Get facets (counts) for filtering
 */
export interface Facets {
    topic_counts: Record<string, number>;
    affects_counts: Record<string, number>;
    impact_counts: Record<string, number>;
}

export async function getFacets(): Promise<Facets> {
    await initializeCache();

    const docs = documentsCache || [];

    const topic_counts: Record<string, number> = {};
    const affects_counts: Record<string, number> = {};
    const impact_counts = { low: 0, mid: 0, high: 0 };

    for (const doc of docs) {
        // Topic counts
        const topic = doc.topic_primary || 'otros';
        topic_counts[topic] = (topic_counts[topic] || 0) + 1;

        // Affects counts
        if (doc.affects_to) {
            for (const group of doc.affects_to) {
                affects_counts[group] = (affects_counts[group] || 0) + 1;
            }
        }

        // Impact counts
        const impactLevel = getImpactLevel(doc.impact_index?.score || 0);
        impact_counts[impactLevel]++;
    }

    return {
        topic_counts,
        affects_counts,
        impact_counts
    };
}
