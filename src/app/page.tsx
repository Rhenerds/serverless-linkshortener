import { db } from '@/lib/db';
import Shortener from './components/Shortener';
import Login from './components/Login';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const authCookie = cookies().get('auth_token');
    const isAuthenticated = authCookie?.value === 'authenticated';

    let links = [];

    if (isAuthenticated) {
        const linkIds = await db.lrange<string>('links', 0, -1);

        for (const id of linkIds) {
            // Try to get hash data first
            const linkData = await db.hgetall<{ url: string, nickname?: string, createdAt?: string }>(`link:${id}`);

            // Fallback for legacy data
            let url = linkData?.url;
            if (!url) {
                url = await db.get<string>(`url:${id}`) || '';
            }

            const clicks = await db.get<number>(`stats:${id}`);

            // Fetch analytics
            const analytics = await db.lrange<any>(`analytics:${id}`, 0, 19); // Get last 20 events

            if (url) {
                links.push({
                    id,
                    url,
                    nickname: linkData?.nickname || '',
                    clicks: clicks || 0,
                    analytics: analytics || []
                });
            }
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center py-24 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 tracking-tight">
                    Link Shortener NTA
                </h1>
                <p className="text-lg text-slate-400 max-w-lg mx-auto">
                    ya
                </p>
            </div>

            {isAuthenticated ? (
                <Shortener initialLinks={links} isAuthenticated={true} />
            ) : (
                <Login />
            )}
        </main>
    );
}
