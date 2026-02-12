'use client';

import { useState } from 'react';
import { UserCircle, Mail, Phone, Award } from 'lucide-react';

export default function PerfilPage() {
    const [user] = useState({
        id: 1,
        email: 'atleta@zonesport.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        phone: '+57 300 1234567',
        role: 'ATHLETE',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Implementar lógica de guardar en el futuro
        setIsEditing(false);
    };

    const getRoleLabel = (role: string) => {
        const roleMap: Record<string, string> = {
            ATHLETE: 'Atleta',
            ORGANIZER: 'Organizador',
            ADMIN: 'Administrador',
        };
        return roleMap[role] || role;
    };

    return (
        <main className="page-container">
            <div className="content-wrapper max-w-2xl">
                <header className="mb-8">
                    <h1 className="flex items-center gap-3">
                        <UserCircle size={32} className="text-zs-blue" />
                        Mi Perfil
                    </h1>
                </header>

                <article className="card">
                    {/* Avatar y nombre */}
                    <div className="card-header text-center">
                        <div className="avatar">
                            <UserCircle size={64} className="text-zs-dark" />
                        </div>
                        <h2 className="heading-lg">
                            {formData.firstName} {formData.lastName}
                        </h2>
                        <p className="text-zs-green font-semibold mt-2">{getRoleLabel(formData.role)}</p>
                    </div>

                    {/* Información del usuario */}
                    <div className="card-body space-y-6">
                        {/* Correo */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <Mail size={16} className="text-zs-blue" />
                                Correo Electrónico
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            ) : (
                                <p>{formData.email}</p>
                            )}
                        </div>

                        {/* Nombre */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <UserCircle size={16} className="text-zs-green" />
                                Nombre
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            ) : (
                                <p>{formData.firstName}</p>
                            )}
                        </div>

                        {/* Apellido */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <UserCircle size={16} className="text-zs-green" />
                                Apellido
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            ) : (
                                <p>{formData.lastName}</p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <Phone size={16} className="text-zs-blue" />
                                Teléfono
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            ) : (
                                <p>{formData.phone}</p>
                            )}
                        </div>

                        {/* Rol */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <Award size={16} className="text-zs-green" />
                                Rol
                            </label>
                            <p>{getRoleLabel(formData.role)}</p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <footer className="card-footer flex gap-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="btn btn-primary flex-1"
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData({ ...user });
                                        setIsEditing(false);
                                    }}
                                    className="btn btn-outline flex-1"
                                >
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-secondary w-full"
                            >
                                Editar Perfil
                            </button>
                        )}
                    </footer>
                </article>
            </div>
        </main>
    );
}
