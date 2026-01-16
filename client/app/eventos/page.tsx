'use client';

import { useEffect, useState } from 'react';
import { Event, eventsService } from '@/services/eventsService';
import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function EventosPage() {
    const [eventos, setEventos] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                const data = await eventsService.getAll();
                setEventos(data);
            } catch (err) {
                setError('Error al cargar los eventos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-400">Cargando eventos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-zs-green pl-4">
                Eventos <span className="text-zs-blue">Deportivos</span>
            </h1>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {eventos.map((evento) => (
                    <Link key={evento.id} href={`/eventos/${evento.id}`}>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-zs-blue hover:shadow-lg hover:shadow-zs-blue/20 transition-all cursor-pointer h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-zs-green text-sm font-bold uppercase px-3 py-1 bg-slate-700 rounded-full">
                                    {evento.status}
                                </span>
                                <span className="text-zs-blue text-xs font-semibold">{evento.sport?.name || 'Sin deporte'}</span>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-3">{evento.name}</h2>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{evento.description || 'Sin descripción'}</p>

                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-zs-blue" />
                                    <span>{new Date(evento.startDate).toLocaleDateString('es-ES')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-zs-green" />
                                    <span>{evento.matches?.length || 0} partidos</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {eventos.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No hay eventos disponibles</p>
                </div>
            )}
        </div>
    );
}
