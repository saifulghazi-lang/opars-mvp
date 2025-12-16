import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/auth';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const { signOut, user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Proposals', path: '/proposals' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 text-foreground font-sans">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">O</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white">OPARS</h1>
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Premium Design */}
            <aside className={cn(
                "w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col transition-transform duration-300 z-50 shadow-2xl",
                "md:relative md:translate-x-0",
                "fixed inset-y-0 left-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-xl">O</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">OPARS</h1>
                            <p className="text-xs text-white/50 font-medium">Proposal Management</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
                            <span className="text-white font-medium text-sm">
                                {user?.email?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.email || 'User'}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                                    user?.role === 'admin'
                                        ? "bg-primary/20 text-primary"
                                        : "bg-secondary/20 text-blue-400"
                                )}>
                                    {user?.role || 'member'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <p className="px-3 py-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path === '/proposals' && location.pathname.startsWith('/proposals'));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                                        : "text-white/60 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                                {isActive && (
                                    <Sparkles className="w-4 h-4 ml-auto animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Decorative Element */}
                <div className="px-4 py-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-white">Pro Tips</span>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed">
                            Use filters to quickly find proposals by status or department.
                        </p>
                    </div>
                </div>

                {/* Sign Out */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-50 pt-16 md:pt-0">
                <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
