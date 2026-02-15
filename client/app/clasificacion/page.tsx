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
            <main className="page-container flex items-center justify-center">
                <p className="text-muted">Cargando clasificaciones...</p>
            </main>
        );
    }

    return (
        <main className="page-container">
            <div className="content-wrapper max-w-4xl">
                <header className="mb-8">
                    <h1 className="flex items-center gap-3">
                        <Trophy className="text-zs-green" size={32} />
                        Tablas de <span className="text-zs-green">Clasificación</span>
                    </h1>
                </header>

                {/* Selector de eventos */}
                <form className="form-group mb-8">
                    <label className="form-label">Seleccionar Evento</label>
                    <select
                        value={selectedEvent?.id || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const event = eventos.find((ev) => ev.id === Number(e.target.value));
                            setSelectedEvent(event || null);
                        }}
                        className="form-select"
                    >
                        <option value="">Selecciona un evento</option>
                        {eventos.map((evento) => (
                            <option key={evento.id} value={evento.id}>
                                {evento.name}
                            </option>
                        ))}
                    </select>
                </form>

                {/* Tabla de clasificación */}
                {selectedEvent && (
                    <article className="card">
                        <div className="card-header">
                            <h2>{selectedEvent.name}</h2>
                        </div>

                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="table-header">
                                            <th className="text-left py-3 px-4 text-zs-text-secondary font-semibold">#</th>
                                            <th className="text-left py-3 px-4 text-zs-text-secondary font-semibold">Equipo</th>
                                            <th className="text-center py-3 px-4 text-zs-text-secondary font-semibold">PJ</th>
                                            <th className="text-center py-3 px-4 text-zs-text-secondary font-semibold">G</th>
                                            <th className="text-center py-3 px-4 text-zs-text-secondary font-semibold">E</th>
                                            <th className="text-center py-3 px-4 text-zs-text-secondary font-semibold">P</th>
                                            <th className="text-center py-3 px-4 text-zs-text-secondary font-semibold">GF</th>
                                            <th className="text-center py-3 px-4 text-zs-text-secondary font-semibold">GC</th>
                                            <th className="text-center py-3 px-4 text-zs-text-secondary font-semibold">DG</th>
                                            <th className="text-center py-3 px-4 text-zs-green font-bold">PUNTOS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clasificacion.length > 0 ? (
                                            clasificacion.map((team, index) => (
                                                <tr
                                                    key={team.id}
                                                    className={`table-row ${index === 0 ? 'table-row-leader' : ''}`}
                                                >
                                                    <td className="table-cell">
                                                        <span className={`font-bold text-lg ${index === 0 ? 'text-zs-green' : 'text-zs-blue'}`}>
                                                            #{team.position}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="font-semibold flex items-center gap-2">
                                                            {index === 0 && <TrendingUp size={16} className="text-zs-green" />}
                                                            {team.teamName}
                                                        </span>
                                                    </td>
                                                    <td className="text-center py-4 px-4 text-zs-text-secondary">
                                                        {team.wins + team.draws + team.losses}
                                                    </td>
                                                    <td className="text-center py-4 px-4 text-zs-green font-semibold">{team.wins}</td>
                                                    <td className="text-center py-4 px-4 text-zs-text-secondary">{team.draws}</td>
                                                    <td className="text-center py-4 px-4 text-red-400">{team.losses}</td>
                                                    <td className="text-center py-4 px-4 text-zs-text-secondary">{team.goalsFor}</td>
                                                    <td className="text-center py-4 px-4 text-zs-text-secondary">{team.goalsAgainst}</td>
                                                    <td className="text-center py-4 px-4 text-zs-text-secondary">
                                                        {team.goalsFor - team.goalsAgainst}
                                                    </td>
                                                    <td className="text-center py-4 px-4">
                                                        <span className="text-zs-green font-bold text-lg">{team.points}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={10} className="text-center py-8 text-zs-text-secondary">
                                                    No hay datos de clasificación para este evento
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <footer className="card-body">
                            <p className="text-sm text-zs-text-secondary">
                                <span className="text-zs-text font-semibold">PJ:</span> Partidos Jugados |{' '}
                                <span className="text-zs-text font-semibold">G:</span> Ganados |{' '}
                                <span className="text-zs-text font-semibold">E:</span> Empatados |{' '}
                                <span className="text-zs-text font-semibold">P:</span> Perdidos |{' '}
                                <span className="text-zs-text font-semibold">GF:</span> Goles a Favor |{' '}
                                <span className="text-zs-text font-semibold">GC:</span> Goles en Contra |{' '}
                                <span className="text-zs-text font-semibold">DG:</span> Diferencia de Goles
                            </p>
                        </footer>
                    </article>
                )}

                {eventos.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted">No hay eventos disponibles</p>
                    </div>
                )}
            </div>
        </main>
    );
}
