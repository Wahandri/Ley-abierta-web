import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BOE_API_URL || 'https://api.wahandri.com';
const API_KEY = process.env.BOE_API_KEY || '';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams.toString();
        const headers: Record<string, string> = {};
        if (API_KEY) headers['X-API-Key'] = API_KEY;
        const response = await fetch(`${API_URL}/api/contracts/search${params ? '?' + params : ''}`, {
            headers,
            next: { revalidate: 0 }
        });
        if (!response.ok) throw new Error(`API responded with status ${response.status}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in /api/contracts/search:', error);
        return NextResponse.json({ query: '', results: [], total: 0 }, { status: 200 });
    }
}
