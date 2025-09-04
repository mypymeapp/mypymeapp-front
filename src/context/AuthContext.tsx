'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    nombreEmpresa: string;
    logoUrl: string | null;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isPremium: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUserLogo: (logoUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const mockUser: User = { 
      id: 'user-123', 
      email: 'usuario@premium.com', 
      nombreEmpresa: 'TecnoComponentes S.L.',
      logoUrl: null 
    };

    const [user, setUser] = useState<User | null>(mockUser);
    const [isPremium, setIsPremium] = useState<boolean>(true);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const updateUserLogo = (logoUrl: string) => {
        if (user) {
            setUser({ ...user, logoUrl });
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isPremium,
        login,
        logout,
        updateUserLogo,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};