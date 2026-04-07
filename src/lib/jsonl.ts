import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

export interface Document {
    id: string;
    source: string;
    type: string;
    title_original: string;
    short_title?: string;
    date_published: string;
    url_oficial: string;
    summary_plain_es: string;
    keywords: string[];
    topic_primary: string;
    // impact_index: schema v1 usa score+reason, schema v2 usa overall+submétricas
    impact_index: {
        score?: number;       // schema v1 (2025 y anteriores)
        overall?: number;     // schema v2 (2026+)
        reason?: string;      // schema v1
        economico?: number;
        alcance_ciudadano?: number;
        urgencia?: number;
        opacidad?: number;
    };
    version: string;
    created_at: string;
    updated_at?: string;
    // Campos comunes
    status?: string;
    approved_by?: string;
    affects_to?: string[];
    transparency_notes?: string;
    entry_into_force?: string;
    changes_summary?: string;
    key_points?: string[];
    what_changes?: string[];
    who_benefits?: string[];
    who_might_pay?: string[];
    document_intent?: string;
    geo_scope?: string;
    pdf_path?: string;
    section?: string;
    text_length?: number;
    // Campos schema v2 (2026+)
    affects_summary?: string;
    action_required?: boolean;
    action_required_details?: string;
    document_scope?: string;
    topics_secondary?: string[];
    geographic_scope?: string[];
    money_amounts?: { amount?: number; currency?: string; label?: string }[];
    dates_mentioned?: { date: string; label: string }[];
    entities_detected?: { name: string; type?: string; role?: string }[];
    facts_extracted?: Record<string, string>;
    confidence?: {
        overall?: number;
        summary?: number;
        classification?: number;
        entities?: number;
        dates?: number;
        money?: number;
    };
    processing_flags?: {
        full_text_available?: boolean;
        text_truncated?: boolean;
        fallback_used?: boolean;
        [key: string]: boolean | undefined;
    };
}

/**
 * Parse JSONL file line by line
 */
export async function parseJSONL(filePath: string): Promise<Document[]> {
    const documents: Document[] = [];

    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        // Skip empty lines
        if (!line.trim()) continue;

        try {
            const doc = JSON.parse(line) as Document;

            // Normalize missing fields
            if (!doc.affects_to) {
                doc.affects_to = [];
            }
            if (!doc.impact_index) {
                doc.impact_index = { score: 0, reason: 'No especificado' };
            }
            if (!doc.impact_index.score) {
                doc.impact_index.score = 0;
            }
            if (!doc.topic_primary) {
                doc.topic_primary = 'otros';
            }

            documents.push(doc);
        } catch (error) {
            // Silently skip invalid lines
            console.warn(`Skipping invalid JSONL line: ${error}`);
        }
    }

    return documents;
}

/**
 * Get the absolute paths to the data files (all master_*.jsonl files in src/data)
 */
export function getDataFilePaths(): string[] {
    const dataDir = path.join(process.cwd(), 'src', 'data');

    // Check if directory exists
    if (!fs.existsSync(dataDir)) {
        console.warn('Data directory not found:', dataDir);
        return [];
    }

    try {
        const files = fs.readdirSync(dataDir);
        const jsonlFiles = files
            .filter(file => /^master_\d{4}\.jsonl$/.test(file))
            .map(file => path.join(dataDir, file));

        // Sort files to ensure deterministic loading order (e.g. descending by year if possible, but path sort is fine)
        // Reverse sort usually puts higher numbers (years) first which might be slightly better for "newest first" logic implicit in some array ops
        return jsonlFiles.sort().reverse();
    } catch (error) {
        console.error('Error reading data directory:', error);
        return [];
    }
}
