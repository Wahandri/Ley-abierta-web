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
    impact_index: {
        score: number;
        reason: string;
    };
    version: string;
    created_at: string;
    // Optional fields
    approved_by?: string;
    affects_to?: string[];
    transparency_notes?: string;
    entry_into_force?: string;
    changes_summary?: string;
    pdf_path?: string;
    section?: string;
    updated_at?: string;
    text_length?: number;
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
 * Get the absolute paths to the data files (2024-2026)
 */
export function getDataFilePaths(): string[] {
    return [
        path.join(process.cwd(), 'src', 'data', 'master_2026.jsonl'),
        path.join(process.cwd(), 'src', 'data', 'master_2025.jsonl'),
        path.join(process.cwd(), 'src', 'data', 'master_2024.jsonl')
    ];
}
