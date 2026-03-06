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
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 64px)',
            overflow: 'hidden',
            backgroundColor: '#0d1117',
            marginTop: '64px'
        }}>
            {/* Columna Izquierda - Lista de Amigos */}
            <div style={{
                width: '280px',
                flexShrink: 0,
                backgroundColor: '#161b22',
                borderRight: '1px solid #30363d',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #30363d' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#22c55e' }}>
                        Mensajes
                    </h2>
                    <div style={{ position: 'relative' }}>
                        <Search style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#71717a'
                        }} size={18} />
                        <input
                            type="text"
                            placeholder="Buscar amigos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                paddingLeft: '40px',
                                paddingRight: '12px',
                                paddingTop: '8px',
                                paddingBottom: '8px',
                                borderRadius: '8px',
                                backgroundColor: '#0d1117',
                                border: '1px solid #30363d',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Lista de Amigos */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: '16px', color: '#a1a1aa', textAlign: 'center' }}>
                            Cargando amigos...
                        </div>
                    ) : filteredFriends.length === 0 ? (
                        <div style={{ padding: '16px', color: '#a1a1aa', textAlign: 'center' }}>
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
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        textAlign: 'left',
                                        border: 'none',
                                        borderBottom: '1px solid #30363d',
                                        backgroundColor: isSelected ? '#1e293b' : 'transparent',
                                        borderLeft: isSelected ? '4px solid #22c55e' : '4px solid transparent',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) e.currentTarget.style.backgroundColor = '#1e293b';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <div
                                        className={`${friend.profilePicture ? '' : avatarColor}`}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            flexShrink: 0,
                                            overflow: 'hidden',
                                            color: 'white'
                                        }}
                                    >
                                        {friend.profilePicture ? (
                                            <img
                                                src={friend.profilePicture}
                                                alt={friendName}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            avatarLetter
                                        )}
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <p style={{
                                            fontWeight: 'bold',
                                            color: 'white',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {friendName}
                                        </p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#94a3b8',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {friend.email}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Columna Derecha - Área de Chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {!selectedFriend ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <p style={{ color: '#a1a1aa', fontSize: '18px' }}>
                            Selecciona un amigo para chatear
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{
                            padding: '16px',
                            borderBottom: '1px solid #30363d',
                            backgroundColor: '#161b22'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div
                                    className={`${selectedFriend.profilePicture ? '' : getAvatarColorClass(getFriendName(selectedFriend))}`}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        color: 'white'
                                    }}
                                >
                                    {selectedFriend.profilePicture ? (
                                        <img
                                            src={selectedFriend.profilePicture}
                                            alt={getFriendName(selectedFriend)}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        (getFriendName(selectedFriend)[0] || 'U').toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: '600', color: 'white' }}>
                                        {getFriendName(selectedFriend)}
                                    </h3>
                                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                                        {selectedFriend.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Área de Mensajes */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            backgroundColor: '#0d1117',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            {messages.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    color: '#a1a1aa',
                                    paddingTop: '32px',
                                    paddingBottom: '32px'
                                }}>
                                    Inicia una conversación
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isOwn = msg.senderId === user?.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isOwn ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: '400px',
                                                    padding: '12px 16px',
                                                    borderRadius: '12px',
                                                    backgroundColor: isOwn ? '#22c55e' : '#1e293b',
                                                    color: 'white'
                                                }}
                                            >
                                                <p style={{ wordBreak: 'break-word', fontSize: '14px' }}>
                                                    {msg.content}
                                                </p>
                                                <p style={{
                                                    fontSize: '11px',
                                                    marginTop: '4px',
                                                    color: isOwn ? '#dcfce7' : '#94a3b8'
                                                }}>
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
                        <form
                            onSubmit={handleSendMessage}
                            style={{
                                borderTop: '1px solid #30363d',
                                backgroundColor: '#161b22',
                                padding: '12px 16px'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Escribe un mensaje..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value.slice(0, 500))}
                                    disabled={sendingMessage}
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        backgroundColor: '#0d1117',
                                        border: '1px solid #30363d',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || newMessage.length > 500 || sendingMessage}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        backgroundColor: '#22c55e',
                                        color: 'white',
                                        border: 'none',
                                        cursor: sendingMessage || !newMessage.trim() ? 'not-allowed' : 'pointer',
                                        opacity: sendingMessage || !newMessage.trim() ? 0.5 : 1
                                    }}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                                {newMessage.length}/500
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
