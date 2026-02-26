'use client';

import { useState } from 'react';
import { UserCircle, Mail, LogOut, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        ...user,
        firstName: user?.firstName || 'Juan',
        lastName: user?.lastName || 'Pérez',
        email: user?.email || 'atleta@zonesport.com',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Implementar lógica de guardar en el futuro
        setIsEditing(false);
    };

    // El rol se mantiene internamente, pero no se muestra ni edita

    return (
        <main className="page-container">
            <div className="content-wrapper max-w-2xl">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="flex items-center gap-3">
                        <UserCircle size={32} className="text-zs-blue" />
                        Mi Perfil
                    </h1>
                    <button
                        onClick={() => { logout(); router.push('/login'); }}
                        className="btn btn-outline flex items-center gap-2"
                        title="Cerrar sesión"
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </header>

                <article className="card">
                    {/* Avatar y nombre */}
                    <div className="card-header text-center">
                        <div className="avatar mx-auto mb-2">
                            <UserCircle size={64} className="text-zs-dark" />
                        </div>
                        {/* Subir foto de perfil (solo UI) */}
                        <div className="mb-4 flex flex-col items-center gap-2">
                            <label className="btn btn-sm btn-outline flex items-center gap-2 cursor-pointer">
                                <Upload size={16} />
                                Subir foto
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </label>
                            {selectedFile && (
                                <span className="text-xs text-zs-blue">
                                    {selectedFile.name}
                                </span>
                            )}
                        </div>
                        <h2 className="heading-lg">
                            {formData.firstName} {formData.lastName}
                        </h2>
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

                        {/* Teléfono y rol eliminados de la UI */}
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
                                        setFormData({
                                            ...user,
                                            firstName: user?.firstName || '',
                                            lastName: user?.lastName || '',
                                            email: user?.email || '',
                                        });
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
