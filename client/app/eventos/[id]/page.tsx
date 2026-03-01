'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

type Tournament = {
    id: string;
    name: string;
    description?: string;
    format: string;
    status: string;
    startDate: string;
    endDate?: string;
    maxTeams: number;
    locationName?: string;
    locationAddress?: string;
    registrationDeadline?: string;
    isPublic: boolean;
    organizer?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    createdAt?: string;
};

// Función para obtener color del estado
const getStatusColor = (status: string) => {
    switch (status) {
        case 'DRAFT':
            return 'bg-gray-600';
        case 'REGISTRATION_OPEN':
            return 'bg-green-600';
        case 'IN_PROGRESS':
            return 'bg-blue-600';
        case 'FINISHED':
            return 'bg-red-600';
        default:
            return 'bg-zinc-700';
    }
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        DRAFT: 'Borrador',
        REGISTRATION_OPEN: 'Inscripciones Abiertas',
        IN_PROGRESS: 'En Progreso',
        FINISHED: 'Finalizado',
        CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
};

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const tournamentId = params?.id as string;

    const [torneo, setTorneo] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        if (!tournamentId) return;

        const fetchTorneo = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/tournaments/${tournamentId}`);
                setTorneo(response.data);
            } catch (err) {
                setError('Error al cargar el torneo');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTorneo();
    }, [tournamentId]);

    // Función para unirse al torneo
    const handleJoin = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        setJoining(true);
        setError('');
        setSuccessMessage('');

        try {
            await api.post(`/tournaments/${tournamentId}/join`);
            setSuccessMessage('¡Te has unido exitosamente al evento!');
            // Recargar datos del torneo después de unirse
            const response = await api.get(`/tournaments/${tournamentId}`);
            setTorneo(response.data);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al unirse al evento';
            setError(message);
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-xl">Cargando evento...</div>
                </div>
            </main>
        );
    }

    if (error && !torneo) {
        return (
            <main className="min-h-screen bg-zinc-900 text-white p-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="mb-6 text-zinc-400 hover:text-white"
                    >
                        ← Volver
                    </button>
                    <div className="bg-red-900 text-red-100 p-4 rounded-lg border border-red-700">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!torneo) {
        return (
            <main className="min-h-screen bg-zinc-900 text-white p-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="mb-6 text-zinc-400 hover:text-white"
                    >
                        ← Volver
                    </button>
                    <p className="text-zinc-400">Evento no encontrado</p>
                </div>
            </main>
        );
    }

    const isOrganizer = user?.id === torneo.organizer?.id;
    const canJoin =
        isAuthenticated &&
        torneo.status === 'REGISTRATION_OPEN' &&
        !isOrganizer;

    return (
        <main className="min-h-screen bg-zinc-900 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Botón Volver */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-zinc-400 hover:text-white transition"
                >
                    ← Volver a eventos
                </button>

                {/* Mensajes */}
                {error && (
                    <div className="bg-red-900 text-red-100 p-4 rounded-lg border border-red-700 mb-6">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-900 text-green-100 p-4 rounded-lg border border-green-700 mb-6">
                        {successMessage}
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-2">{torneo.name}</h1>
                            <span
                                className={`inline-block px-4 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
                                    torneo.status
                                )}`}
                            >
                                {getStatusLabel(torneo.status)}
                            </span>
                        </div>
                    </div>

                    {torneo.description && (
                        <p className="text-zinc-300 text-lg">{torneo.description}</p>
                    )}
                </div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Información principal */}
                    <div className="lg:col-span-2">
                        {/* Información General */}
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Información General</h2>

                            <div className="space-y-4">
                                {/* Tipo */}
                                <div>
                                    <span className="text-zinc-400">Tipo:</span>{' '}
                                    <span className="font-semibold">
                                        {torneo.format === 'CASUAL_MATCH' ? 'Partido Amistoso' : `Torneo (${torneo.format})`}
                                    </span>
                                </div>

                                {/* Fechas */}
                                <div>
                                    <span className="text-zinc-400">Inicio:</span>{' '}
                                    <span className="font-semibold">
                                        {new Date(torneo.startDate).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>

                                {torneo.endDate && (
                                    <div>
                                        <span className="text-zinc-400">Fin:</span>{' '}
                                        <span className="font-semibold">
                                            {new Date(torneo.endDate).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}

                                {torneo.registrationDeadline && (
                                    <div>
                                        <span className="text-zinc-400">Límite de Inscripción:</span>{' '}
                                        <span className="font-semibold">
                                            {new Date(torneo.registrationDeadline).toLocaleDateString('es-ES')}
                                        </span>
                                    </div>
                                )}

                                {/* Equipos */}
                                <div>
                                    <span className="text-zinc-400">Máximo de Equipos:</span>{' '}
                                    <span className="font-semibold">{torneo.maxTeams}</span>
                                </div>

                                {/* Privacidad */}
                                <div>
                                    <span className="text-zinc-400">Visibilidad:</span>{' '}
                                    <span className="font-semibold">
                                        {torneo.isPublic ? 'Público' : 'Privado'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Ubicación */}
                        {(torneo.locationName || torneo.locationAddress) && (
                            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
                                <h2 className="text-2xl font-bold mb-4">📍 Ubicación</h2>

                                <div className="space-y-2">
                                    {torneo.locationName && (
                                        <div>
                                            <span className="text-zinc-400">Nombre:</span>{' '}
                                            <span className="font-semibold">{torneo.locationName}</span>
                                        </div>
                                    )}
                                    {torneo.locationAddress && (
                                        <div>
                                            <span className="text-zinc-400">Dirección:</span>{' '}
                                            <span className="font-semibold">{torneo.locationAddress}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Organizador */}
                        {torneo.organizer && (
                            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                                <h2 className="text-lg font-bold mb-3">👤 Organizador</h2>
                                <p className="font-semibold">
                                    {torneo.organizer.firstName} {torneo.organizer.lastName}
                                </p>
                                <p className="text-zinc-400 text-sm">{torneo.organizer.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Panel Lateral */}
                    <div>
                        {/* Botones de Acción */}
                        {canJoin ? (
                            <button
                                onClick={handleJoin}
                                disabled={joining}
                                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition mb-4"
                            >
                                {joining ? 'Uniéndose...' : '✓ Unirse al Evento'}
                            </button>
                        ) : !isAuthenticated ? (
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition mb-4"
                            >
                                Iniciar Sesión
                            </button>
                        ) : null}

                        {isOrganizer && (
                            <button
                                onClick={() => router.push(`/eventos/${tournamentId}/editar`)}
                                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-lg transition"
                            >
                                ✎ Editar Evento
                            </button>
                        )}

                        {/* Información General (Card) */}
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mt-6">
                            <h3 className="font-bold mb-3">Resumen Rápido</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Estado:</span>
                                    <span className="font-semibold">
                                        {getStatusLabel(torneo.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Equipos Máx:</span>
                                    <span className="font-semibold">{torneo.maxTeams}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Tipo:</span>
                                    <span className="font-semibold">
                                        {torneo.format === 'CASUAL_MATCH' ? 'Amistoso' : 'Torneo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
