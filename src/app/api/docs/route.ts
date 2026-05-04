import { NextRequest, NextResponse } from 'next/server';
import { queryDocs } from '@/lib/documents';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse arrays from comma-separated values
        const parseArrayParam = (param: string | null) => {
            return param ? param.split(',').map(a => a.trim()).filter(Boolean) : undefined;
        };

        const typeParam = parseArrayParam(searchParams.get('type'));
        const statusParam = parseArrayParam(searchParams.get('status'));
        const jurisdictionParam = parseArrayParam(searchParams.get('jurisdiction'));
        const ministryParam = parseArrayParam(searchParams.get('ministry'));
        const affectsParam = parseArrayParam(searchParams.get('affects'));

        const options = {
            q: searchParams.get('q') || undefined,
            topic: searchParams.get('topic') || undefined,
            affects: affectsParam,
            impact: (searchParams.get('impact') as 'low' | 'mid' | 'high') || undefined,
            from: searchParams.get('from') || undefined,
            to: searchParams.get('to') || undefined,
            type: typeParam,
            status: statusParam,
            jurisdiction: jurisdictionParam,
            ministry: ministryParam,
            page: parseInt(searchParams.get('page') || '1', 10),
            pageSize: parseInt(searchParams.get('pageSize') || '20', 10),
            sortBy: (searchParams.get('sortBy') as 'date' | 'impact') || 'date',
            sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
        };

        const result = await queryDocs(options);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in /api/docs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        );
    }
}
