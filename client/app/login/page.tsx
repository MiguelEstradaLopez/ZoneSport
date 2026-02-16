'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({ email: false, password: false });

    // Validar si el formulario es válido
    const isFormValid = email.trim() !== '' && password.trim() !== '';

    const handleBlur = (field: 'email' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

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
        <main className="page-container flex items-center justify-center min-h-screen bg-zonesport-bg-dark py-12 px-4">
            <article className="w-full max-w-md bg-zonesport-bg-dark border border-zonesport-blue border-opacity-20 rounded-lg p-10 shadow-lg">
                {/* Encabezado */}
                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-zonesport-lime mb-3 leading-snug">
                        Zone<span className="font-extrabold">Sport</span>
                    </h1>
                    <p className="text-gray-400 text-xs tracking-normal">Inicia sesión en tu cuenta</p>
                </header>

                {/* Cuerpo del formulario */}
                <div className="space-y-6">
                    {error && (
                        <aside className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-md p-4 flex items-start gap-3">
                            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-red-300 text-sm">{error}</p>
                        </aside>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Correo */}
                        <div>
                            <label htmlFor="email" className="text-white text-sm font-semibold block mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    placeholder="Tu correo@gmail.com"
                                    className="w-full bg-zonesport-bg-dark border border-zonesport-blue border-opacity-30 rounded px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-zonesport-blue focus:border-opacity-100 focus:ring-2 focus:ring-zonesport-blue focus:ring-opacity-20 transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="text-white text-sm font-semibold block mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    placeholder="••••••••"
                                    className="w-full bg-zonesport-bg-dark border border-zonesport-blue border-opacity-30 rounded px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-zonesport-blue focus:border-opacity-100 focus:ring-2 focus:ring-zonesport-blue focus:ring-opacity-20 transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Link recuperar contraseña */}
                        <div className="text-right pt-1">
                            <Link
                                href="/olvide-contrasena"
                                className="text-zonesport-link hover:text-zonesport-lime text-sm font-medium transition-colors duration-200"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Botón enviar */}
                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={`w-full py-3 px-4 rounded font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 ${isFormValid && !loading
                                ? 'bg-zonesport-blue hover:bg-zonesport-blue-hover shadow-lg hover:shadow-xl'
                                : 'bg-zonesport-blue opacity-50 cursor-not-allowed'
                                }`}
                        >
                            {loading && <Loader className="animate-spin" size={20} />}
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {/* Divisor */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-zonesport-blue to-transparent opacity-30"></div>
                        <span className="text-gray-400 text-xs uppercase tracking-widest">O</span>
                        <div className="flex-1 h-px bg-gradient-to-l from-zonesport-blue to-transparent opacity-30"></div>
                    </div>

                    {/* Crear cuenta */}
                    <p className="text-center text-gray-300 text-sm">
                        ¿No tienes cuenta?{' '}
                        <Link
                            href="/registrar"
                            className="text-zonesport-link hover:text-zonesport-lime font-semibold transition-colors duration-200"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>

                {/* Pie de página */}
                <footer className="border-t border-zonesport-blue border-opacity-20 mt-8 pt-6 text-center text-gray-400 text-xs">
                    Al iniciar sesión, aceptas nuestros{' '}
                    <Link
                        href="#"
                        className="text-zonesport-link hover:text-zonesport-lime transition-colors duration-200"
                    >
                        términos de servicio
                    </Link>
                </footer>
            </article>
        </main>
    );
}
