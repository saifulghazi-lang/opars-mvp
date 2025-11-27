import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/auth';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const { signOut } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: FileText, label: 'Proposals', path: '/proposals' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold tracking-tight text-primary">OPARS</h1>
                    <p className="text-xs text-muted-foreground mt-1">Command Center</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-background">
                <div className="container mx-auto p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
