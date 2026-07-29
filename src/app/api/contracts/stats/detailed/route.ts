import { NextResponse } from 'next/server';

const API_URL = process.env.BOE_API_URL || 'https://api.wahandri.com';
const API_KEY = process.env.BOE_API_KEY || '';

export async function GET() {
    try {
        const headers: Record<string, string> = {};
        if (API_KEY) headers['X-API-Key'] = API_KEY;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        const res = await fetch(`${API_URL}/api/contracts/stats/detailed`, {
            signal: controller.signal,
            headers,
            next: { revalidate: 300 },
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`API responded with status ${res.status}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in /api/contracts/stats/detailed:', error);
        return NextResponse.json(
            { detail: 'Failed to fetch detailed stats' },
            { status: 500 }
        );
    }
}