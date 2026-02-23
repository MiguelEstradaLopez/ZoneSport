'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tournamentsService } from '@/services/tournamentsService';
import Link from 'next/link';

type Tournament = {
  id: string;
  name: string;
  format?: string;
  status?: string;
  startDate?: string;
  maxTeams?: number;
  locationName?: string;
};

export default function EventosPage() {
  const { user } = useAuth();
  const [torneos, setTorneos] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        setLoading(true);
        const data = await tournamentsService.getAll();
        setTorneos(data);
      } catch (err) {
        setError('Error al cargar los torneos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTorneos();
  }, []);

  if (loading) {
    return (
      <main className="page-container flex items-center justify-center">
        <p className="text-muted">Cargando eventos deportivos...</p>
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
        <header className="mb-8 flex items-center justify-between">
          <h1 className="flex items-center gap-3 mb-2">
            Eventos <span className="text-zs-green">Deportivos</span>
          </h1>
          {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
            <Link href="/crear-evento" className="btn btn-primary">
              Crear Evento
            </Link>
          )}
        </header>

        {torneos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted mb-4">No hay eventos disponibles por el momento.</p>
            {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
              <Link href="/crear-evento" className="btn btn-primary">
                Crear el primer evento
              </Link>
            )}
          </div>
        ) : (
          <article className="grid-container">
            {torneos.map((torneo) => (
              <div key={torneo.id} className="card h-full flex flex-col">
                <h2 className="heading-md mb-2">{torneo.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {torneo.format && (
                    <span className="badge bg-zinc-800 text-lime-400">
                      {torneo.format}
                    </span>
                  )}
                  {torneo.status && (
                    <span className="badge bg-zinc-800 text-lime-400">
                      {torneo.status}
                    </span>
                  )}
                  {torneo.startDate && (
                    <span className="badge bg-zinc-800 text-lime-400">
                      {new Date(torneo.startDate).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>
                {torneo.locationName && (
                  <p className="text-muted text-sm mb-4">{torneo.locationName}</p>
                )}
                <div className="mt-auto">
                  <Link href={`/eventos/${torneo.id}`} className="btn btn-secondary w-full text-center">
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </article>
        )}
      </div>
    </main>
  );
}