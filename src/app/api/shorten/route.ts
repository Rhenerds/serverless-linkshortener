import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        // Check authentication
        const authCookie = cookies().get('auth_token');
        if (authCookie?.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { url, nickname } = await request.json();
        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        try {
            new URL(url);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const id = nanoid(6);
        const createdAt = new Date().toISOString();

        // Store link data as a hash
        await db.hset(`link:${id}`, {
            url,
            nickname: nickname || '',
            id,
            createdAt
        });

        // Add to the list of all links
        await db.lpush('links', id);

        return NextResponse.json({ id, url, nickname, shortUrl: `/${id}` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
