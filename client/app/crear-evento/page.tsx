'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

type TournamentFormat =
    | 'LEAGUE'
    | 'SINGLE_ELIMINATION'
    | 'DOUBLE_ELIMINATION'
    | 'ROUND_ROBIN'
    | 'CASUAL_MATCH';

export default function CrearEventoPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State del formulario
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipoEvento, setTipoEvento] = useState<'TORNEO' | 'AMISTOSO'>('TORNEO');
    const [formato, setFormato] = useState<TournamentFormat>('LEAGUE');
    const [maxTeams, setMaxTeams] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [fechaLimiteRegistro, setFechaLimiteRegistro] = useState('');
    const [esPublico, setEsPublico] = useState(true);
    const [ubicacion, setUbicacion] = useState('');
    const [direccion, setDireccion] = useState('');

    // Redirect si no está autenticado
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Debes iniciar sesión</h1>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold"
                    >
                        Ir a Login
                    </button>
                </div>
            </div>
        );
    }

    // Cuando cambia el tipo de evento, ajusta el formato
    const handleTipoEventoChange = (tipo: 'TORNEO' | 'AMISTOSO') => {
        setTipoEvento(tipo);
        if (tipo === 'AMISTOSO') {
            setFormato('CASUAL_MATCH');
        } else {
            setFormato('LEAGUE');
        }
    };

    // Submit del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validaciones básicas
            if (!nombre.trim()) {
                throw new Error('El nombre del evento es requerido');
            }
            if (!maxTeams || parseInt(maxTeams) < 2) {
                throw new Error('El máximo de equipos debe ser al menos 2');
            }
            if (!fechaInicio) {
                throw new Error('La fecha de inicio es requerida');
            }

            // Crear payload
            const payload = {
                name: nombre.trim(),
                description: descripcion.trim() || undefined,
                format: formato,
                status: 'DRAFT' as const,
                maxTeams: parseInt(maxTeams),
                startDate: new Date(fechaInicio).toISOString(),
                endDate: fechaFin ? new Date(fechaFin).toISOString() : undefined,
                registrationDeadline: fechaLimiteRegistro
                    ? new Date(fechaLimiteRegistro).toISOString()
                    : undefined,
                isPublic: esPublico,
                locationName: ubicacion.trim() || undefined,
                locationAddress: direccion.trim() || undefined,
                // activityType se configurará en el backend si  es necesario
            };

            // POST a /tournaments
            const response = await api.post('/tournaments', payload);

            // Redirigir a /eventos
            router.push('/eventos');
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Error al crear evento';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Crear Evento</h1>

                {error && (
                    <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6 border border-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Nombre del Evento *
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Torneo de Fútbol 2026"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Detalles sobre el evento..."
                            rows={4}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Tipo de Evento */}
                    <fieldset>
                        <legend className="block text-sm font-semibold mb-3">
                            Tipo de Evento *
                        </legend>
                        <div className="space-y-2">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="tipoEvento"
                                    value="TORNEO"
                                    checked={tipoEvento === 'TORNEO'}
                                    onChange={() => handleTipoEventoChange('TORNEO')}
                                    className="mr-3 w-4 h-4 accent-green-500"
                                />
                                <span>Torneo</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="tipoEvento"
                                    value="AMISTOSO"
                                    checked={tipoEvento === 'AMISTOSO'}
                                    onChange={() => handleTipoEventoChange('AMISTOSO')}
                                    className="mr-3 w-4 h-4 accent-green-500"
                                />
                                <span>Partido Amistoso</span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Formato (solo si es Torneo) */}
                    {tipoEvento === 'TORNEO' && (
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Formato del Torneo *
                            </label>
                            <select
                                value={formato}
                                onChange={(e) => setFormato(e.target.value as TournamentFormat)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
                            >
                                <option value="LEAGUE">Liga</option>
                                <option value="SINGLE_ELIMINATION">Eliminación Simple</option>
                                <option value="DOUBLE_ELIMINATION">Eliminación Doble</option>
                                <option value="ROUND_ROBIN">Todos contra Todos</option>
                            </select>
                        </div>
                    )}

                    {/* Máximo de Equipos */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Máximo de Equipos *
                        </label>
                        <input
                            type="number"
                            value={maxTeams}
                            onChange={(e) => setMaxTeams(e.target.value)}
                            placeholder="4"
                            min="2"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Fecha de Inicio *
                            </label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Fecha de Fin
                            </label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Fecha Límite de Registro */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Fecha Límite de Registro
                        </label>
                        <input
                            type="date"
                            value={fechaLimiteRegistro}
                            onChange={(e) => setFechaLimiteRegistro(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Público/Privado */}
                    <div>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={esPublico}
                                onChange={(e) => setEsPublico(e.target.checked)}
                                className="mr-3 w-4 h-4 accent-green-500"
                            />
                            <span className="text-sm font-semibold">
                                {esPublico ? 'Público (visible para todos)' : 'Privado (solo invitados)'}
                            </span>
                        </label>
                    </div>

                    {/* Ubicación */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Nombre de la Ubicación
                        </label>
                        <input
                            type="text"
                            value={ubicacion}
                            onChange={(e) => setUbicacion(e.target.value)}
                            placeholder="Ej: Estadio Principal"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Dirección
                        </label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            placeholder="Ej: Calle 50 #40-20, Medellín"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-3 rounded transition"
                        >
                            {loading ? 'Creando...' : 'Crear Evento'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 rounded transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
