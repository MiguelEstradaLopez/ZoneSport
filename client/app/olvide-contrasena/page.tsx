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
        <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Recuperar Contraseña
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    Ingresa tu email para recibir un enlace de recuperación
                </p>

                {submitted && !error && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                        <p className="font-semibold">✓ Correo enviado</p>
                        <p className="text-sm">
                            {message}
                        </p>
                        <p className="text-sm mt-2">
                            Serás redirigido a login en unos segundos...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <p className="font-semibold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!submitted && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-gray-600 text-sm">
                    <p>
                        ¿Recordaste tu contraseña?{' '}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                            Volver a Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
