import api from './api';

export interface Tournament {
    id: string;
    name: string;
    format?: string;
    status?: string;
    startDate?: string;
    maxTeams?: number;
    locationName?: string;
}

export const tournamentsService = {
    getAll: async (): Promise<Tournament[]> => {
        const response = await api.get('/tournaments');
        return response.data;
    },
    getById: async (id: string): Promise<Tournament> => {
        const response = await api.get(`/tournaments/${id}`);
        return response.data;
    },
};
