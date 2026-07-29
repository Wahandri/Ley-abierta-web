import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BOE_API_URL || 'https://api.wahandri.com';
const API_KEY = process.env.BOE_API_KEY || '';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const headers: Record<string, string> = {};
        if (API_KEY) headers['X-API-Key'] = API_KEY;
        const response = await fetch(`${API_URL}/api/contracts/${id}`, {
            headers,
            next: { revalidate: 60 }
        });
        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
            }
            throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in /api/contracts/[id]:', error);
        return NextResponse.json({ error: 'Failed to fetch contract' }, { status: 503 });
    }
}
