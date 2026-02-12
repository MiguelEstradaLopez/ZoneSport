'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { eventsService, Event } from '@/services/eventsService';
import { matchesService, Match } from '@/services/matchesService';
import { classificationsService, Classification } from '@/services/classificationsService';
import { Trophy, Zap } from 'lucide-react';

export default function EventDetailPage() {
    const params = useParams();
    const eventId = Number(params?.id);
    const [evento, setEvento] = useState<Event | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [clasificacion, setClasificacion] = useState<Classification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!eventId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [eventData, matchesData, clasificacionData] = await Promise.all([
                    eventsService.getById(eventId),
                    matchesService.getByEvent(eventId),
                    classificationsService.getByEvent(eventId),
                ]);
                setEvento(eventData);
                setMatches(matchesData);
                setClasificacion(clasificacionData);
            } catch (err) {
                setError('Error al cargar los datos del evento');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    if (loading) {
        return (
            <main className="page-container flex items-center justify-center">
                <p className="text-muted">Cargando evento...</p>
            </main>
        );
    }

    if (error || !evento) {
        return (
            <main className="page-container">
                <div className="content-wrapper">
                    <p className="text-red-400">{error || 'Evento no encontrado'}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="page-container">
            <div className="content-wrapper">
                {/* Header del evento */}
                <header className="mb-8">
                    <h1 className="mb-2">{evento.name}</h1>
                    <p className="text-muted">{evento.description}</p>
                    <span className="badge mt-4">
                        {evento.status}
                    </span>
                </header>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Partidos */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="flex items-center gap-2">
                                    <Zap className="text-zs-blue" size={24} />
                                    Partidos
                                </h2>
                            </div>

                            <div className="card-body">
                                <div className="space-y-4">
                                    {matches.length > 0 ? (
                                        matches.map((match) => (
                                            <div key={match.id} className="match-item">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{match.teamA}</p>
                                                    </div>
                                                    <div className="mx-4 text-center">
                                                        {match.scoreA !== null && match.scoreB !== null ? (
                                                            <span className="text-2xl font-bold text-zs-green">
                                                                {match.scoreA} - {match.scoreB}
                                                            </span>
                                                        ) : (
                                                            <span className="text-zs-text-secondary">vs</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 text-right">
                                                        <p className="font-semibold">{match.teamB}</p>
                                                    </div>
                                                </div>
                                                <p className="text-text-muted text-xs mt-2">
                                                    {new Date(match.scheduledDate).toLocaleDateString('es-ES')} - {match.status}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No hay partidos registrados</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clasificación */}
                    <div>
                        <div className="card">
                            <div className="card-header">
                                <h2 className="flex items-center gap-2">
                                    <Trophy className="text-zs-green" size={24} />
                                    Tabla
                                </h2>
                            </div>

                            <div className="card-body">
                                <div className="space-y-3">
                                    {clasificacion.length > 0 ? (
                                        clasificacion.map((team) => (
                                            <div key={team.id} className="team-card\">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-lg text-zs-blue">#{team.position}</span>
                                                    <span className="font-semibold text-sm">{team.teamName}</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 text-xs text-center">
                                                    <div>
                                                        <p className="text-zs-text-secondary">PJ</p>
                                                        <p className="font-bold">{team.wins + team.draws + team.losses}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zs-text-secondary">G</p>
                                                        <p className="text-zs-green font-bold">{team.wins}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zs-text-secondary">GF</p>
                                                        <p className="font-bold">{team.goalsFor}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zs-green font-bold">{team.points} pts</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-sm">No hay clasificación</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
