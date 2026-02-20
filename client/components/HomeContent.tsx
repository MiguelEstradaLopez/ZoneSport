"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Tournament = {
    id: string;
    name: string;
    description?: string;
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
                        ) : (
                            <ul className="space-y-2">
                                {tournaments.map((t) => (
                                    <li key={t.id} className="border rounded p-3 bg-white/5">
                                        <span className="font-bold">{t.name}</span>
                                        {t.description && <span className="ml-2 text-sm text-gray-400">{t.description}</span>}
                                    </li>
                                ))}
                            </ul>
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
                    ) : (
                        <ul className="space-y-2">
                            {tournaments.map((t) => (
                                <li key={t.id} className="border rounded p-3 bg-white/5">
                                    <span className="font-bold">{t.name}</span>
                                    {t.description && <span className="ml-2 text-sm text-gray-400">{t.description}</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}
