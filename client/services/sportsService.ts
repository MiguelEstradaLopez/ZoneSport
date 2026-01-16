import api from './api';

export interface Sport {
    id: number;
    name: string;
    description?: string;
    classificationRules: {
        pointsForWin: number;
        pointsForDraw: number;
        pointsForLoss: number;
    };
}

export const sportsService = {
    getAll: async (): Promise<Sport[]> => {
        const response = await api.get('/sports');
        return response.data;
    },

    getById: async (id: number): Promise<Sport> => {
        const response = await api.get(`/sports/${id}`);
        return response.data;
    },

    create: async (data: Partial<Sport>): Promise<Sport> => {
        const response = await api.post('/sports', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Sport>): Promise<Sport> => {
        const response = await api.patch(`/sports/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/sports/${id}`);
    },
};
