'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import Link from 'next/link';

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
  createdAt?: string;
  updatedAt?: string;
};

// Función para obtener color del estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-600 text-gray-100';
    case 'REGISTRATION_OPEN':
      return 'bg-green-600 text-green-100';
    case 'IN_PROGRESS':
      return 'bg-blue-600 text-blue-100';
    case 'FINISHED':
      return 'bg-red-600 text-red-100';
    case 'CANCELLED':
      return 'bg-red-900 text-red-100';
    default:
      return 'bg-zinc-700 text-zinc-300';
  }
};

// Función para obtener label legible del estado
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

// Función para obtener tipo de evento
const getTournamentType = (format: string) => {
  return format === 'CASUAL_MATCH' ? 'Partido Amistoso' : 'Torneo';
};

export default function EventosPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [torneos, setTorneos] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tournaments');
        setTorneos(response.data);
      } catch (err) {
        setError('Error al cargar los eventos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTorneos();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl">Cargando eventos...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900 text-red-100 p-4 rounded-lg border border-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Eventos Deportivos</h1>
            <p className="text-zinc-400 mt-2">Descubre, crea y participa en eventos</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => router.push('/crear-evento')}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded font-semibold whitespace-nowrap transition"
            >
              ➕ Crear Evento
            </button>
          )}
        </div>

        {/* Lista de eventos */}
        {torneos.length === 0 ? (
          <div className="text-center py-16 bg-zinc-800 rounded-lg border border-zinc-700">
            <p className="text-zinc-400 text-lg mb-6">
              No hay eventos disponibles por el momento.
            </p>
            {isAuthenticated && (
              <button
                onClick={() => router.push('/crear-evento')}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded font-semibold transition"
              >
                Crear el primer evento
              </button>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded font-semibold transition"
              >
                Inicia sesión para crear eventos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {torneos.map((torneo) => (
              <div
                key={torneo.id}
                className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-green-500 transition flex flex-col"
              >
                {/* Estado badge */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      torneo.status
                    )}`}
                  >
                    {getStatusLabel(torneo.status)}
                  </span>
                </div>

                {/* Nombre */}
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{torneo.name}</h2>

                {/* Tipo de evento */}
                <p className="text-sm text-zinc-400 mb-4">
                  {getTournamentType(torneo.format)} • {torneo.format === 'CASUAL_MATCH' ? 'Amistoso' : torneo.format}
                </p>

                {/* Fecha inicio */}
                <div className="mb-3 text-sm">
                  <span className="text-zinc-400">Inicia:</span>{' '}
                  <span className="font-semibold">
                    {new Date(torneo.startDate).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Equipos */}
                <div className="mb-3 text-sm">
                  <span className="text-zinc-400">Equipos:</span>{' '}
                  <span className="font-semibold">
                    {torneo.maxTeams > 0 ? `${torneo.maxTeams} máximo` : 'Por definir'}
                  </span>
                </div>

                {/* Ubicación */}
                {torneo.locationName && (
                  <div className="mb-4 text-sm">
                    <span className="text-zinc-400">📍</span>{' '}
                    <span className="text-zinc-300">{torneo.locationName}</span>
                    {torneo.locationAddress && (
                      <div className="text-xs text-zinc-500 ml-4">
                        {torneo.locationAddress}
                      </div>
                    )}
                  </div>
                )}

                {/* Descripción */}
                {torneo.description && (
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                    {torneo.description}
                  </p>
                )}

                {/* Botón Ver Detalles */}
                <div className="mt-auto pt-4">
                  <Link
                    href={`/eventos/${torneo.id}`}
                    className="block w-full bg-zinc-700 hover:bg-zinc-600 text-center py-2 rounded font-semibold transition"
                  >
                    Ver Detalles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}