'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MapPicker from '@/components/MapPicker';
import api from '@/services/api';

interface ActivityType {
    id: string;
    name: string;
    category: string;
    isCustom: boolean;
}

type TournamentFormat =
    | 'LEAGUE'
    | 'SINGLE_ELIMINATION'
    | 'DOUBLE_ELIMINATION'
    | 'ROUND_ROBIN'
    | 'CASUAL_MATCH';

// Descripción de formatos
const FORMAT_DESCRIPTIONS: Record<TournamentFormat | 'CASUAL_MATCH', string> = {
    LEAGUE: 'Todos juegan contra todos. Gana quien acumule más puntos al final.',
    SINGLE_ELIMINATION: 'Eliminación directa. Pierdes y quedas fuera del torneo.',
    DOUBLE_ELIMINATION: 'Necesitas perder dos veces para quedar eliminado. Más justo.',
    ROUND_ROBIN: 'Todos juegan contra todos en rondas organizadas. Similar a liga.',
    CASUAL_MATCH: 'Partido amistoso sin eliminación ni puntuación oficial.',
};

// Función para calcular matches y rondas
const calculateMatches = (maxTeams: number, format: TournamentFormat): { matches: number; rounds: number } => {
    const n = maxTeams;
    switch (format) {
        case 'LEAGUE':
        case 'ROUND_ROBIN':
            return { matches: (n * (n - 1)) / 2, rounds: n - 1 };
        case 'SINGLE_ELIMINATION':
            return { matches: n - 1, rounds: Math.ceil(Math.log2(n)) };
        case 'DOUBLE_ELIMINATION':
            return { matches: (n - 1) * 2, rounds: Math.ceil(Math.log2(n)) * 2 };
        case 'CASUAL_MATCH':
            return { matches: 1, rounds: 1 };
        default:
            return { matches: 0, rounds: 0 };
    }
};

export default function CrearEventoPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
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
    const [locationName, setLocationName] = useState('');
    const [locationAddress, setLocationAddress] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [showMapPicker, setShowMapPicker] = useState(false);

    // Activity Types desde el backend
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [selectedActivityTypeId, setSelectedActivityTypeId] = useState<string>('');
    const [loadingActivityTypes, setLoadingActivityTypes] = useState(true);

    // Fechas de rondas
    const [roundDates, setRoundDates] = useState<{ [key: number]: string }>({});
    const [matchInfo, setMatchInfo] = useState({ matches: 0, rounds: 0 });

    // Cargar activity types al montar
    useEffect(() => {
        const fetchActivityTypes = async () => {
            try {
                const response = await api.get('/activity-types');
                setActivityTypes(response.data);
                if (response.data.length > 0) {
                    setSelectedActivityTypeId(response.data[0].id);
                }
            } catch (err) {
                console.error('Error cargando activity types:', err);
            } finally {
                setLoadingActivityTypes(false);
            }
        };
        fetchActivityTypes();
    }, []);

    // Recalcular partidos cuando cambian maxTeams o format
    useEffect(() => {
        if (maxTeams) {
            const info = calculateMatches(parseInt(maxTeams), formato);
            setMatchInfo(info);
            // Limpiar roundDates anteriores
            setRoundDates({});
        }
    }, [maxTeams, formato]);

    // Cuando cambia el tipo de evento, ajusta el formato y maxTeams
    const handleTipoEventoChange = (tipo: 'TORNEO' | 'AMISTOSO') => {
        setTipoEvento(tipo);
        if (tipo === 'AMISTOSO') {
            setFormato('CASUAL_MATCH');
            setMaxTeams('2'); // Forzar a 2 para amistosos
        } else {
            setFormato('LEAGUE');
            setMaxTeams(''); // Limpiar para torneos
        }
    };

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
            if (tipoEvento === 'TORNEO' && !fechaInicio) {
                throw new Error('La fecha de inicio es requerida');
            }
            if (!selectedActivityTypeId) {
                throw new Error('Debes seleccionar un deporte');
            }

            // Validar fechas de rondas
            if (tipoEvento === 'AMISTOSO' && !roundDates[0]) {
                throw new Error('Debes seleccionar la fecha del partido');
            }
            if (tipoEvento === 'TORNEO') {
                for (let i = 1; i <= matchInfo.rounds; i++) {
                    if (!roundDates[i]) {
                        throw new Error(`Debes seleccionar la fecha para la ronda ${i}`);
                    }
                }
            }

            // Crear customScoringConfig con roundDates
            const customScoringConfig = {
                rounds: tipoEvento === 'AMISTOSO'
                    ? [{ round: 1, date: roundDates[0] }]
                    : Object.entries(roundDates).map(([roundNum, date]) => ({
                        round: parseInt(roundNum),
                        date,
                    })),
            };

            const fechaPartido = roundDates[0];

            // Crear payload
            const payload = {
                name: nombre.trim(),
                description: descripcion.trim() || undefined,
                format: formato,
                status: 'DRAFT' as const,
                maxTeams: parseInt(maxTeams),
                startDate: tipoEvento === 'AMISTOSO'
                    ? new Date(fechaPartido + 'T00:00:00').toISOString()
                    : new Date(fechaInicio + 'T00:00:00').toISOString(),
                endDate: tipoEvento === 'AMISTOSO'
                    ? new Date(fechaPartido + 'T23:59:59').toISOString()
                    : fechaFin ? new Date(fechaFin + 'T00:00:00').toISOString() : undefined,
                registrationDeadline: fechaLimiteRegistro
                    ? new Date(fechaLimiteRegistro + 'T00:00:00').toISOString()
                    : undefined,
                isPublic: esPublico,
                activityTypeId: selectedActivityTypeId,
                locationName: locationName.trim() || undefined,
                locationAddress: locationAddress.trim() || undefined,
                latitude: latitude ?? undefined,
                longitude: longitude ?? undefined,
                customScoringConfig,
            };

            // POST a /tournaments
            console.log('PAYLOAD ENVIADO:', JSON.stringify(payload));
            await api.post('/tournaments', payload);

            // Redirigir a /eventos
            router.push('/eventos');
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Error al crear evento';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleMapLocationSelect = (data: {
        lat: number;
        lng: number;
        address: string;
        mapsUrl: string;
    }) => {
        setLatitude(data.lat);
        setLongitude(data.lng);
        setLocationAddress(data.address);
        setShowMapPicker(false);
    };

    const renderFormatSelect = () => {
        if (tipoEvento !== 'TORNEO') return null;

        const formatDescriptions: Record<TournamentFormat, { label: string; desc: string }> = {
            LEAGUE: { label: 'Liga', desc: 'Todos juegan contra todos, gana quien acumule más puntos' },
            SINGLE_ELIMINATION: { label: 'Eliminación Simple', desc: 'Un partido perdido y quedas fuera' },
            DOUBLE_ELIMINATION: { label: 'Eliminación Doble', desc: 'Debes perder dos veces para quedar eliminado' },
            ROUND_ROBIN: { label: 'Todos contra Todos', desc: 'Rondas organizadas, ideal para grupos' },
            CASUAL_MATCH: { label: 'Amistoso', desc: 'Un solo partido sin puntuación oficial' },
        };

        return (
            <div>
                <label className="block text-sm font-semibold mb-2">
                    Formato del Torneo *
                </label>
                <div className="space-y-3">
                    {(['LEAGUE', 'SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN'] as TournamentFormat[]).map((fmt) => (
                        <label key={fmt} className="flex flex-col cursor-pointer">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="formato"
                                    value={fmt}
                                    checked={formato === fmt}
                                    onChange={() => setFormato(fmt)}
                                    className="mr-3 w-4 h-4 accent-green-500"
                                />
                                <span className="font-medium">{formatDescriptions[fmt].label}</span>
                            </div>
                            <p className="text-xs text-zinc-400 ml-7 mt-1">{formatDescriptions[fmt].desc}</p>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    const renderRoundDatePickers = () => {
        if (!maxTeams || matchInfo.rounds === 0) return null;

        const isFriendly = tipoEvento === 'AMISTOSO';

        return (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">
                    {isFriendly ? 'Fecha del Partido' : 'Fechas de las Rondas'}
                </h3>

                {isFriendly ? (
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Fecha del Partido *
                        </label>
                        <input
                            type="date"
                            value={roundDates[0] || ''}
                            onChange={(e) => setRoundDates({ ...roundDates, 0: e.target.value })}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Array.from({ length: matchInfo.rounds }, (_, i) => i + 1).map((round) => (
                            <div key={round}>
                                <label className="block text-sm font-semibold mb-1">
                                    Ronda {round} *
                                </label>
                                <input
                                    type="date"
                                    value={roundDates[round] || ''}
                                    onChange={(e) => setRoundDates({ ...roundDates, [round]: e.target.value })}
                                    min={fechaInicio}
                                    max={fechaFin}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-4 pt-20 md:p-8 md:pt-24">
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
                    {renderFormatSelect()}

                    {/* Máximo de Equipos */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Máximo de Equipos {tipoEvento === 'AMISTOSO' ? '' : '*'}
                        </label>
                        <div>
                            <input
                                type="number"
                                value={maxTeams}
                                onChange={(e) => tipoEvento === 'TORNEO' && setMaxTeams(e.target.value)}
                                placeholder={tipoEvento === 'AMISTOSO' ? '2' : '4'}
                                min="2"
                                max={tipoEvento === 'AMISTOSO' ? '2' : undefined}
                                disabled={tipoEvento === 'AMISTOSO'}
                                className={`w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none ${tipoEvento === 'AMISTOSO' ? 'bg-zinc-700 cursor-not-allowed opacity-70' : 'focus:border-green-500'}`}
                                required={tipoEvento === 'TORNEO'}
                            />
                            {tipoEvento === 'AMISTOSO' && (
                                <p className="text-xs text-zinc-400 mt-2">
                                    Los partidos amistosos son siempre 1 vs 1 (2 equipos)
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Información de Partidos */}
                    {maxTeams && (
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                            <p className="text-sm font-semibold">
                                📊 Este {tipoEvento === 'AMISTOSO' ? 'partido' : 'torneo'} tendrá <span className="text-green-400">{matchInfo.matches} partido{matchInfo.matches !== 1 ? 's' : ''}</span> en <span className="text-green-400">{matchInfo.rounds} ronda{matchInfo.rounds !== 1 ? 's' : ''}</span>
                            </p>
                        </div>
                    )}

                    {/* Fechas de Rondas */}
                    {maxTeams && renderRoundDatePickers()}

                    {/* Fechas */}
                    {tipoEvento === 'TORNEO' && (
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
                    )}

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

                    {/* Deporte */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Deporte *
                        </label>
                        {loadingActivityTypes ? (
                            <div className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-zinc-500">
                                Cargando deportes...
                            </div>
                        ) : (
                            <select
                                value={selectedActivityTypeId}
                                onChange={(e) => setSelectedActivityTypeId(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
                                required
                            >
                                {activityTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Ubicación */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Nombre de la Ubicación
                        </label>
                        <input
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="Ej: Estadio Principal"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Enlace de Ubicación */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Ubicación del Evento
                        </label>

                        {showMapPicker ? (
                            <div className="mb-4">
                                <MapPicker
                                    onLocationSelect={handleMapLocationSelect}
                                    initialLat={latitude || undefined}
                                    initialLng={longitude || undefined}
                                />
                                {locationAddress && (
                                    <button
                                        type="button"
                                        onClick={() => setShowMapPicker(false)}
                                        className="mt-3 w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 rounded transition"
                                    >
                                        ✓ Ubicación Confirmada - Cerrar Mapa
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {latitude && longitude ? (
                                    <div className="bg-zinc-800 border border-zinc-700 rounded p-4">
                                        <p className="text-sm">
                                            <span className="text-zinc-400">Ubicación seleccionada:</span>
                                        </p>
                                        <p className="text-white font-semibold mt-2">{locationAddress || 'Ubicación seleccionada'}</p>
                                        <p className="text-xs text-zinc-400 mt-2">
                                            {latitude.toFixed(4)}, {longitude.toFixed(4)}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowMapPicker(true)}
                                            className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
                                        >
                                            ✏️ Editar Ubicación
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowMapPicker(true)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
                                    >
                                        📍 Seleccionar Ubicación en el Mapa
                                    </button>
                                )}
                            </div>
                        )}
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

                <div className="mt-8 bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                    <p className="text-sm font-semibold mb-3 text-zinc-300">Vista previa de etiquetas</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-block bg-zinc-700 text-zinc-100 px-3 py-1 rounded-full text-sm">
                            {activityTypes.find(t => t.id === selectedActivityTypeId)?.name || 'Deporte'}
                        </span>
                        <span className="inline-block bg-zinc-700 text-zinc-100 px-3 py-1 rounded-full text-sm">
                            {tipoEvento === 'TORNEO' ? 'Torneo' : 'Amistoso'}
                        </span>
                        <span className="inline-block bg-zinc-700 text-zinc-100 px-3 py-1 rounded-full text-sm">
                            {esPublico ? 'Público' : 'Privado'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
