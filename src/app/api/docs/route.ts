import { NextRequest, NextResponse } from 'next/server';

const BOE_API_URL = process.env.BOE_API_URL || 'http://localhost:8000';
const BOE_API_KEY = process.env.BOE_API_KEY || '';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams.toString();
        const headers: Record<string, string> = {};
        if (BOE_API_KEY) headers['X-API-Key'] = BOE_API_KEY;
        const response = await fetch(`${BOE_API_URL}/boe/docs${params ? '?' + params : ''}`, {
            headers,
            next: { revalidate: 60 }
        });
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in /api/docs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents from backend API' },
            { status: 503 }
        );
    }
}
