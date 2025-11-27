import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'admin' | 'member';

interface User {
    id: string;
    email: string;
    role: Role;
    department: string;
}

interface AuthContextType {
    user: User | null;
    loginAsAdmin: () => void;
    loginAsMember: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ADMIN: User = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    email: 'admin@opars.com',
    role: 'admin',
    department: 'Secretariat',
};

const MOCK_MEMBER: User = {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    email: 'member@opars.com',
    role: 'member',
    department: 'Finance',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Auto-login as admin for dev convenience, or check local storage
    useEffect(() => {
        const storedRole = localStorage.getItem('opars_role');
        if (storedRole === 'admin') setUser(MOCK_ADMIN);
        else if (storedRole === 'member') setUser(MOCK_MEMBER);
        else setUser(MOCK_ADMIN); // Default to admin for MVP
    }, []);

    const loginAsAdmin = () => {
        setUser(MOCK_ADMIN);
        localStorage.setItem('opars_role', 'admin');
    };

    const loginAsMember = () => {
        setUser(MOCK_MEMBER);
        localStorage.setItem('opars_role', 'member');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('opars_role');
    };

    return (
        <AuthContext.Provider value={{ user, loginAsAdmin, loginAsMember, logout }}>
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
