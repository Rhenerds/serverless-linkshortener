'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            router.refresh();
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-indigo-500 outline-none text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 focus:border-indigo-500 outline-none text-white"
                    />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
