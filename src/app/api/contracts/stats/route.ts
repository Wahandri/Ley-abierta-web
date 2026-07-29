import { NextResponse } from 'next/server';

const API_URL = process.env.BOE_API_URL || 'https://api.wahandri.com';
const API_KEY = process.env.BOE_API_KEY || '';

export async function GET() {
    try {
        const headers: Record<string, string> = {};
        if (API_KEY) headers['X-API-Key'] = API_KEY;
        const response = await fetch(`${API_URL}/api/contracts/stats`, { headers, next: { revalidate: 60 } });
        if (!response.ok) throw new Error(`API responded with status ${response.status}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in /api/contracts/stats:', error);
        return NextResponse.json(
            { total: 0, total_importe: 0, organismos: 0, empresas: 0, oldest: null, newest: null },
            { status: 200 }
        );
    }
}
