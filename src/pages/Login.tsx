import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { toast } from 'sonner';

// UKMShape Committee Members - Hierarchical Order
const COMMITTEE_MEMBERS = [
    {
        id: 1,
        position: 'Pengarah',
        email: 'directorshape@ukm.edu.my',
        color: 'from-red-500 to-red-700',
        initials: 'P',
        tier: 1, // Top tier
    },
    {
        id: 2,
        position: 'Timbalan Pengarah I',
        subtitle: 'Akademik & Pengembangan Program',
        email: 'tp1ukmshape@ukm.edu.my',
        color: 'from-blue-500 to-blue-700',
        initials: 'I',
        tier: 2,
    },
    {
        id: 3,
        position: 'Timbalan Pengarah II',
        subtitle: 'Hal Ehwal Pelajar & Alumni',
        email: 'tp2ukmshape@ukm.edu.my',
        color: 'from-green-500 to-green-700',
        initials: 'II',
        tier: 2,
    },
    {
        id: 4,
        position: 'Timbalan Pengarah III',
        subtitle: 'Pemasaran & Jaringan',
        email: 'tp3ukmshape@ukm.edu.my',
        color: 'from-purple-500 to-purple-700',
        initials: 'III',
        tier: 2,
    },
    {
        id: 5,
        position: 'Timbalan Pengarah IV',
        subtitle: 'Pengurusan & Jaminan Kualiti',
        email: 'tp4ukmshape@ukm.edu.my',
        color: 'from-orange-500 to-orange-700',
        initials: 'IV',
        tier: 2,
    },
    {
        id: 6,
        position: 'Ketua Pentadbiran',
        email: 'rrozita@ukm.edu.my',
        color: 'from-pink-500 to-pink-700',
        initials: 'KP',
        tier: 3,
    },
];

interface SelectedMember {
    position: string;
    email: string;
    color: string;
    initials: string;
}

export function Login() {
    const navigate = useNavigate();
    const { mockLogin } = useAuth();
    const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelectMember = (member: typeof COMMITTEE_MEMBERS[0]) => {
        setSelectedMember({
            position: member.position,
            email: member.email,
            color: member.color,
            initials: member.initials,
        });
        setPassword('');
        setError(null);
    };

    const handleClose = () => {
        setSelectedMember(null);
        setPassword('');
        setError(null);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const getFriendlyErrorMessage = (error: any) => {
        const message = error.message || '';
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('invalid login credentials')) {
            return 'Incorrect password. Please try again.';
        }
        if (lowerMsg.includes('database error querying schema') || lowerMsg.includes('internal server error')) {
            return 'System is currently updating. Please restart the page or try again in a few minutes.';
        }
        if (lowerMsg.includes('email not confirmed')) {
            return 'Please verify your email address before logging in.';
        }
        if (lowerMsg.includes('network')) {
            return 'Network error. Please check your internet connection.';
        }

        // Default fallbacks
        return message || 'An unexpected error occurred. Please try again.';
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: selectedMember.email,
                password,
            });

            if (error) {
                console.error('Login Error:', error);
                const friendlyMsg = getFriendlyErrorMessage(error);

                // Set inline error
                setError(friendlyMsg);

                // Show popup toast
                toast.error('Login Failed', {
                    description: friendlyMsg,
                });
            } else {
                // Show welcome toast
                const userName = data.user?.user_metadata?.name || selectedMember.position;
                toast.success(`Welcome, ${userName}!`, {
                    description: 'You have successfully signed in.',
                });
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Unexpected Login Error:', err);
            const friendlyMsg = getFriendlyErrorMessage(err);
            // Set inline error
            setError(friendlyMsg);
            // Show popup toast
            toast.error('Login Failed', {
                description: friendlyMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    // Group members by tier
    const tier1 = COMMITTEE_MEMBERS.filter(m => m.tier === 1);
    const tier2 = COMMITTEE_MEMBERS.filter(m => m.tier === 2);
    const tier3 = COMMITTEE_MEMBERS.filter(m => m.tier === 3);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="w-full px-6 py-6">
                <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
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
                        Back
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Who's signing in?
                    </h1>
                    <p className="text-white/50 text-lg">
                        Select your position to continue
                    </p>
                </div>

                {/* Hierarchical Profile Cards */}
                <div className="flex flex-col items-center gap-8 max-w-4xl w-full">

                    {/* Tier 1: Pengarah (Top) */}
                    <div className="flex justify-center">
                        {tier1.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => handleSelectMember(member)}
                                className="group flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                            >
                                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-white/30`}>
                                    <span className="text-4xl font-bold text-white">
                                        {member.initials}
                                    </span>
                                </div>
                                <p className="text-white font-semibold text-lg">{member.position}</p>
                            </button>
                        ))}
                    </div>

                    {/* Connector Line */}
                    <div className="w-px h-6 bg-white/20"></div>

                    {/* Tier 2: Timbalan Pengarah (Middle) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {tier2.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => handleSelectMember(member)}
                                className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                            >
                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-white/30`}>
                                    <span className="text-2xl md:text-3xl font-bold text-white">
                                        {member.initials}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <p className="text-white/80 group-hover:text-white font-medium text-sm transition-colors">
                                        {member.position}
                                    </p>
                                    {member.subtitle && (
                                        <p className="text-white/40 text-[10px] mt-0.5 max-w-[100px] leading-tight">
                                            {member.subtitle}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Connector Line */}
                    <div className="w-px h-6 bg-white/20"></div>

                    {/* Tier 3: Ketua Pentadbiran (Bottom) */}
                    <div className="flex justify-center">
                        {tier3.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => handleSelectMember(member)}
                                className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                            >
                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-white/30`}>
                                    <span className="text-2xl md:text-3xl font-bold text-white">
                                        {member.initials}
                                    </span>
                                </div>
                                <p className="text-white/80 group-hover:text-white font-medium text-sm transition-colors">
                                    {member.position}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Demo Login Option */}
                <div className="mt-12 text-center">
                    <p className="text-white/30 text-sm mb-4">For demo purposes</p>
                    <div className="flex gap-4">
                        <button
                            onClick={async () => {
                                if (mockLogin) {
                                    await mockLogin('admin');
                                    toast.success('Welcome, Admin!', {
                                        description: 'Demo mode activated.',
                                    });
                                    navigate('/dashboard');
                                }
                            }}
                            className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                        >
                            Demo Admin
                        </button>
                        <button
                            onClick={async () => {
                                if (mockLogin) {
                                    await mockLogin('member');
                                    toast.success('Welcome, Member!', {
                                        description: 'Demo mode activated.',
                                    });
                                    navigate('/dashboard');
                                }
                            }}
                            className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                        >
                            Demo Member
                        </button>
                    </div>
                </div>
            </main>

            {/* Password Modal - Click outside to close */}
            {selectedMember && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Selected User Avatar */}
                        <div className="flex flex-col items-center mb-8">
                            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${selectedMember.color} flex items-center justify-center shadow-lg mb-4`}>
                                <span className="text-3xl font-bold text-white">
                                    {selectedMember.initials}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-white">{selectedMember.position}</h2>
                        </div>

                        {/* Password Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                    className="w-full h-14 pl-12 pr-14 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Switch User */}
                        <button
                            onClick={handleClose}
                            className="w-full mt-4 py-3 text-white/50 hover:text-white text-sm transition-colors"
                        >
                            Click outside or here to select a different profile
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="py-6 px-6 text-center text-white/30 text-sm">
                © 2024 OPARS. Universiti Kebangsaan Malaysia.
            </footer>
        </div>
    );
}
