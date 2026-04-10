import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ societyId: string }> }
) {
    const { societyId } = await params;
    const session = await getServerSession(authOptions);

    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/memberships/export`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    });

    if (!response.ok) {
        return NextResponse.json({ error: 'Export mislukt' }, { status: response.status });
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition') ?? `attachment; filename=ledenlijst.xlsx`;

    return new NextResponse(blob, {
        status: 200,
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': contentDisposition,
        },
    });
}