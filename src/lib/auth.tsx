import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

type Role = 'admin' | 'member';

interface User {
    id: string;
    email: string;
    role: Role;
    department: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id, session.user.email!);
            else setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchProfile(session.user.id, session.user.email!);
            else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function fetchProfile(userId: string, email: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                // Fallback or handle error - maybe user exists in Auth but not in profiles table yet
            } else if (data) {
                setUser({
                    id: data.id,
                    email: data.email || email,
                    role: data.role as Role,
                    department: data.department,
                });
            }
        } catch (error) {
            console.error('Unexpected error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
