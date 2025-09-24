'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';

type AppUser = NonNullable<ReturnType<typeof useSession>['data']>['user'];

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

    const user = session?.user || null;
    const isAuthenticated = status === 'authenticated';
    const isCompanyConfigured = !!user?.companyId;

    const isPremium = user?.subscriptionStatus === 'PREMIUM';

    const logout = () => {
        signOut({ callbackUrl: '/' });
    };

    const value = {
        user,
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