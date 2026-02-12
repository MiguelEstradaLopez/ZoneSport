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
            <main className="page-container flex items-center justify-center">
                <p className="text-muted">Redirigiendo...</p>
            </main>
        );
    }

    return (
        <main className="page-container">
            <div className="content-wrapper max-w-2xl">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="flex items-center gap-3">
                        <Trophy className="text-zs-green" size={32} />
                        Crear Evento
                    </h1>
                    <p className="text-muted">Organiza un nuevo torneo o evento deportivo</p>
                </header>

                {/* Form Card */}
                <article className="card">
                    <div className="card-body">
                        {success && (
                            <aside className="alert alert-success">
                                <CheckCircle className="text-green-400" size={20} />
                                <p className="text-green-400 text-sm">¡Evento creado exitosamente! Redirigiendo...</p>
                            </aside>
                        )}

                        {error && (
                            <aside className="alert alert-error">
                                <AlertCircle className="text-red-400" size={20} />
                                <p className="text-red-400 text-sm">{error}</p>
                            </aside>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombre */}
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Nombre del Evento *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Torneo de Fútbol Antioquia 2026"
                                    className="form-input"
                                    required
                                />
                            </div>

                            {/* Deporte */}
                            <div className="form-group">
                                <label htmlFor="sportId" className="form-label">
                                    Deporte *
                                </label>
                                <select
                                    id="sportId"
                                    name="sportId"
                                    value={formData.sportId}
                                    onChange={handleChange}
                                    className="form-select"
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
                            <div className="form-group">
                                <label htmlFor="startDate" className="form-label">
                                    Fecha de Inicio *
                                </label>
                                <div className="input-wrapper">
                                    <Calendar className="input-icon" size={20} />
                                    <input
                                        id="startDate"
                                        type="datetime-local"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="form-input pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Fecha de Fin */}
                            <div className="form-group">
                                <label htmlFor="endDate" className="form-label">
                                    Fecha de Fin
                                </label>
                                <div className="input-wrapper">
                                    <Calendar className="input-icon" size={20} />
                                    <input
                                        id="endDate"
                                        type="datetime-local"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="form-input pl-10"
                                    />
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="form-group">
                                <label htmlFor="description" className="form-label">
                                    Descripción
                                </label>
                                <div className="input-wrapper">
                                    <FileText className="input-icon" size={20} />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe el evento, reglas especiales, premios, etc."
                                        rows={4}
                                        className="form-textarea pl-10"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary flex-1"
                                >
                                    {loading ? 'Creando evento...' : 'Crear Evento'}
                                </button>
                                <Link
                                    href="/eventos"
                                    className="btn btn-outline flex-1 text-center"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </article>

                {/* Info Box */}
                <aside className="card mt-8">
                    <div className="card-body">
                        <h3 className="heading-md mb-3">Consejos para crear un buen evento:</h3>
                        <ul className="space-y-2 text-muted text-sm">
                            <li>✓ Usa un nombre descriptivo y atractivo</li>
                            <li>✓ Especifica claramente las fechas y horas</li>
                            <li>✓ Incluye reglas especiales en la descripción</li>
                            <li>✓ Puedes editar o eliminar el evento después</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </main>
    );
}
