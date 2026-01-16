import api from './api';

export enum EventStatus {
    SCHEDULED = 'SCHEDULED',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
}

export interface Event {
    id: number;
    name: string;
    description?: string;
    status: EventStatus;
    startDate: string;
    endDate?: string;
    organizerId: number;
    sportId: number;
    createdAt: string;
    updatedAt: string;
    matches?: any[];
    classifications?: any[];
    sport?: any;
    organizer?: any;
}

export interface CreateEventData {
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    sportId: number;
    organizerId: number;
}

export const eventsService = {
    getAll: async (): Promise<Event[]> => {
        const response = await api.get('/events');
        return response.data;
    },

    getById: async (id: number): Promise<Event> => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    create: async (data: CreateEventData): Promise<Event> => {
        const response = await api.post('/events', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Event>): Promise<Event> => {
        const response = await api.patch(`/events/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/events/${id}`);
    },

    getClassification: async (id: number): Promise<any[]> => {
        const response = await api.get(`/events/${id}/classification`);
        return response.data;
    },
};
