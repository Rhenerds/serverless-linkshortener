'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyticsEvent {
    timestamp: number;
    ip: string;
    country: string;
    userAgent: string;
    referer: string;
}

interface Link {
    id: string;
    url: string;
    nickname?: string;
    clicks: number;
    analytics?: AnalyticsEvent[];
}

export default function Shortener({ initialLinks, isAuthenticated }: { initialLinks: Link[], isAuthenticated: boolean }) {
    const [url, setUrl] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, nickname }),
            });
            if (res.ok) {
                setUrl('');
                setNickname('');
                router.refresh();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth', { method: 'DELETE' });
        router.refresh();
    };

    if (!isAuthenticated) {
        return null; // Should be handled by parent to show Login component
    }

    return (
        <div className="w-full max-w-4xl">
            <div className="flex justify-end mb-4">
                <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white transition-colors">
                    Logout
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="flex-1 space-y-4">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste your long URL here..."
                        required
                        className="w-full px-6 py-4 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-lg placeholder:text-slate-500"
                    />
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Nickname (optional)"
                        className="w-full px-6 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 h-fit self-end md:self-center"
                >
                    {loading ? 'Shortening...' : 'Shorten'}
                </button>
            </form>

            <div className="space-y-4">
                {initialLinks.map((link) => (
                    <div key={link.id} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all">
                        <div
                            className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedId(expandedId === link.id ? null : link.id)}
                        >
                            <div className="flex-1 min-w-0 mr-8">
                                <div className="flex items-center gap-3 mb-1">
                                    <a
                                        href={`/${link.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl font-bold text-indigo-400 hover:text-indigo-300 truncate transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {typeof window !== 'undefined' ? window.location.host : ''}/{link.id}
                                    </a>
                                    {link.nickname && (
                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                            {link.nickname}
                                        </span>
                                    )}
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-slate-400">
                                        {link.clicks} clicks
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 truncate">{link.url}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(`${window.location.origin}/${link.id}`);
                                    }}
                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                    title="Copy to clipboard"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`text-slate-500 transition-transform ${expandedId === link.id ? 'rotate-180' : ''}`}
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>

                        {expandedId === link.id && (
                            <div className="p-6 pt-0 border-t border-white/10 bg-black/20">
                                <h4 className="text-sm font-semibold text-slate-400 mb-4 mt-4 uppercase tracking-wider">Recent Activity</h4>
                                {link.analytics && link.analytics.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-slate-400">
                                            <thead className="text-xs uppercase bg-white/5 text-slate-300">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-l-lg">Time</th>
                                                    <th className="px-4 py-3">IP Address</th>
                                                    <th className="px-4 py-3">Country</th>
                                                    <th className="px-4 py-3 rounded-r-lg">Referer</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {link.analytics.slice(0, 10).map((event, i) => (
                                                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-3 font-mono text-xs">
                                                            {new Date(event.timestamp).toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-xs">{event.ip}</td>
                                                        <td className="px-4 py-3">{event.country}</td>
                                                        <td className="px-4 py-3 truncate max-w-[200px]" title={event.referer}>
                                                            {event.referer}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm italic">No analytics data available yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {initialLinks.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No links yet. Create your first one above!
                    </div>
                )}
            </div>
        </div>
    );
}
