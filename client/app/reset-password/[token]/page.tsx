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
            <main className="page-container flex items-center justify-center">
                <article className="card w-full max-w-md">
                    <div className="text-center">
                        <div className="spinner"></div>
                        <p className="text-muted">Validando enlace de recuperación...</p>
                    </div>
                </article>
            </main>
        );
    }

    return (
        <main className="page-container flex items-center justify-center">
            <article className="card w-full max-w-md">
                <header className="card-header text-center">
                    <h1>Restablecer Contraseña</h1>
                </header>

                <div className="card-body">
                    {!tokenValid ? (
                        <>
                            <aside className="alert alert-error">
                                <p className="text-red-400 font-semibold">Enlace Inválido o Expirado</p>
                                <p className="text-red-400 text-sm">{error}</p>
                            </aside>
                            <Link
                                href="/olvide-contrasena"
                                className="btn btn-secondary w-full block text-center"
                            >
                                Solicitar Nuevo Enlace
                            </Link>
                        </>
                    ) : success ? (
                        <>
                            <aside className="alert alert-success">
                                <p className="text-green-400 font-semibold">✓ Contraseña Actualizada</p>
                                <p className="text-green-400 text-sm">
                                    Tu contraseña ha sido actualizada exitosamente. Serás redirigido a login...
                                </p>
                            </aside>
                            <Link
                                href="/login"
                                className="btn btn-secondary w-full block text-center"
                            >
                                Ir a Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="text-muted text-center mb-6">
                                Ingresa tu nueva contraseña para {userEmail}
                            </p>

                            {error && (
                                <aside className="alert alert-error">
                                    <p className="text-red-400 font-semibold">Error</p>
                                    <p className="text-red-400 text-sm">{error}</p>
                                </aside>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-group">
                                    <label htmlFor="newPassword" className="form-label">
                                        Nueva Contraseña *
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        className="form-input"
                                    />
                                    {newPassword && newPassword.length < 6 && (
                                        <p className="form-error">
                                            La contraseña debe tener al menos 6 caracteres
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirmar Contraseña *
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder="Confirma tu contraseña"
                                        required
                                        className="form-input"
                                    />
                                    {confirmPassword && !passwordsMatch && (
                                        <p className="form-error">
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
                                    className="btn btn-secondary w-full"
                                >
                                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <footer className="card-footer text-center text-small">
                    <Link href="/login" className="btn-link">
                        Volver a Login
                    </Link>
                </footer>
            </article>
        </main>
    );
}
