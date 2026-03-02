'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Camera, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type PerfilTab = 'perfil' | 'eventos' | 'intereses';

const AVATAR_COLORS = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-violet-500',
    'bg-fuchsia-500',
    'bg-cyan-500',
    'bg-teal-500',
];

function formatDateLabel(dateValue?: string | null) {
    if (!dateValue) return '—';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function calculateAge(birthdate?: string | null) {
    if (!birthdate) return null;
    const dob = new Date(birthdate);
    if (Number.isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
    }

    return age >= 0 ? age : null;
}

function getAvatarColorClass(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function PerfilPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [activeTab, setActiveTab] = useState<PerfilTab>('perfil');
    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [memberSince, setMemberSince] = useState('—');
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        birthdate: '',
        city: '',
    });

    useEffect(() => {
        const storedPicture = localStorage.getItem('profile_picture');
        const storedBirthdate = localStorage.getItem('user_birthdate') || '';
        const storedCity = localStorage.getItem('user_city') || '';
        const userWithCreatedAt = user as (typeof user & { createdAt?: string }) | null;

        if (userWithCreatedAt?.createdAt) {
            localStorage.setItem('user_created_at', userWithCreatedAt.createdAt);
        }

        const createdAt = userWithCreatedAt?.createdAt || localStorage.getItem('user_created_at');
        setMemberSince(formatDateLabel(createdAt));

        if (storedPicture) {
            setProfilePicture(storedPicture);
        }

        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            birthdate: storedBirthdate,
            city: storedCity,
        });
    }, [user]);

    const fullName = useMemo(() => {
        const composed = `${formData.firstName} ${formData.lastName}`.trim();
        return composed || 'Usuario ZoneSport';
    }, [formData.firstName, formData.lastName]);

    const age = useMemo(() => calculateAge(formData.birthdate), [formData.birthdate]);

    const avatarSeed = (fullName || formData.email || 'U').trim();
    const avatarLetter = (avatarSeed[0] || 'U').toUpperCase();
    const avatarColorClass = getAvatarColorClass(avatarSeed);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setProfilePicture(base64);
            localStorage.setItem('profile_picture', base64);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        localStorage.setItem('user_birthdate', formData.birthdate);
        localStorage.setItem('user_city', formData.city);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData((prev) => ({
            ...prev,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            birthdate: localStorage.getItem('user_birthdate') || '',
            city: localStorage.getItem('user_city') || '',
        }));
        setIsEditing(false);
    };

    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-100 p-4 pt-20 md:p-8 md:pt-24">
            <div className="max-w-5xl mx-auto">
                <section className="relative rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900 mb-6">
                    <div className="h-32 w-full bg-gradient-to-r from-blue-950 via-zinc-900 to-emerald-900" />

                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="absolute top-4 right-4 px-3 py-2 text-sm rounded-lg bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 transition"
                    >
                        Editar perfil
                    </button>

                    <div className="px-6 pb-6">
                        <div className="-mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="relative group w-24 h-24 rounded-full border-4 border-zinc-900 overflow-hidden shrink-0"
                            >
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt="Foto de perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center text-3xl font-bold text-white ${avatarColorClass}`}>
                                        {avatarLetter}
                                    </div>
                                )}
                                <span className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/45">
                                    <Camera size={18} />
                                </span>
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfilePictureChange}
                            />

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold leading-tight">{fullName}</h1>
                                <p className="text-zinc-400 mt-1">
                                    {age !== null ? `${age} años` : 'Edad no definida'}
                                    {' · '}
                                    {formData.city?.trim() || 'Ubicación no definida'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-zinc-400 text-sm">Eventos creados</p>
                        <p className="text-2xl font-bold mt-1">0</p>
                    </article>
                    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-zinc-400 text-sm">Eventos asistidos</p>
                        <p className="text-2xl font-bold mt-1">0</p>
                    </article>
                    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-zinc-400 text-sm">Miembro desde</p>
                        <p className="text-lg font-semibold mt-1">{memberSince}</p>
                    </article>
                </section>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                    <div className="flex border-b border-zinc-800">
                        {[
                            { id: 'perfil', label: 'Perfil' },
                            { id: 'eventos', label: 'Eventos' },
                            { id: 'intereses', label: 'Intereses' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as PerfilTab)}
                                className={`px-5 py-3 text-sm font-medium transition ${activeTab === tab.id
                                    ? 'text-white border-b-2 border-emerald-500 bg-zinc-800/70'
                                    : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-5">
                        {activeTab === 'perfil' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-1">Nombre</label>
                                        <input
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white disabled:opacity-70"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-1">Apellido</label>
                                        <input
                                            name="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white disabled:opacity-70"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white disabled:opacity-70"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-1">Fecha de nacimiento</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                name="birthdate"
                                                type="date"
                                                value={formData.birthdate}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white disabled:opacity-70"
                                            />
                                            <span className="text-sm text-zinc-300 whitespace-nowrap">
                                                {age !== null ? `${age} años` : '—'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-zinc-400 mb-1">Ciudad</label>
                                        <input
                                            name="city"
                                            type="text"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Ej: Medellín"
                                            disabled={!isEditing}
                                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white disabled:opacity-70"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition"
                                            >
                                                Guardar cambios
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 transition"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 transition"
                                        >
                                            Editar perfil
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'eventos' && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-800/40 p-6 text-zinc-300">
                                Próximamente
                            </div>
                        )}

                        {activeTab === 'intereses' && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-800/40 p-6 text-zinc-300">
                                Próximamente
                            </div>
                        )}
                    </div>
                </section>

                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            logout();
                            router.push('/login');
                        }}
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
                    >
                        <LogOut size={16} />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </main>
    );
}
