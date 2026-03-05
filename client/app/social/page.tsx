'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
}

interface FriendshipRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: 'pending' | 'accepted' | 'rejected';
    sender: User;
}

const AVATAR_COLORS = [
    '#10b981', '#3b82f6', '#8b5cf6', '#d946ef', '#06b6d4', '#14b8a6',
];

function getAvatarColor(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getUserInitial(user: User) {
    return (user.firstName?.[0] || user.email[0] || 'U').toUpperCase();
}

export default function SocialPage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<FriendshipRequest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [friends, setFriends] = useState<User[]>([]);
    const [sentRequests, setSentRequests] = useState<string[]>([]);
    const [receivedRequests, setReceivedRequests] = useState<string[]>([]);

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-zinc-900 text-white p-4 pt-20 md:p-8 md:pt-24">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Social</h1>
                    <p className="text-zinc-400">Debes iniciar sesión para acceder a la sección social.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </main>
        );
    }

    useEffect(() => {
        fetchUsers();
        fetchPendingRequests();
        fetchFriends();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users', {
                params: {
                    page: 1,
                    limit: 50,
                    search: search || undefined,
                },
            });
            setUsers(response.data.data || response.data);
        } catch (err) {
            console.error('Error cargando usuarios:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            setLoadingRequests(true);
            const response = await api.get('/friendships/requests/pending');
            setPendingRequests(response.data);
            setReceivedRequests(response.data.map((r: FriendshipRequest) => r.senderId));
        } catch (err) {
            console.error('Error cargando solicitudes pendientes:', err);
        } finally {
            setLoadingRequests(false);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await api.get('/friendships');
            setFriends(response.data);
        } catch (err) {
            console.error('Error cargando amigos:', err);
        }
    };

    const sendFriendRequest = async (userId: string) => {
        try {
            await api.post(`/friendships/request/${userId}`);
            setSentRequests([...sentRequests, userId]);
        } catch (err) {
            console.error('Error enviando solicitud:', err);
        }
    };

    const acceptRequest = async (requestId: string) => {
        try {
            await api.patch(`/friendships/request/${requestId}/accept`);
            setPendingRequests(pendingRequests.filter((r) => r.id !== requestId));
            fetchFriends();
        } catch (err) {
            console.error('Error aceptando solicitud:', err);
        }
    };

    const rejectRequest = async (requestId: string) => {
        try {
            await api.patch(`/friendships/request/${requestId}/reject`);
            setPendingRequests(pendingRequests.filter((r) => r.id !== requestId));
        } catch (err) {
            console.error('Error rechazando solicitud:', err);
        }
    };

    const getButtonState = (userId: string) => {
        if (userId === user?.id) return 'self';
        if (friends.some((f) => f.id === userId)) return 'friends';
        if (receivedRequests.includes(userId)) return 'received';
        if (sentRequests.includes(userId)) return 'sent';
        return 'available';
    };

    return (
        <main className="min-h-screen bg-zinc-900 text-white p-4 pt-20 md:p-8 md:pt-24">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Social</h1>

                {/* Solicitudes Pendientes */}
                {pendingRequests.length > 0 && (
                    <div className="mb-8 bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Solicitudes Pendientes ({pendingRequests.length})</h2>
                        <div className="space-y-3">
                            {pendingRequests.map((request) => {
                                const sender = request.sender;
                                const initial = getUserInitial(sender);
                                const color = getAvatarColor(sender.email);

                                return (
                                    <div key={request.id} className="flex items-center justify-between bg-zinc-700 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                {initial}
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    {sender.firstName && sender.lastName
                                                        ? `${sender.firstName} ${sender.lastName}`
                                                        : sender.email}
                                                </p>
                                                <p className="text-sm text-zinc-400">{sender.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => acceptRequest(request.id)}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold text-sm"
                                            >
                                                ✓ Aceptar
                                            </button>
                                            <button
                                                onClick={() => rejectRequest(request.id)}
                                                className="px-4 py-2 bg-zinc-600 hover:bg-zinc-500 rounded font-semibold text-sm"
                                            >
                                                ✕ Rechazar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Buscador */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar usuarios..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
                    />
                </div>

                {/* Lista de Usuarios */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Usuarios Registrados</h2>

                    {loading ? (
                        <p className="text-zinc-400">Cargando usuarios...</p>
                    ) : users.length === 0 ? (
                        <p className="text-zinc-400">No se encontraron usuarios.</p>
                    ) : (
                        <div className="space-y-3">
                            {users.map((u) => {
                                if (u.id === user?.id) return null;

                                const initial = getUserInitial(u);
                                const color = getAvatarColor(u.email);
                                const state = getButtonState(u.id);

                                return (
                                    <div key={u.id} className="flex items-center justify-between bg-zinc-700 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                {initial}
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.email}
                                                </p>
                                                <p className="text-sm text-zinc-400">{u.email}</p>
                                            </div>
                                        </div>

                                        {state === 'friends' && (
                                            <span className="px-4 py-2 bg-green-600 text-white rounded font-semibold text-sm">
                                                ✓ Amigos
                                            </span>
                                        )}
                                        {state === 'received' && (
                                            <button
                                                onClick={() => {
                                                    const req = pendingRequests.find((r) => r.senderId === u.id);
                                                    if (req) acceptRequest(req.id);
                                                }}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold text-sm"
                                            >
                                                ✓ Aceptar
                                            </button>
                                        )}
                                        {state === 'sent' && (
                                            <span className="px-4 py-2 bg-zinc-600 text-white rounded font-semibold text-sm">
                                                ✉ Solicitud Enviada
                                            </span>
                                        )}
                                        {state === 'available' && (
                                            <button
                                                onClick={() => sendFriendRequest(u.id)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold text-sm"
                                            >
                                                + Agregar
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
