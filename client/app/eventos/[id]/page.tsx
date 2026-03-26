'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

type Team = { id: string; name: string };
type Match = { id: string; team1Id?: string; team2Id?: string; team1Score?: number; team2Score?: number; scheduledDate?: string; matchStatus: string; round?: number };

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
    organizerId?: string;
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [teams, setTeams] = useState<Team[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [generating, setGenerating] = useState(false);
    const [scores, setScores] = useState<Record<string, { s1: string; s2: string; status: string }>>({});

    useEffect(() => {
        if (!tournamentId) return;

        const fetchTorneo = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/tournaments/${tournamentId}`);
                setTorneo(response.data);

                // Fetch teams and matches
                const [teamsRes, matchesRes] = await Promise.all([
                    api.get(`/tournaments/${tournamentId}/teams`).catch(() => ({ data: [] })),
                    api.get(`/tournaments/${tournamentId}/matches`).catch(() => ({ data: [] }))
                ]);
                setTeams(teamsRes.data);
                setMatches(matchesRes.data);
            } catch (err) {
                setError('Error al cargar el torneo');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTorneo();
    }, [tournamentId]);

    // Debug: Log de usuario y organizador
    console.log('user.id:', user?.id);
    console.log('organizer:', torneo?.organizer);

    // Función para eliminar torneo
    const handleDelete = async () => {
        setDeleting(true);
        setError('');

        try {
            await api.delete(`/tournaments/${tournamentId}`);
            setSuccessMessage('Evento eliminado exitosamente');
            setTimeout(() => {
                router.push('/eventos');
            }, 1500);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al eliminar el evento';
            setError(message);
            setShowDeleteConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

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

    const handleAddTeam = async () => {
        if (!newTeamName.trim() || !torneo) return;
        if (teams.length >= torneo.maxTeams) {
            setError('Se alcanzó el máximo de equipos.');
            return;
        }
        try {
            const res = await api.post(`/tournaments/${tournamentId}/teams`, { name: newTeamName });
            setTeams([...teams, res.data]);
            setNewTeamName('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveTeam = async (teamId: string) => {
        try {
            await api.delete(`/tournaments/${tournamentId}/teams/${teamId}`);
            setTeams(teams.filter(t => t.id !== teamId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerateFixture = async () => {
        if (teams.length < 2) {
             setError('Debe haber al menos 2 equipos para generar el fixture.');
             setTimeout(() => setError(''), 3000);
             return;
        }
        setGenerating(true);
        const generated: Partial<Match>[] = [];
        if (torneo?.format === 'LEAGUE' || torneo?.format === 'ROUND_ROBIN') {
            for (let i = 0; i < teams.length; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    generated.push({ team1Id: teams[i].id, team2Id: teams[j].id, round: 1, scheduledDate: new Date().toISOString() });
                }
            }
        } else if (torneo?.format === 'CASUAL_MATCH') {
            generated.push({ team1Id: teams[0].id, team2Id: teams[1].id, round: 1, scheduledDate: new Date().toISOString() });
        } else {
            // SINGLE_ELIMINATION / Others
            let r = 1;
            for (let i = 0; i < teams.length; i += 2) {
                if (teams[i+1]) {
                    generated.push({ team1Id: teams[i].id, team2Id: teams[i+1].id, round: r, scheduledDate: new Date().toISOString() });
                }
            }
        }
        
        try {
            // Eliminar anteriores si hay para simplificar (Opcional, pero asumimos generar nuevos)
            const res = await api.post(`/tournaments/${tournamentId}/matches`, generated);
            setMatches(res.data);
            setSuccessMessage('Fixture generado exitosamente.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch(err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveScore = async (matchId: string) => {
        const sc = scores[matchId];
        try {
            const res = await api.patch(`/tournaments/${tournamentId}/matches/${matchId}`, {
                team1Score: sc?.s1 ? parseInt(sc.s1) : undefined,
                team2Score: sc?.s2 ? parseInt(sc.s2) : undefined,
                matchStatus: sc?.status || 'FINISHED'
            });
            setMatches(matches.map(m => m.id === matchId ? { ...m, ...res.data } : m));
            setSuccessMessage('Resultado guardado.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error(err);
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

    const isOrganizer = user?.id === torneo.organizer?.id
        || user?.id === torneo.organizerId;
    const canJoin =
        isAuthenticated &&
        torneo.status === 'REGISTRATION_OPEN' &&
        !isOrganizer;

    return (
        <main className="min-h-screen bg-zinc-900 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Modal de Confirmación de Eliminación */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 max-w-sm">
                            <h2 className="text-2xl font-bold mb-4 text-white">Eliminar Evento</h2>
                            <p className="text-zinc-300 mb-6">
                                ¿Estás seguro? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={deleting}
                                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white font-semibold py-2 rounded transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 rounded transition"
                                >
                                    {deleting ? 'Eliminando...' : 'Sí, Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                            <span className="text-zinc-400">Ubicación:</span>{' '}
                                            {torneo.locationAddress.startsWith('http') ? (
                                                <a
                                                    href={torneo.locationAddress}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-semibold text-green-400 hover:text-green-300 transition underline"
                                                >
                                                    Ver en mapa →
                                                </a>
                                            ) : (
                                                <span className="font-semibold">{torneo.locationAddress}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Organizador */}
                        {torneo.organizer && (
                            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
                                <h2 className="text-lg font-bold mb-3">👤 Organizador</h2>
                                <p className="font-semibold">
                                    {torneo.organizer.firstName} {torneo.organizer.lastName}
                                </p>
                                <p className="text-zinc-400 text-sm">{torneo.organizer.email}</p>
                            </div>
                        )}

                        {/* SECCIÓN 1 — "Equipos" */}
                        {isOrganizer && (
                            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
                                <h2 className="text-2xl font-bold mb-4">🛡️ Equipos</h2>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre del equipo"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                        className="bg-zinc-700 text-white px-4 py-2 rounded-lg outline-none flex-1"
                                    />
                                    <button
                                        onClick={handleAddTeam}
                                        disabled={teams.length >= torneo.maxTeams || !newTeamName.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold"
                                    >
                                        Agregar equipo
                                    </button>
                                </div>
                                <p className="text-sm text-zinc-400 mb-4">{teams.length} / {torneo.maxTeams} equipos registrados</p>
                                <ul className="space-y-2">
                                    {teams.map(t => (
                                        <li key={t.id} className="bg-zinc-700 rounded-md p-3 flex justify-between items-center">
                                            <span>{t.name}</span>
                                            <button onClick={() => handleRemoveTeam(t.id)} className="text-red-400 hover:text-red-300">✕</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* SECCIÓN 2 — "Partidos / Fixture" */}
                        {isOrganizer && (
                            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">⚔️ Partidos / Fixture</h2>
                                    <button
                                        onClick={handleGenerateFixture}
                                        disabled={generating || teams.length < 2}
                                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold"
                                    >
                                        {generating ? 'Generando...' : 'Generar partidos'}
                                    </button>
                                </div>
                                
                                {matches.length === 0 ? (
                                    <p className="text-zinc-400 text-center py-4">No hay partidos generados aún.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {matches.reduce((acc, match) => {
                                            const round = match.round || 1;
                                            if (!acc[round]) acc[round] = [];
                                            acc[round].push(match);
                                            return acc;
                                        }, {} as Record<number, Match[]>)[1] && Object.entries(
                                            matches.reduce((acc, match) => {
                                                const round = match.round || 1;
                                                if (!acc[round]) acc[round] = [];
                                                acc[round].push(match);
                                                return acc;
                                            }, {} as Record<number, Match[]>)
                                        ).map(([roundStr, roundMatches]) => (
                                            <div key={roundStr}>
                                                <h3 className="font-bold text-zinc-300 mb-2 border-b border-zinc-700 pb-1">Ronda {roundStr}</h3>
                                                <div className="space-y-3">
                                                    {roundMatches.map(m => {
                                                        const sc = scores[m.id] || { s1: m.team1Score?.toString() || '', s2: m.team2Score?.toString() || '', status: m.matchStatus || 'PENDING' };
                                                        
                                                        return (
                                                            <div key={m.id} className="bg-zinc-700 p-3 rounded-lg border border-zinc-600">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-xs text-zinc-400">
                                                                        {m.scheduledDate ? new Date(m.scheduledDate).toLocaleString() : 'Sin fecha'}
                                                                    </span>
                                                                    <select
                                                                        value={sc.status}
                                                                        onChange={(e) => setScores({ ...scores, [m.id]: { ...sc, status: e.target.value } })}
                                                                        className="bg-zinc-800 text-xs px-2 py-1 rounded text-white outline-none border border-zinc-500"
                                                                    >
                                                                        <option value="PENDING">Pendiente</option>
                                                                        <option value="IN_PROGRESS">En curso</option>
                                                                        <option value="FINISHED">Finalizado</option>
                                                                    </select>
                                                                </div>

                                                                <div className="flex items-center justify-between gap-4">
                                                                    <div className="flex-1 flex flex-col gap-1">
                                                                        <select
                                                                            value={m.team1Id || ''}
                                                                            disabled
                                                                            className="bg-zinc-800 p-2 rounded text-sm w-full outline-none opacity-80"
                                                                        >
                                                                            <option value="">--</option>
                                                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <span className="font-bold text-zinc-500">vs</span>
                                                                    <div className="flex-1 flex flex-col gap-1">
                                                                        <select
                                                                            value={m.team2Id || ''}
                                                                            disabled
                                                                            className="bg-zinc-800 p-2 rounded text-sm w-full outline-none opacity-80"
                                                                        >
                                                                            <option value="">--</option>
                                                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                {(sc.status === 'FINISHED' || m.matchStatus === 'FINISHED') && (
                                                                    <div className="mt-3 flex gap-2 items-center">
                                                                        <input
                                                                            type="number"
                                                                            value={sc.s1}
                                                                            onChange={(e) => setScores({ ...scores, [m.id]: { ...sc, s1: e.target.value } })}
                                                                            className="w-16 bg-zinc-800 text-center rounded p-1 flex-1"
                                                                            placeholder="Sc 1"
                                                                        />
                                                                        <span>-</span>
                                                                        <input
                                                                            type="number"
                                                                            value={sc.s2}
                                                                            onChange={(e) => setScores({ ...scores, [m.id]: { ...sc, s2: e.target.value } })}
                                                                            className="w-16 bg-zinc-800 text-center rounded p-1 flex-1"
                                                                            placeholder="Sc 2"
                                                                        />
                                                                        <button
                                                                            onClick={() => handleSaveScore(m.id)}
                                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                                        >
                                                                            Guardar
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                
                                                                {m.matchStatus !== 'FINISHED' && (
                                                                      <div className="mt-3 flex justify-end">
                                                                          <button
                                                                              onClick={() => handleSaveScore(m.id)}
                                                                              className="bg-zinc-600 hover:bg-zinc-500 text-white px-3 py-1 rounded text-sm"
                                                                          >
                                                                              Actualizar Estado
                                                                          </button>
                                                                      </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                            <div className="space-y-2">
                                <button
                                    onClick={() => router.push(`/eventos/${tournamentId}/editar`)}
                                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-lg transition"
                                >
                                    ✎ Editar Evento
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                                >
                                    🗑 Eliminar Evento
                                </button>
                            </div>
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
