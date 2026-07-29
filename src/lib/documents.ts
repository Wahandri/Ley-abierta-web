import { Document, parseJSONL, getDataFilePaths } from './jsonl';
import { getImpactLevel } from './constants';

const API_BASE_URL = process.env.BOE_API_URL || 'http://localhost:8000';

// In-memory cache
let documentsCache: Document[] | null = null;
let cacheInitialized = false;

/**
 * Initialize cache by parsing JSONL file once
 */
async function initializeCache(): Promise<void> {
    if (cacheInitialized) return;

    try {
        const filePaths = getDataFilePaths();
        const allDocs: Document[] = [];

        for (const filePath of filePaths) {
            const docs = await parseJSONL(filePath);
            allDocs.push(...docs);
        }

        documentsCache = allDocs;
        cacheInitialized = true;
        console.log(`✓ Loaded ${documentsCache.length} documents into cache from ${filePaths.length} files`);
    } catch (error) {
        console.error('Failed to initialize document cache:', error);
        documentsCache = [];
        cacheInitialized = true;
    }
}

/**
 * Get all documents - fetches directly from API with high page_size
 * Use sparingly (sitemap, exports). Prefer queryDocs() for browsing.
 */
export async function getAllDocs(pageSize: number = 500, maxPages: number = 10): Promise<Document[]> {
    try {
        const allDocs: Document[] = [];
        for (let page = 1; page <= maxPages; page++) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            const res = await fetch(`${API_BASE_URL}/boe/docs?page=${page}&page_size=${pageSize}&sort_by=date&sort_order=asc`, {
                signal: controller.signal,
                cache: 'no-store'
            });
            clearTimeout(timeout);
            if (!res.ok) break;
            const data = await res.json();
            allDocs.push(...data.docs);
            if (!data.hasMore) break;
        }
        return allDocs;
    } catch {
        return [];
    }
}

/**
 * Get document by ID
 */

export async function getDocById(id: string): Promise<Document | null> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`${API_BASE_URL}/boe/docs/${id}`, { signal: controller.signal, cache: 'no-store' });
        clearTimeout(timeout);
        if (!res.ok) return null;
        const data = await res.json();
        return data.doc || null;
    } catch {
        return null;
    }
}

/**
 * Query documents with filters
 */
export interface QueryOptions {
    q?: string; // Search query ( busca en title, summary, keywords, short_title)
    topic?: string;
    affects?: string | string[]; // Support multi-select
    impact?: 'low' | 'mid' | 'high';
    from?: string; // ISO date
    to?: string; // ISO date
    type?: string | string[]; // Document type filter (ley, real_decreto, orden, resolucion, acuerdo, otro)
    status?: string | string[]; // Status (vigente, derogada) - inferido de document_intent
    jurisdiction?: string | string[]; // Geographic scope (nacional, autonomico, internacional, etc.)
    ministry?: string | string[]; // Ministry (from entities_detected)
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
    latestDocumentDate: string | null;
    oldestDocumentDate: string | null;
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
        type,
        status,
        jurisdiction,
        ministry,
        page = 1,
        pageSize = 20,
        sortBy = 'date',
        sortOrder = 'desc'
    } = options;

    let filtered = documentsCache || [];

    // Text search (in title, short_title, summary, keywords)
    if (q && q.trim()) {
        const query = q.toLowerCase();
        filtered = filtered.filter(doc => {
            const inTitle = (doc.title_original || '').toLowerCase().includes(query);
            const inShortTitle = (doc.short_title || '').toLowerCase().includes(query);
            const inSummary = (doc.summary_plain_es || '').toLowerCase().includes(query);
            const inKeywords = doc.keywords?.some(k => k.toLowerCase().includes(query)) || false;
            return inTitle || inShortTitle || inSummary || inKeywords;
        });
    }

    // Document type filter
    if (type) {
        const typeArray = Array.isArray(type) ? type : [type];
        filtered = filtered.filter(doc => typeArray.includes(doc.type));
    }

    // Status filter (inferido de document_intent: deroga = derogada, resto = vigente)
    if (status) {
        const statusArray = Array.isArray(status) ? status : [status];
        filtered = filtered.filter(doc => {
            const docStatus = doc.document_intent === 'deroga' ? 'derogada' : 'vigente';
            return statusArray.includes(docStatus);
        });
    }

    // Jurisdiction filter (geographic_scope or document_scope)
    if (jurisdiction) {
        const jurisdictionArray = Array.isArray(jurisdiction) ? jurisdiction : [jurisdiction];
        filtered = filtered.filter(doc => {
            const scope = doc.geographic_scope || doc.document_scope;
            if (!scope) return jurisdictionArray.includes('no_definido');
            const scopes = Array.isArray(scope) ? scope : [scope];
            // Normalizar: mapped a labels simples
            const normalizedScopes = scopes.map(s => {
                const lower = s.toLowerCase();
                if (lower.includes('españa') || lower.includes('nacional') || lower.includes('reino')) return 'nacional';
                if (lower.includes('autonóm') || lower.includes('cc.aa') || lower.includes('comunidad')) return 'autonomico';
                if (lower.includes('local') || lower.includes('ayto')) return 'local';
                if (lower.includes('internac')) return 'internacional';
                if (lower.includes('europe') || lower.includes('ue')) return 'europeo';
                return 'nacional'; // default
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return jurisdictionArray.some((j: any) => normalizedScopes.includes(j));
        });
    }

    // Ministry filter (from entities_detected)
    if (ministry) {
        const ministryArray = Array.isArray(ministry) ? ministry : [ministry];
        filtered = filtered.filter(doc => {
            const entities = doc.entities_detected || [];
            const docMinisterios = entities
                .filter(e => e.type === 'organismo' && e.name?.toLowerCase().includes('ministerio'))
                .map(e => e.name);
            return ministryArray.some(m => docMinisterios.includes(m));
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
            const level = getImpactLevel(doc.impact_index?.overall ?? doc.impact_index?.score ?? 0);
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
    const latestDocumentDate = total > 0
        ? filtered.reduce((latest, doc) => {
            const docDate = new Date(doc.date_published).getTime();
            return docDate > latest ? docDate : latest;
        }, 0)
        : null;
    const oldestDocumentDate = total > 0
        ? filtered.reduce((oldest, doc) => {
            const docDate = new Date(doc.date_published).getTime();
            return docDate < oldest ? docDate : oldest;
        }, Number.POSITIVE_INFINITY)
        : null;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const docs = filtered.slice(startIdx, endIdx);
    const hasMore = endIdx < total;

    return {
        docs,
        total,
        page,
        pageSize,
        hasMore,
        latestDocumentDate: latestDocumentDate ? new Date(latestDocumentDate).toISOString() : null,
        oldestDocumentDate: oldestDocumentDate ? new Date(oldestDocumentDate).toISOString() : null
    };
}

/**
 * Get facets (counts) for filtering
 */
export interface Facets {
    topic_counts: Record<string, number>;
    affects_counts: Record<string, number>;
    impact_counts: Record<string, number>;
    type_counts: Record<string, number>;
    status_counts: Record<string, number>;
    jurisdiction_counts: Record<string, number>;
    ministry_counts: Record<string, number>;
}

export async function getFacets(): Promise<Facets> {
    try {
        const res = await fetch(`${API_BASE_URL}/boe/facets`, { cache: 'no-store' });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        return {
            topic_counts: data.topic_counts || {},
            affects_counts: data.affects_counts || {},
            impact_counts: data.impact_counts || { low: 0, mid: 0, high: 0 },
            type_counts: data.type_counts || {},
            status_counts: data.status_counts || {},
            jurisdiction_counts: data.jurisdiction_counts || {},
            ministry_counts: data.ministry_counts || {},
        };
    } catch {
        // Fallback to local cache
        await initializeCache();
        const docs = documentsCache || [];
        const topic_counts: Record<string, number> = {};
        const affects_counts: Record<string, number> = {};
        const impact_counts = { low: 0, mid: 0, high: 0 };
        const type_counts: Record<string, number> = {};
        const status_counts: Record<string, number> = { vigente: 0, derogada: 0 };
        const jurisdiction_counts: Record<string, number> = {};
        const ministry_counts: Record<string, number> = {};
        for (const doc of docs) {
            const topic = doc.topic_primary || 'otros';
            topic_counts[topic] = (topic_counts[topic] || 0) + 1;
            const docType = doc.type || 'otro';
            type_counts[docType] = (type_counts[docType] || 0) + 1;
            const docStatus = doc.document_intent === 'deroga' ? 'derogada' : 'vigente';
            status_counts[docStatus]++;
            const scope = doc.geographic_scope || doc.document_scope;
            if (scope) {
                const scopes = Array.isArray(scope) ? scope : [scope];
                scopes.forEach(s => {
                    const lower = s.toLowerCase();
                    let key = 'nacional';
                    if (lower.includes('autonóm') || lower.includes('cc.aa') || lower.includes('comunidad')) key = 'autonomico';
                    else if (lower.includes('internac')) key = 'internacional';
                    else if (lower.includes('europe') || lower.includes('ue')) key = 'europeo';
                    else if (lower.includes('local') || lower.includes('ayto')) key = 'local';
                    jurisdiction_counts[key] = (jurisdiction_counts[key] || 0) + 1;
                });
            }
            const entities = doc.entities_detected || [];
            entities.filter((e: {type?: string; name?: string}) => e.type === 'organismo' && e.name?.toLowerCase().includes('ministerio'))
                .forEach((e: {name?: string}) => { if (e.name) ministry_counts[e.name] = (ministry_counts[e.name] || 0) + 1; });
            if (doc.affects_to) {
                for (const group of doc.affects_to) {
                    affects_counts[group] = (affects_counts[group] || 0) + 1;
                }
            }
            const impactLevel = getImpactLevel(doc.impact_index?.overall ?? doc.impact_index?.score ?? 0);
            impact_counts[impactLevel]++;
        }
        return { topic_counts, affects_counts, impact_counts, type_counts, status_counts, jurisdiction_counts, ministry_counts };
    }
}

/**
 * Get related documents based on content similarity
 */
export async function getRelatedDocs(currentDoc: Document, limit: number = 3): Promise<Document[]> {
    try {
        const topic = currentDoc.topic_primary;
        const res = await fetch(
            `${API_BASE_URL}/boe/docs?topic=${encodeURIComponent(topic)}&page_size=${limit + 1}`,
            { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        return (data.docs || [])
            .filter((d: Document) => d.id !== currentDoc.id)
            .slice(0, limit);
    } catch {
        // Fallback to local cache scoring
        await initializeCache();
        const docs = documentsCache || [];
        const candidates = docs.filter(d => d.id !== currentDoc.id);
        const scored = candidates.map(doc => {
            let score = 0;
            if (doc.topic_primary === currentDoc.topic_primary) score += 3;
            if (doc.affects_to && currentDoc.affects_to) {
                const intersection = doc.affects_to.filter(a => currentDoc.affects_to?.includes(a));
                score += intersection.length * 2;
            }
            if (doc.keywords && currentDoc.keywords) {
                const intersection = doc.keywords.filter(k => currentDoc.keywords?.includes(k));
                score += intersection.length;
            }
            return { doc, score };
        });
        scored.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(b.doc.date_published).getTime() - new Date(a.doc.date_published).getTime();
        });
        return scored.slice(0, limit).map(s => s.doc);
    }
}
