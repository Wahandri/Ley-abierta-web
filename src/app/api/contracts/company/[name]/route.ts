import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BOE_API_URL || 'https://api.wahandri.com';
const API_KEY = process.env.BOE_API_KEY || '';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params;
        const searchParams = request.nextUrl.searchParams.toString();
        const url = `${API_URL}/api/contracts/company/${encodeURIComponent(name)}${searchParams ? '?' + searchParams : ''}`;
        const headers: Record<string, string> = {};
        if (API_KEY) headers['X-API-Key'] = API_KEY;
        const response = await fetch(url, { headers, next: { revalidate: 0 } });
        if (!response.ok) throw new Error(`API responded with status ${response.status}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in /api/contracts/company/[name]:', error);
        return NextResponse.json({ company: '', contracts: [], total: 0 }, { status: 200 });
    }
}
