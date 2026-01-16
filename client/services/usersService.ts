import api from './api';

export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export const usersService = {
    register: async (data: RegisterData): Promise<User> => {
        const response = await api.post('/users', data);
        return response.data;
    },

    getProfile: async (id: number): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    },

    updateProfile: async (id: number, data: Partial<User>): Promise<User> => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },
};
