'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [error, setError] = useState('');
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    // Validar el token al cargar la página
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/auth/validate-reset-token/${token}`
                );
                setUserEmail(response.data.email);
                setTokenValid(true);
            } catch (err) {
                const error = err as { response?: { data?: { message?: string } } };
                setError(
                    error.response?.data?.message ||
                    'El enlace de recuperación no es válido o ha expirado'
                );
                setTokenValid(false);
            } finally {
                setValidating(false);
            }
        };

        if (token) {
            validateToken();
        }
    }, [token]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        if (confirmPassword) {
            setPasswordsMatch(e.target.value === confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordsMatch(newPassword === e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validaciones
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        if (!passwordsMatch) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:3001/auth/reset-password', {
                token,
                newPassword,
            });

            setSuccess(true);

            // Redirigir a login después de 3 segundos
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(
                error.response?.data?.message ||
                'Error al restablecer la contraseña. Por favor intenta de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Validando enlace de recuperación...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Restablecer Contraseña
                </h1>

                {!tokenValid ? (
                    <div>
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            <p className="font-semibold">Enlace Inválido o Expirado</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <Link
                            href="/olvide-contrasena"
                            className="w-full block text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                            Solicitar Nuevo Enlace
                        </Link>
                    </div>
                ) : success ? (
                    <div>
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                            <p className="font-semibold">✓ Contraseña Actualizada</p>
                            <p className="text-sm">
                                Tu contraseña ha sido actualizada exitosamente. Serás redirigido a login...
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="w-full block text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                            Ir a Login
                        </Link>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-600 text-center mb-6">
                            Ingresa tu nueva contraseña para {userEmail}
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                <p className="font-semibold">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                                {newPassword && newPassword.length < 6 && (
                                    <p className="text-red-500 text-sm mt-1">
                                        La contraseña debe tener al menos 6 caracteres
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Confirma tu contraseña"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                                {confirmPassword && !passwordsMatch && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Las contraseñas no coinciden
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !newPassword ||
                                    !confirmPassword ||
                                    !passwordsMatch ||
                                    newPassword.length < 6
                                }
                                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-gray-600 text-sm">
                            <p>
                                <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                                    Volver a Login
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
