import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Lock, ArrowLeft } from 'lucide-react';

import { useAuth } from '../lib/auth';

export function Login() {
    const navigate = useNavigate();
    const { mockLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            {/* Header */}
            <header className="w-full px-6 py-6">
                <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white font-bold text-lg">O</span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">OPARS</span>
                    </Link>
                    <Link
                        to="/"
                        className="px-4 py-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10">
                                <Lock className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
                        <CardDescription className="text-white/60">
                            Enter your credentials to access OPARS
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-white/80">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-white/80">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white font-semibold" type="submit" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900 px-4 text-white/40">
                                    Quick Demo Access
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="h-12 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20"
                                onClick={async () => {
                                    if (mockLogin) {
                                        await mockLogin('admin');
                                        navigate('/dashboard');
                                    } else {
                                        setEmail('admin@opars.com');
                                        setError(null);
                                    }
                                }}
                            >
                                Admin Demo
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20"
                                onClick={async () => {
                                    if (mockLogin) {
                                        await mockLogin('member');
                                        navigate('/dashboard');
                                    } else {
                                        setEmail('member@opars.com');
                                        setError(null);
                                    }
                                }}
                            >
                                Member Demo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="py-6 px-6 text-center text-white/30 text-sm">
                © 2024 OPARS. Universiti Kebangsaan Malaysia.
            </footer>
        </div>
    );
}
