'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Camera, Loader } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

type PerfilTab = 'perfil' | 'eventos' | 'intereses';

interface Tournament {
    id: string;
    name: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    sport?: { id: string; name: string };
    location?: string;
}

interface Interest {
    id: string;
    name: string;
}

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
    // Si es formato YYYY-MM-DD, agregar tiempo para evitar problemas de zona horaria
    const dateStr = dateValue.includes('T') ? dateValue : dateValue + 'T00:00:00';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function calculateAge(birthdate?: string | null) {
    if (!birthdate) return null;
    // Si es formato YYYY-MM-DD, agregar tiempo para evitar problemas de zona horaria
    const dateStr = birthdate.includes('T') ? birthdate : birthdate + 'T00:00:00';
    const dob = new Date(dateStr);
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
    const [birthdateError, setBirthdateError] = useState('');
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loadingTournaments, setLoadingTournaments] = useState(false);
    const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
    const [myInterests, setMyInterests] = useState<Interest[]>([]);
    const [loadingInterests, setLoadingInterests] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        birthdate: '',
        city: '',
    });

    const todayString = useMemo(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }, []);

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

    useEffect(() => {
        if (activeTab === 'eventos') {
            fetchUserTournaments();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'intereses') {
            fetchAvailableInterests();
            fetchMyInterests();
        }
    }, [activeTab]);

    const fetchUserTournaments = async () => {
        try {
            setLoadingTournaments(true);
            const response = await api.get('/tournaments', {
                params: { createdBy: 'me' },
            });
            setTournaments(response.data.data || response.data);
        } catch (err) {
            console.error('Error cargando torneos:', err);
        } finally {
            setLoadingTournaments(false);
        }
    };

    const fetchAvailableInterests = async () => {
        try {
            const response = await api.get('/activity-types');
            setAvailableInterests(response.data);
        } catch (err) {
            console.error('Error cargando intereses disponibles:', err);
        }
    };

    const fetchMyInterests = async () => {
        try {
            const response = await api.get('/users/me/interests');
            setMyInterests(response.data);
        } catch (err) {
            console.error('Error cargando mis intereses:', err);
        }
    };

    const toggleInterest = async (interestId: string) => {
        const isSelected = myInterests.some((i) => i.id === interestId);
        try {
            if (isSelected) {
                await api.delete(`/users/interests/${interestId}`);
                setMyInterests(myInterests.filter((i) => i.id !== interestId));
            } else {
                await api.post(`/users/interests/${interestId}`);
                const interest = availableInterests.find((i) => i.id === interestId);
                if (interest) {
                    setMyInterests([...myInterests, interest]);
                }
            }
        } catch (err) {
            console.error('Error al cambiar interés:', err);
        }
    };

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

        if (name === 'birthdate') {
            setBirthdateError('');
            if (value) {
                const selectedDate = new Date(value);
                const minDate = new Date('1900-01-01');
                const today = new Date();

                if (selectedDate < minDate || selectedDate > today) {
                    setBirthdateError('Fecha de nacimiento inválida');
                }
            }
        }
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

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-[70px] sm:-bottom-[70px] left-8 w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] rounded-full border-[3px] border-emerald-500 overflow-hidden shadow-xl cursor-pointer group bg-zinc-900"
                    >
                        {profilePicture ? (
                            <img
                                src={profilePicture}
                                alt="Foto de perfil"
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white ${avatarColorClass}`}>
                                {avatarLetter}
                            </div>
                        )}
                        <span className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Camera size={20} className="mb-1" />
                            Cambiar foto
                        </span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                    />

                    <div className="px-6 pb-6 pt-[80px] sm:pt-24">
                        <div className="ml-2">
                            <h1 className="text-3xl font-bold leading-tight">{fullName}</h1>
                            <p className="text-zinc-400 mt-1">
                                {age !== null ? `${age} años` : 'Edad no definida'}
                                {' · '}
                                {formData.city?.trim() || 'Ubicación no definida'}
                            </p>
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
                                {!isEditing ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Nombre</p>
                                                <p className="font-semibold text-white">{formData.firstName || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Apellido</p>
                                                <p className="font-semibold text-white">{formData.lastName || '—'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Email</p>
                                            <p className="font-semibold text-white">{formData.email || '—'}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Fecha de nacimiento</p>
                                                <p className="font-semibold text-white">
                                                    {formData.birthdate ? formatDateLabel(formData.birthdate) : '—'}
                                                    {age !== null && ` (${age} años)`}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Ciudad</p>
                                                <p className="font-semibold text-white">{formData.city || '—'}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-zinc-400 mb-1">Nombre</label>
                                                <input
                                                    name="firstName"
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-zinc-400 mb-1">Apellido</label>
                                                <input
                                                    name="lastName"
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
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
                                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
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
                                                        min="1900-01-01"
                                                        max={todayString}
                                                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                                                    />
                                                    <span className="text-sm text-zinc-300 whitespace-nowrap">
                                                        {age !== null && !birthdateError ? `${age} años` : '—'}
                                                    </span>
                                                </div>
                                                {birthdateError && (
                                                    <p className="text-xs text-red-400 mt-1">{birthdateError}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm text-zinc-400 mb-1">Ciudad</label>
                                                <input
                                                    name="city"
                                                    type="text"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    placeholder="Ej: Medellín"
                                                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

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
                            <div>
                                {loadingTournaments ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader className="w-5 h-5 animate-spin text-emerald-500" />
                                    </div>
                                ) : tournaments.length === 0 ? (
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-800/40 p-6 text-center text-zinc-400">
                                        <p>No has creado ningún evento aún.</p>
                                        <button
                                            onClick={() => router.push('/crear-evento')}
                                            className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition"
                                        >
                                            Crear mi primer evento
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {tournaments.map((tournament) => (
                                            <div
                                                key={tournament.id}
                                                className="rounded-lg border border-zinc-800 bg-zinc-800/40 p-4 hover:bg-zinc-800/60 transition cursor-pointer"
                                                onClick={() => router.push(`/eventos/${tournament.id}`)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-white">{tournament.name}</h3>
                                                        <p className="text-sm text-zinc-400 mt-1">
                                                            {tournament.sport?.name || 'Deporte no especificado'}
                                                            {tournament.location && ` · ${tournament.location}`}
                                                        </p>
                                                        <p className="text-xs text-zinc-500 mt-2">
                                                            {tournament.startDate
                                                                ? new Date(tournament.startDate).toLocaleDateString('es-CO')
                                                                : 'Fecha no definida'}
                                                        </p>
                                                    </div>
                                                    {tournament.status && (
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${tournament.status === 'active'
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : tournament.status === 'completed'
                                                                    ? 'bg-blue-500/20 text-blue-400'
                                                                    : 'bg-zinc-700 text-zinc-300'
                                                                }`}
                                                        >
                                                            {tournament.status === 'active' && 'Activo'}
                                                            {tournament.status === 'completed' && 'Finalizado'}
                                                            {!['active', 'completed'].includes(tournament.status) && tournament.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'intereses' && (
                            <div>
                                {loadingInterests ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader className="w-5 h-5 animate-spin text-emerald-500" />
                                    </div>
                                ) : availableInterests.length === 0 ? (
                                    <div className="text-center text-zinc-400">
                                        <p>No hay intereses disponibles.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-4">Selecciona los deportes que te interesan:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {availableInterests.map((interest) => {
                                                const isSelected = myInterests.some((i) => i.id === interest.id);
                                                return (
                                                    <button
                                                        key={interest.id}
                                                        onClick={() => toggleInterest(interest.id)}
                                                        className={`px-4 py-2 rounded-full font-medium transition ${isSelected
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                                            }`}
                                                    >
                                                        {interest.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
