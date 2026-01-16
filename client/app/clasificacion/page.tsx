'use client';

import { useEffect, useState } from 'react';
import { eventsService, Event } from '@/services/eventsService';
import { classificationsService, Classification } from '@/services/classificationsService';
import { Trophy, TrendingUp } from 'lucide-react';

export default function ClasificacionPage() {
    const [eventos, setEventos] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [clasificacion, setClasificacion] = useState<Classification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                const data = await eventsService.getAll();
                setEventos(data);
                if (data.length > 0) {
                    setSelectedEvent(data[0]);
                }
            } catch (err) {
                console.error('Error loading events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    useEffect(() => {
        if (!selectedEvent) return;

        const fetchClasificacion = async () => {
            try {
                const data = await classificationsService.getByEvent(selectedEvent.id);
                setClasificacion(data);
            } catch (err) {
                console.error('Error loading classification:', err);
            }
        };

        fetchClasificacion();
    }, [selectedEvent]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-400">Cargando clasificaciones...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Trophy className="text-zs-green" size={32} />
                Tablas de <span className="text-zs-blue">Clasificación</span>
            </h1>

            {/* Selector de eventos */}
            <div className="mb-8">
                <label className="block text-gray-400 text-sm font-semibold mb-3">Seleccionar Evento</label>
                <select
                    value={selectedEvent?.id || ''}
                    onChange={(e) => {
                        const event = eventos.find((ev) => ev.id === Number(e.target.value));
                        setSelectedEvent(event || null);
                    }}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-zs-blue outline-none"
                >
                    <option value="">Selecciona un evento</option>
                    {eventos.map((evento) => (
                        <option key={evento.id} value={evento.id}>
                            {evento.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla de clasificación */}
            {selectedEvent && (
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-6">{selectedEvent.name}</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">#</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Equipo</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">PJ</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">G</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">E</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">P</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">GF</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">GC</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">DG</th>
                                    <th className="text-center py-3 px-4 text-zs-green font-bold">PUNTOS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clasificacion.length > 0 ? (
                                    clasificacion.map((team, index) => (
                                        <tr
                                            key={team.id}
                                            className={`border-b border-slate-700 hover:bg-slate-700/50 transition-all ${index === 0 ? 'bg-zs-green/10' : ''
                                                }`}
                                        >
                                            <td className="py-4 px-4">
                                                <span className={`font-bold text-lg ${index === 0 ? 'text-zs-green' : 'text-zs-blue'}`}>
                                                    #{team.position}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-white font-semibold flex items-center gap-2">
                                                    {index === 0 && <TrendingUp size={16} className="text-zs-green" />}
                                                    {team.teamName}
                                                </span>
                                            </td>
                                            <td className="text-center py-4 px-4 text-gray-300">
                                                {team.wins + team.draws + team.losses}
                                            </td>
                                            <td className="text-center py-4 px-4 text-zs-green font-semibold">{team.wins}</td>
                                            <td className="text-center py-4 px-4 text-gray-300">{team.draws}</td>
                                            <td className="text-center py-4 px-4 text-red-400">{team.losses}</td>
                                            <td className="text-center py-4 px-4 text-gray-300">{team.goalsFor}</td>
                                            <td className="text-center py-4 px-4 text-gray-300">{team.goalsAgainst}</td>
                                            <td className="text-center py-4 px-4 text-gray-300">
                                                {team.goalsFor - team.goalsAgainst}
                                            </td>
                                            <td className="text-center py-4 px-4">
                                                <span className="text-zs-green font-bold text-lg">{team.points}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="text-center py-8 text-gray-400">
                                            No hay datos de clasificación para este evento
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <p className="text-sm text-gray-400">
                            <span className="text-gray-300 font-semibold">PJ:</span> Partidos Jugados |{' '}
                            <span className="text-gray-300 font-semibold">G:</span> Ganados |{' '}
                            <span className="text-gray-300 font-semibold">E:</span> Empatados |{' '}
                            <span className="text-gray-300 font-semibold">P:</span> Perdidos |{' '}
                            <span className="text-gray-300 font-semibold">GF:</span> Goles a Favor |{' '}
                            <span className="text-gray-300 font-semibold">GC:</span> Goles en Contra |{' '}
                            <span className="text-gray-300 font-semibold">DG:</span> Diferencia de Goles
                        </p>
                    </div>
                </div>
            )}

            {eventos.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No hay eventos disponibles</p>
                </div>
            )}
        </div>
    );
}
