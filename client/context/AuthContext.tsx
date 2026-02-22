"use client";
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
        const storedUser = authService.getUser();
        console.log('[AUTH INIT] storedToken:', storedToken ? 'EXISTS' : 'NULL');
        console.log('[AUTH INIT] storedUser:', storedUser ? 'EXISTS' : 'NULL');
        if (storedToken && storedUser) {
            authService.getMe(storedToken)
                .then((userData) => {
                    console.log('[AUTH INIT] getMe success');
                    setUser(userData);
                    setToken(storedToken);
                    // Refrescar localStorage y cookie por si el usuario cambió
                    localStorage.setItem('access_token', storedToken);
                    localStorage.setItem('user', JSON.stringify(userData));
                    document.cookie = `access_token=${storedToken}; path=/; max-age=86400`;
                })
                .catch((error) => {
                    console.log('[AUTH INIT] getMe failed, error:', error);
                    // Si getMe falla pero tenemos datos en localStorage,
                    // restaurar sesión desde localStorage sin validar
                    // (el backend validará en la próxima petición protegida)
                    if (storedUser) {
                        setUser(storedUser);
                        setToken(storedToken);
                    } else {
                        setUser(null);
                        setToken(null);
                        authService.logout();
                    }
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
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            document.cookie = `access_token=${access_token}; path=/; max-age=86400`;
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
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            document.cookie = `access_token=${access_token}; path=/; max-age=86400`;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
        document.cookie = 'access_token=; path=/; max-age=0';
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
