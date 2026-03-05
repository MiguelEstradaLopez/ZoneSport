'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Send, Search } from 'lucide-react';

interface Friend {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profilePicture?: string;
}

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface Conversation {
    userId: string;
    lastMessage: Message;
}

const AVATAR_COLORS = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-violet-500',
    'bg-fuchsia-500',
    'bg-cyan-500',
    'bg-teal-500',
];

function getAvatarColorClass(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function ChatsPage() {
    const { user } = useAuth();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cargar amigos
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoading(true);
                const response = await api.get('/friendships');
                setFriends(response.data || []);
            } catch (err) {
                console.error('Error cargando amigos:', err);
                setFriends([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    // Cargar mensajes de la conversación seleccionada
    useEffect(() => {
        if (!selectedFriend) {
            setMessages([]);
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            return;
        }

        const fetchMessages = async () => {
            try {
                const response = await api.get(`/chats/conversation/${selectedFriend.id}`, {
                    params: { limit: 50 },
                });
                setMessages(response.data || []);
            } catch (err) {
                console.error('Error cargando mensajes:', err);
                setMessages([]);
            }
        };

        fetchMessages();

        // Polling cada 3 segundos
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }
        pollingIntervalRef.current = setInterval(fetchMessages, 3000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [selectedFriend]);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFriend || !newMessage.trim() || newMessage.length > 500) {
            return;
        }

        setSendingMessage(true);
        try {
            await api.post('/chats/send', {
                receiverId: selectedFriend.id,
                content: newMessage.trim(),
            });
            setNewMessage('');

            // Recargar mensajes inmediatamente
            const response = await api.get(`/chats/conversation/${selectedFriend.id}`, {
                params: { limit: 50 },
            });
            setMessages(response.data || []);
        } catch (err) {
            console.error('Error enviando mensaje:', err);
        } finally {
            setSendingMessage(false);
        }
    };

    const filteredFriends = friends.filter(
        (friend) =>
            `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const getFriendName = (friend: Friend) => {
        return `${friend.firstName} ${friend.lastName}`.trim() || friend.email;
    };

    return (
        <main className="min-h-screen bg-zinc-900 text-zinc-100 pt-20 md:pt-24">
            <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] flex flex-col md:flex-row">
                {/* Columna Izquierda - Lista de Amigos */}
                <div className="w-full md:w-80 bg-zinc-800 border-r border-zinc-700 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-zinc-700">
                        <h2 className="text-xl font-bold mb-4">Mensajes</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar amigos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Lista de Amigos */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-zinc-400 text-center">Cargando amigos...</div>
                        ) : filteredFriends.length === 0 ? (
                            <div className="p-4 text-zinc-400 text-center">
                                {friends.length === 0 ? 'No tienes amigos aún' : 'No se encontraron resultados'}
                            </div>
                        ) : (
                            filteredFriends.map((friend) => {
                                const friendName = getFriendName(friend);
                                const avatarLetter = (friendName[0] || 'U').toUpperCase();
                                const avatarColor = getAvatarColorClass(friendName);
                                const isSelected = selectedFriend?.id === friend.id;

                                return (
                                    <button
                                        key={friend.id}
                                        onClick={() => setSelectedFriend(friend)}
                                        className={`w-full p-4 border-b border-zinc-700 text-left transition flex items-center gap-3 ${isSelected
                                                ? 'bg-emerald-500/20 border-l-4 border-l-emerald-500'
                                                : 'hover:bg-zinc-700/50'
                                            }`}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden ${friend.profilePicture ? '' : avatarColor
                                                }`}
                                        >
                                            {friend.profilePicture ? (
                                                <img
                                                    src={friend.profilePicture}
                                                    alt={friendName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                avatarLetter
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-white truncate">{friendName}</p>
                                            <p className="text-xs text-zinc-400 truncate">{friend.email}</p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Columna Derecha - Área de Chat */}
                <div className="hidden md:flex flex-1 flex-col bg-zinc-900 overflow-hidden">
                    {!selectedFriend ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-zinc-400">
                                <p className="text-lg">Selecciona un amigo para chatear</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-zinc-700 bg-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden ${selectedFriend.profilePicture ? '' : getAvatarColorClass(getFriendName(selectedFriend))
                                            }`}
                                    >
                                        {selectedFriend.profilePicture ? (
                                            <img
                                                src={selectedFriend.profilePicture}
                                                alt={getFriendName(selectedFriend)}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            (getFriendName(selectedFriend)[0] || 'U').toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{getFriendName(selectedFriend)}</h3>
                                        <p className="text-xs text-zinc-400">{selectedFriend.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Área de Mensajes */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-zinc-400 py-8">
                                        Inicia una conversación
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isOwn = msg.senderId === user?.id;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn
                                                            ? 'bg-emerald-500 text-white rounded-br-none'
                                                            : 'bg-zinc-700 text-zinc-100 rounded-bl-none'
                                                        }`}
                                                >
                                                    <p className="break-words text-sm">{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${isOwn ? 'text-emerald-100' : 'text-zinc-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString('es-CO', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input de Mensaje */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-700 bg-zinc-800">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Escribe un mensaje..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value.slice(0, 500))}
                                        disabled={sendingMessage}
                                        className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || newMessage.length > 500 || sendingMessage}
                                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-400 mt-2">
                                    {newMessage.length}/500
                                </p>
                            </form>
                        </>
                    )}
                </div>

                {/* Vista móvil - Mostrar solo si hay seleccionado un amigo */}
                {selectedFriend && (
                    <div className="md:hidden absolute inset-0 bg-zinc-900 z-10 flex flex-col pt-20">
                        {/* Header Móvil */}
                        <div className="p-4 border-b border-zinc-700 bg-zinc-800">
                            <button
                                onClick={() => setSelectedFriend(null)}
                                className="text-blue-400 mb-4 text-sm font-medium"
                            >
                                ← Atrás
                            </button>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden ${selectedFriend.profilePicture ? '' : getAvatarColorClass(getFriendName(selectedFriend))
                                        }`}
                                >
                                    {selectedFriend.profilePicture ? (
                                        <img
                                            src={selectedFriend.profilePicture}
                                            alt={getFriendName(selectedFriend)}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        (getFriendName(selectedFriend)[0] || 'U').toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{getFriendName(selectedFriend)}</h3>
                                    <p className="text-xs text-zinc-400">{selectedFriend.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Área de Mensajes Móvil */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-zinc-400 py-8">
                                    Inicia una conversación
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isOwn = msg.senderId === user?.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs px-4 py-2 rounded-lg ${isOwn
                                                        ? 'bg-emerald-500 text-white rounded-br-none'
                                                        : 'bg-zinc-700 text-zinc-100 rounded-bl-none'
                                                    }`}
                                            >
                                                <p className="break-words text-sm">{msg.content}</p>
                                                <p className={`text-xs mt-1 ${isOwn ? 'text-emerald-100' : 'text-zinc-400'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString('es-CO', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Móvil */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-700 bg-zinc-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Escribe un mensaje..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value.slice(0, 500))}
                                    disabled={sendingMessage}
                                    className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || newMessage.length > 500 || sendingMessage}
                                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <p className="text-xs text-zinc-400 mt-2">
                                {newMessage.length}/500
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
