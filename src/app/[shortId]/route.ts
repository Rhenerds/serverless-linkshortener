import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export async function GET(request: Request, { params }: { params: { shortId: string } }) {
    const shortId = params.shortId;

    // Fetch link data from hash
    const linkData = await db.hgetall<{ url: string }>(`link:${shortId}`);
    const url = linkData?.url;

    // Fallback for old data structure (string)
    const legacyUrl = !url ? await db.get<string>(`url:${shortId}`) : null;
    const finalUrl = url || legacyUrl;

    if (finalUrl) {
        // Analytics
        const headersList = headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const country = headersList.get('x-vercel-ip-country') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';
        const referer = headersList.get('referer') || 'direct';

        const analyticsData = {
            timestamp: Date.now(),
            ip,
            country,
            userAgent,
            referer
        };

        // Log analytics event
        await db.lpush(`analytics:${shortId}`, analyticsData);

        // Increment total clicks counter (legacy support + quick access)
        await db.incr(`stats:${shortId}`);

        return NextResponse.redirect(finalUrl);
    }

    return NextResponse.redirect(new URL('/', request.url));
}
