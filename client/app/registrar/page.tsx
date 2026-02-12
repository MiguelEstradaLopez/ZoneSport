'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email y contraseña son requeridos');
      }

      await authService.register(formData);
      setSuccess(true);
      setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '' });

      // Redirigir al home después de 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="form-input pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

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
                  className="form-input pl-10"
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
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Teléfono
              </label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+57 123456789"
                  className="form-input pl-10"
                />
              </div>
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
