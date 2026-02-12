'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({ email, password });
            router.push('/');
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-container flex items-center justify-center">
            <article className="card w-full max-w-md">
                {/* Encabezado */}
                <header className="card-header text-center">
                    <h1 className="mb-2">
                        Zone<span className="text-zs-green">Sport</span>
                    </h1>
                    <p className="text-muted">Inicia sesión en tu cuenta</p>
                </header>

                {/* Cuerpo del formulario */}
                <div className="card-body">
                    {error && (
                        <aside className="alert alert-error">
                            <AlertCircle className="text-red-400" size={20} />
                            <p className="text-red-400 text-sm">{error}</p>
                        </aside>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Correo */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico *
                            </label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="form-input pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Contraseña *
                            </label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="form-input pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Link recuperar contraseña */}
                        <div className="text-right pt-2">
                            <Link href="/olvide-contrasena" className="btn-link text-sm">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Botón enviar */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-6"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {/* Divisor */}
                    <div className="divider mt-6" />

                    {/* Crear cuenta */}
                    <p className="text-center text-muted">
                        ¿No tienes cuenta?{' '}
                        <Link href="/registrar" className="btn-link font-semibold">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>

                {/* Pie de página */}
                <footer className="card-footer text-center text-small">
                    Al iniciar sesión, aceptas nuestros{' '}
                    <Link href="#" className="btn-link-secondary">
                        términos de servicio
                    </Link>
                </footer>
            </article>
        </main>
    );
}
