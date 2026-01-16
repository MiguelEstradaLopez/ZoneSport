'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { eventsService, CreateEventData } from '@/services/eventsService';
import { sportsService, Sport } from '@/services/sportsService';
import { Calendar, Trophy, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function CrearEventoPage() {
    const router = useRouter();
    const [user, setUser] = useState(authService.getUser());
    const [sports, setSports] = useState<Sport[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<CreateEventData>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        sportId: 0,
        organizerId: user?.id || 0,
    });

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }

        const currentUser = authService.getUser();
        setUser(currentUser);
        setFormData((prev) => ({
            ...prev,
            organizerId: currentUser?.id || 0,
        }));

        fetchSports();
    }, [router]);

    const fetchSports = async () => {
        try {
            const sportsList = await sportsService.getAll();
            setSports(sportsList);
        } catch {
            setError('Error al cargar los deportes');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'sportId' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            if (!formData.name || !formData.startDate || !formData.sportId) {
                throw new Error('Nombre, fecha de inicio y deporte son requeridos');
            }

            await eventsService.create(formData);
            setSuccess(true);
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                sportId: 0,
                organizerId: user?.id || 0,
            });

            setTimeout(() => {
                router.push('/eventos');
            }, 2000);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Error al crear el evento');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-400">Redirigiendo...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-24">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Trophy className="text-zs-green" size={32} />
                        Crear Evento
                    </h1>
                    <p className="text-gray-400">Organiza un nuevo torneo o evento deportivo</p>
                </div>

                {/* Form Card */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
                    {success && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-3">
                            <CheckCircle className="text-green-400" size={20} />
                            <p className="text-green-400 text-sm">¡Evento creado exitosamente! Redirigiendo...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
                            <AlertCircle className="text-red-400" size={20} />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                                Nombre del Evento *
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Torneo de Fútbol Antioquia 2026"
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-zs-green"
                                required
                            />
                        </div>

                        {/* Deporte */}
                        <div>
                            <label htmlFor="sportId" className="block text-gray-300 text-sm font-medium mb-2">
                                Deporte *
                            </label>
                            <select
                                id="sportId"
                                name="sportId"
                                value={formData.sportId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-zs-green"
                                required
                            >
                                <option value={0}>Selecciona un deporte</option>
                                {sports.map((sport) => (
                                    <option key={sport.id} value={sport.id}>
                                        {sport.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha de Inicio */}
                        <div>
                            <label htmlFor="startDate" className="block text-gray-300 text-sm font-medium mb-2">
                                Fecha de Inicio *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    id="startDate"
                                    type="datetime-local"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-zs-green"
                                    required
                                />
                            </div>
                        </div>

                        {/* Fecha de Fin */}
                        <div>
                            <label htmlFor="endDate" className="block text-gray-300 text-sm font-medium mb-2">
                                Fecha de Fin
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    id="endDate"
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-zs-green"
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">
                                Descripción
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-500" size={20} />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe el evento, reglas especiales, premios, etc."
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-zs-green resize-none"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-zs-green hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-all"
                            >
                                {loading ? 'Creando evento...' : 'Crear Evento'}
                            </button>
                            <Link
                                href="/eventos"
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-all text-center"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Consejos para crear un buen evento:</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li>✓ Usa un nombre descriptivo y atractivo</li>
                        <li>✓ Especifica claramente las fechas y horas</li>
                        <li>✓ Incluye reglas especiales en la descripción</li>
                        <li>✓ Puedes editar o eliminar el evento después</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
