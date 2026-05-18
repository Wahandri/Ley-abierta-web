import { NextResponse } from 'next/server';
import { getFacets } from '@/lib/documents';

const BOE_API_URL = process.env.BOE_API_URL;
const BOE_API_KEY = process.env.BOE_API_KEY || '';

export async function GET() {
    try {
        if (BOE_API_URL) {
            const headers: Record<string, string> = {};
            if (BOE_API_KEY) headers['X-API-Key'] = BOE_API_KEY;
            const response = await fetch(`${BOE_API_URL}/boe/facets`, {
                headers,
                next: { revalidate: 300 }
            });
            if (response.ok) {
                const data = await response.json();
                return NextResponse.json(data);
            }
        }

        const facets = await getFacets();
        return NextResponse.json(facets);
    } catch (error) {
        console.error('Error in /api/facets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch facets' },
            { status: 500 }
        );
    }
}
