import api from './api';

export enum MatchStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    PLAYED = 'PLAYED',
}

export interface Match {
    id: number;
    teamA: string;
    teamB: string;
    scoreA?: number;
    scoreB?: number;
    status: MatchStatus;
    scheduledDate: string;
    eventId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMatchData {
    teamA: string;
    teamB: string;
    scheduledDate: string;
    eventId: number;
    scoreA?: number;
    scoreB?: number;
    status?: MatchStatus;
}

export interface RecordResultData {
    teamName: string;
    scoreA: number;
    scoreB: number;
    matchId?: number;
}

export const matchesService = {
    getAll: async (): Promise<Match[]> => {
        const response = await api.get('/matches');
        return response.data;
    },

    getById: async (id: number): Promise<Match> => {
        const response = await api.get(`/matches/${id}`);
        return response.data;
    },

    getByEvent: async (eventId: number): Promise<Match[]> => {
        const response = await api.get(`/matches/event/${eventId}`);
        return response.data;
    },

    create: async (data: CreateMatchData): Promise<Match> => {
        const response = await api.post('/matches', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Match>): Promise<Match> => {
        const response = await api.patch(`/matches/${id}`, data);
        return response.data;
    },

    recordResult: async (id: number, data: RecordResultData): Promise<Match> => {
        const response = await api.post(`/matches/${id}/result`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/matches/${id}`);
    },
};
