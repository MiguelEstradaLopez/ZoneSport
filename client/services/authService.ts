const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type AuthUser = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: 'ATHLETE' | 'ORGANIZER' | 'ADMIN';
};

export type LoginResponse = {
    access_token: string;
    user: AuthUser;
};

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.message || errorData.error || `Error ${response.status}`;
            throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }
        return response.json();
    },

    async register(data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.message || errorData.error || `Error ${response.status}`;
            throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }
        return response.json();
    },

    async getMe(token: string): Promise<AuthUser> {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Sesión inválida');
        return response.json();
    },

    getUser(): AuthUser | null {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    },

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('access_token');
    },

    logout(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    },
};
