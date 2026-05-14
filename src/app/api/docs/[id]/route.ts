import { NextRequest, NextResponse } from 'next/server';
import { getDocById } from '@/lib/documents';

const BOE_API_URL = process.env.BOE_API_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (BOE_API_URL) {
            const response = await fetch(`${BOE_API_URL}/boe/docs/${id}`, {
                next: { revalidate: 300 }
            });
            if (response.ok) {
                const data = await response.json();
                return NextResponse.json(data);
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
