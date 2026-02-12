'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/auth/forgot-password', {
                email,
            });

            setMessage(response.data.message || 'Si el email existe, recibirás un enlace de recuperación');
            setSubmitted(true);
            setEmail('');

            // Redirigir después de 3 segundos
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Error al solicitar recuperación de contraseña');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-container flex items-center justify-center">
            <article className="card w-full max-w-md">
                <header className="card-header text-center">
                    <h1 className="mb-2">Recuperar Contraseña</h1>
                    <p className="text-muted">
                        Ingresa tu email para recibir un enlace de recuperación
                    </p>
                </header>

                <div className="card-body">
                    {submitted && !error && (
                        <aside className="alert alert-success mb-6">
                            <p className="text-green-400 font-semibold">✓ Correo enviado</p>
                            <p className="text-green-400 text-sm">{message}</p>
                            <p className="text-green-400 text-sm mt-2">
                                Serás redirigido a login en unos segundos...
                            </p>
                        </aside>
                    )}

                    {error && (
                        <aside className="alert alert-error mb-6">
                            <p className="text-red-400 font-semibold">Error</p>
                            <p className="text-red-400 text-sm">{error}</p>
                        </aside>
                    )}

                    {!submitted && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-secondary w-full"
                            >
                                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                            </button>
                        </form>
                    )}
                </div>

                <footer className="card-footer text-center text-small">
                    <p>
                        ¿Recordaste tu contraseña?{' '}
                        <Link href="/login" className="btn-link font-semibold">
                            Volver a Login
                        </Link>
                    </p>
                </footer>
            </article>
        </main>
    );
}
