'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface AppUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    companyName?: string | null;
    role?: string;
    logoUrl?: string | null;
}

interface AuthContextType {
    user: AppUser | null;
    isAuthenticated: boolean;
    isCompanyConfigured: boolean;
    isPremium: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { data: session, status } = useSession();
    const [appUser, setAppUser] = useState<AppUser | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setAppUser(session.user);
        } else {
            setAppUser(null);
        }
    }, [session, status]);

    const isAuthenticated = status === 'authenticated';
    const isCompanyConfigured = !!appUser?.companyName;
    const isPremium = isAuthenticated;

    const logout = () => {
        signOut({ callbackUrl: '/' });
    };

    const value = {
        user: appUser,
        isAuthenticated,
        isCompanyConfigured,
        isPremium,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};