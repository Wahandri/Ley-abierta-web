import { NextRequest, NextResponse } from 'next/server';
import { getFacets } from '@/lib/documents';

const BOE_API_URL = process.env.BOE_API_URL;

export async function GET(request: NextRequest) {
    try {
        if (BOE_API_URL) {
            const response = await fetch(`${BOE_API_URL}/boe/facets`, {
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
