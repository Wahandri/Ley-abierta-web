import { NextRequest, NextResponse } from 'next/server';

const BOE_API_URL = process.env.BOE_API_URL || 'http://localhost:8000';
const BOE_API_KEY = process.env.BOE_API_KEY || '';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const headers: Record<string, string> = {};
        if (BOE_API_KEY) headers['X-API-Key'] = BOE_API_KEY;
        const response = await fetch(`${BOE_API_URL}/boe/docs/${id}`, {
            headers,
            next: { revalidate: 300 }
        });
        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: 'Document not found' },
                    { status: 404 }
                );
            }
            throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in /api/docs/[id]:', error);
        return NextResponse.json(
            { error: 'Failed to fetch document from backend API' },
            { status: 503 }
        );
    }
}
