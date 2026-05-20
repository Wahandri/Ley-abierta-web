import { NextRequest, NextResponse } from 'next/server';
import { getDocById } from '@/lib/documents';

const BOE_API_URL = process.env.BOE_API_URL;
const BOE_API_KEY = process.env.BOE_API_KEY || '';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (BOE_API_URL) {
            try {
                const headers: Record<string, string> = {};
                if (BOE_API_KEY) headers['X-API-Key'] = BOE_API_KEY;
                const response = await fetch(`${BOE_API_URL}/boe/docs/${id}`, {
                    headers,
                    next: { revalidate: 300 }
                });
                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data);
                }
            } catch {
                console.warn('External API unavailable, falling back to local cache');
            }
        }

        const doc = await getDocById(id);

        if (!doc) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ doc });
    } catch (error) {
        console.error('Error in /api/docs/[id]:', error);
        return NextResponse.json(
            { error: 'Failed to fetch document' },
            { status: 500 }
        );
    }
}
