"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Tournament = {
    id: string;
    name: string;
    description?: string;
    activityType?: string;
    format?: string;
    status?: string;
    startDate?: string;
    teamsCount?: number;
    maxTeams?: number;
};

export default function HomeContent() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loadingTournaments, setLoadingTournaments] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoadingTournaments(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tournaments`)
            .then((res) => {
                if (!res.ok) throw new Error("No se pudieron cargar los torneos");
                return res.json();
            })
            .then((data) => setTournaments(data))
            .catch(() => setError("No se pudieron cargar los torneos"))
            .finally(() => setLoadingTournaments(false));
    }, []);

    if (isLoading) {
        return (
            <main className="page-container flex items-center justify-center min-h-screen">
                <div className="text-center">Cargando...</div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="page-container flex items-center justify-center min-h-screen">
                <div className="content-wrapper text-center max-w-2xl">
                    <h1 className="mb-2">
                        Zone<span className="text-zs-green">Sport</span>
                    </h1>
                    <h2 className="text-muted mb-6">Antioquia</h2>
                    <p className="body-text text-lg leading-relaxed mb-8">
                        El sistema está listo y conectado.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <a href="/login" className="btn btn-secondary">
                            Iniciar Sesión
                        </a>
                        <a href="/registrar" className="btn btn-primary">
                            Registrarse
                        </a>
                    </div>
                    <section className="mt-8">
                        <h3 className="text-lg font-semibold mb-2">Torneos disponibles</h3>
                        {loadingTournaments ? (
                            <div>Cargando torneos...</div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : tournaments.length === 0 ? (
                            <div>
                                <p className="text-gray-400 text-sm mb-4">
                                    No hay torneos disponibles por el momento.
                                </p>
                                {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
                                    <a href="/torneos/crear" className="btn btn-primary">
                                        Crear el primer torneo
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {tournaments.map((t) => (
                                    <div key={t.id} className="bg-zinc-900 border-l-4 border-lime-400 rounded-lg shadow p-4 flex flex-col items-start">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-lg text-white">{t.name}</span>
                                            {t.activityType && <span className="badge bg-lime-400 text-black ml-2">{t.activityType}</span>}
                                        </div>
                                        {t.description && <div className="text-gray-400 text-sm mb-2">{t.description}</div>}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {t.format && <span className="badge bg-zinc-800 text-lime-400">Formato: {t.format}</span>}
                                            {t.status && <span className="badge bg-zinc-800 text-lime-400">Estado: {t.status}</span>}
                                            {t.startDate && <span className="badge bg-zinc-800 text-lime-400">Inicio: {new Date(t.startDate).toLocaleDateString()}</span>}
                                        </div>
                                        <div className="mb-2 text-white text-sm">
                                            Equipos: {t.teamsCount ?? 0} / {t.maxTeams ?? '—'}
                                        </div>
                                        <a href={`/torneos/${t.id}`} className="btn btn-secondary mt-auto">
                                            Ver detalles
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        );
    }

    // Si está logueado
    return (
        <main className="page-container flex items-center justify-center min-h-screen">
            <div className="content-wrapper text-center max-w-2xl">
                <h1 className="mb-2">
                    ¡Hola, <span className="text-zs-green">{user?.firstName || user?.email}</span>!
                </h1>
                <h2 className="text-muted mb-6">Bienvenido a ZoneSport</h2>
                {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
                    <div className="mb-6">
                        <a href="/torneos/crear" className="btn btn-primary">
                            Crear Torneo
                        </a>
                    </div>
                )}
                <section className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Torneos disponibles</h3>
                    {loadingTournaments ? (
                        <div>Cargando torneos...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : tournaments.length === 0 ? (
                        <div>
                            <p className="text-gray-400 text-sm mb-4">
                                No hay torneos disponibles por el momento.
                            </p>
                            {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
                                <a href="/torneos/crear" className="btn btn-primary">
                                    Crear el primer torneo
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tournaments.map((t) => (
                                <div key={t.id} className="bg-zinc-900 border-l-4 border-lime-400 rounded-lg shadow p-4 flex flex-col items-start">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-lg text-white">{t.name}</span>
                                        {t.activityType && <span className="badge bg-lime-400 text-black ml-2">{t.activityType}</span>}
                                    </div>
                                    {t.description && <div className="text-gray-400 text-sm mb-2">{t.description}</div>}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {t.format && <span className="badge bg-zinc-800 text-lime-400">Formato: {t.format}</span>}
                                        {t.status && <span className="badge bg-zinc-800 text-lime-400">Estado: {t.status}</span>}
                                        {t.startDate && <span className="badge bg-zinc-800 text-lime-400">Inicio: {new Date(t.startDate).toLocaleDateString()}</span>}
                                    </div>
                                    <div className="mb-2 text-white text-sm">
                                        Equipos: {t.teamsCount ?? 0} / {t.maxTeams ?? '—'}
                                    </div>
                                    <a href={`/torneos/${t.id}`} className="btn btn-secondary mt-auto">
                                        Ver detalles
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
