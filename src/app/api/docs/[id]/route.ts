import { NextRequest, NextResponse } from 'next/server';
import { getDocById } from '@/lib/documents';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
