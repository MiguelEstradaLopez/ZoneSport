import api from './api';

export interface Classification {
    id: number;
    teamName: string;
    points: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    position: number;
    eventId: number;
    createdAt: string;
    updatedAt: string;
}

export const classificationsService = {
    getByEvent: async (eventId: number): Promise<Classification[]> => {
        const response = await api.get(`/classifications/event/${eventId}`);
        return response.data;
    },

    create: async (eventId: number, teamName: string): Promise<Classification> => {
        const response = await api.post(`/classifications/event/${eventId}/team`, {
            teamName,
        });
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/classifications/${id}`);
    },
};
