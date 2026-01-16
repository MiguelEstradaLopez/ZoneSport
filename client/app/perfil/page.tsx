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
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <UserCircle size={32} className="text-zs-blue" />
                Mi Perfil
            </h1>

            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                {/* Avatar y nombre */}
                <div className="text-center mb-8 pb-8 border-b border-slate-700">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-zs-blue to-zs-green mx-auto mb-4 flex items-center justify-center">
                        <UserCircle size={64} className="text-slate-800" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-zs-green font-semibold mt-2">{getRoleLabel(formData.role)}</p>
                </div>

                {/* Información del usuario */}
                <div className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-2">
                            <Mail size={16} className="text-zs-blue" />
                            Correo Electrónico
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-zs-blue outline-none"
                            />
                        ) : (
                            <p className="text-white">{formData.email}</p>
                        )}
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-2">
                            <UserCircle size={16} className="text-zs-green" />
                            Nombre
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-zs-blue outline-none"
                            />
                        ) : (
                            <p className="text-white">{formData.firstName}</p>
                        )}
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-2">
                            <UserCircle size={16} className="text-zs-green" />
                            Apellido
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-zs-blue outline-none"
                            />
                        ) : (
                            <p className="text-white">{formData.lastName}</p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-2">
                            <Phone size={16} className="text-zs-blue" />
                            Teléfono
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-zs-blue outline-none"
                            />
                        ) : (
                            <p className="text-white">{formData.phone}</p>
                        )}
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-2">
                            <Award size={16} className="text-zs-green" />
                            Rol
                        </label>
                        <p className="text-white">{getRoleLabel(formData.role)}</p>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-8 pt-8 border-t border-slate-700 flex gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-zs-green hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all"
                            >
                                Guardar Cambios
                            </button>
                            <button
                                onClick={() => {
                                    setFormData({ ...user });
                                    setIsEditing(false);
                                }}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-all"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-zs-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
                        >
                            Editar Perfil
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
