import { NextResponse } from 'next/server';
import { getFacets } from '@/lib/documents';

export async function GET() {
    try {
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
