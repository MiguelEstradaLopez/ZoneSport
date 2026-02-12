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
            <main className="page-container flex items-center justify-center">
                <p className="text-muted">Cargando eventos...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-container">
                <div className="content-wrapper">
                    <p className="text-red-400">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="page-container">
            <div className="content-wrapper">
                <header className="mb-8">
                    <h1 className="flex items-center gap-3 mb-2">
                        Eventos <span className="text-zs-green">Deportivos</span>
                    </h1>
                    <div className="divider mt-4" />
                </header>

                <article className="grid-container">
                    {eventos.map((evento) => (
                        <Link key={evento.id} href={`/eventos/${evento.id}`}>
                            <article className="card h-full cursor-pointer">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="badge">{evento.status}</span>
                                    <span className="text-xs font-semibold text-zs-blue">{evento.sport?.name || 'Sin deporte'}</span>
                                </div>
                                <h2 className="heading-md mb-3">{evento.name}</h2>
                                <p className="text-muted text-sm mb-4 line-clamp-2">{evento.description || 'Sin descripción'}</p>

                                <div className="space-y-2 text-sm text-zs-text-secondary">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-zs-blue" />
                                        <time>{new Date(evento.startDate).toLocaleDateString('es-ES')}</time>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-zs-green" />
                                        <span>{evento.matches?.length || 0} partidos</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </article>

                {eventos.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted">No hay eventos disponibles</p>
                    </div>
                )}
            </div>
        </main>
    );
}
