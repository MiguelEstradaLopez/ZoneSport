import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';


import { type AuthUser, authService } from '@/services/authService';

interface AuthContextProps {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
    logout: () => void;
}



const AuthContext = createContext<AuthContextProps | undefined>(undefined);


type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = authService.getToken();
        if (storedToken) {
            authService.getMe(storedToken)
                .then((userData) => {
                    setUser(userData);
                    setToken(storedToken);
                })
                .catch(() => {
                    setUser(null);
                    setToken(null);
                    authService.logout();
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { access_token, user } = await authService.login(email, password);
            setToken(access_token);
            setUser(user);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
        setIsLoading(true);
        try {
            const { access_token, user } = await authService.register(data);
            setToken(access_token);
            setUser(user);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
