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
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-400">Cargando evento...</p>
            </div>
        );
    }

    if (error || !evento) {
        return (
            <div className="p-8">
                <p className="text-red-400">{error || 'Evento no encontrado'}</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header del evento */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">{evento.name}</h1>
                <p className="text-gray-400">{evento.description}</p>
                <span className="inline-block mt-4 px-3 py-1 bg-zs-blue/20 text-zs-blue rounded-full text-sm font-semibold">
                    {evento.status}
                </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Partidos */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Zap className="text-zs-blue" size={24} />
                            Partidos
                        </h2>

                        <div className="space-y-4">
                            {matches.length > 0 ? (
                                matches.map((match) => (
                                    <div key={match.id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-zs-blue transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-white font-semibold">{match.teamA}</p>
                                            </div>
                                            <div className="mx-4 text-center">
                                                {match.scoreA !== null && match.scoreB !== null ? (
                                                    <span className="text-2xl font-bold text-zs-green">
                                                        {match.scoreA} - {match.scoreB}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">vs</span>
                                                )}
                                            </div>
                                            <div className="flex-1 text-right">
                                                <p className="text-white font-semibold">{match.teamB}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-xs mt-2">
                                            {new Date(match.scheduledDate).toLocaleDateString('es-ES')} - {match.status}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No hay partidos registrados</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Clasificación */}
                <div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Trophy className="text-zs-green" size={24} />
                            Tabla
                        </h2>

                        <div className="space-y-3">
                            {clasificacion.length > 0 ? (
                                clasificacion.map((team) => (
                                    <div key={team.id} className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-lg text-zs-blue">#{team.position}</span>
                                            <span className="font-semibold text-white text-sm">{team.teamName}</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 text-xs text-center">
                                            <div>
                                                <p className="text-gray-400">PJ</p>
                                                <p className="text-white font-bold">{team.wins + team.draws + team.losses}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">G</p>
                                                <p className="text-zs-green font-bold">{team.wins}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">GF</p>
                                                <p className="text-white font-bold">{team.goalsFor}</p>
                                            </div>
                                            <div>
                                                <p className="text-zs-green font-bold">{team.points} pts</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm">No hay clasificación</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
