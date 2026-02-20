'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',

  });
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordValid =
    /[a-z]/.test(formData.password) &&
    /[A-Z]/.test(formData.password) &&
    /\d/.test(formData.password) &&
    /\s/.test(formData.password) &&
    formData.password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    if (!passwordValid) {
      setError('La contraseña no cumple con los requisitos de seguridad');
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', });
      router.push('/');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container flex items-center justify-center py-8">
      <article className="card w-full max-w-md">
        {/* Encabezado */}
        <header className="card-header text-center">
          <h1 className="mb-2">
            Zone<span className="text-zs-green">Sport</span>
          </h1>
          <p className="text-muted">Crea tu cuenta como deportista</p>
        </header>

        {/* Cuerpo del formulario */}
        <div className="card-body">
          {success && (
            <aside className="alert alert-success">
              <CheckCircle className="text-green-400" size={20} />
              <p className="text-green-400 text-sm">¡Registro exitoso! Redirigiendo...</p>
            </aside>
          )}

          {error && (
            <aside className="alert alert-error">
              <AlertCircle className="text-red-400" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </aside>
          )}


          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                Nombre
              </label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Apellido
              </label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Tucorreo@email.com"
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres, mayúsculas, minúsculas, números y espacios"
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                  required
                  minLength={8}
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => setShowPasswordRules(false)}
                />
              </div>
              {showPasswordRules && (
                <ul className="text-xs text-muted mt-2 list-disc ml-6">
                  <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>Mínimo 8 caracteres</li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>Al menos una mayúscula</li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-500' : ''}>Al menos una minúscula</li>
                  <li className={/\d/.test(formData.password) ? 'text-green-500' : ''}>Al menos un número</li>
                  <li className={/\s/.test(formData.password) ? 'text-green-500' : ''}>Al menos un espacio</li>
                </ul>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña *
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                  required
                  minLength={8}
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="form-error text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>


            {/* Botón enviar */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-6"
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Divisor */}
          <div className="divider mt-6" />

          {/* Ir a login */}
          <p className="text-center text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="btn-link-secondary font-semibold">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Pie de página */}
        <footer className="card-footer text-center text-small">
          Al registrarte, aceptas nuestros{' '}
          <Link href="#" className="btn-link-secondary">
            términos de servicio
          </Link>
        </footer>
      </article>
    </main>
  );
}
