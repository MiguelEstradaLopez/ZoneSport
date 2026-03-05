'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/services/api';

interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

const AVATAR_COLORS = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#d946ef', // fuchsia-500
  '#06b6d4', // cyan-500
  '#14b8a6', // teal-500
];

function getAvatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Torneos', href: '/eventos' },
  { label: 'Social', href: '/social' },
  { label: 'Chats', href: '/chats' },
  { label: 'Noticias', href: '/noticias' },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (user?.profilePicture) {
      setProfilePicture(user.profilePicture);
    } else {
      setProfilePicture(null);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    setShowDropdown(false);
    setShowMobileMenu(false);
  }, [pathname]);

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'U';
  const avatarLetter = (fullName[0] || 'U').toUpperCase();
  const avatarColor = getAvatarColor(fullName);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowMobileMenu(false);
    router.push('/login');
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#18181b',
        borderBottom: '1px solid #27272a',
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          <Link
            href="/"
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
          >
            Zone<span style={{ fontWeight: 900, color: '#10b981' }}>Sport</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {NAV_LINKS.map((link) => {
              const active = isActiveRoute(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    position: 'relative',
                    paddingBottom: '4px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: active ? '#10b981' : '#d4d4d8',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    borderBottom: active ? '2px solid #10b981' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = active ? '#10b981' : '#d4d4d8')}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated ? (
              <>
                {/* Notificaciones Container */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      padding: '8px',
                      color: '#a1a1aa',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.backgroundColor = '#27272a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#a1a1aa';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label="Notificaciones"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '60px',
                        width: '360px',
                        maxHeight: '400px',
                        backgroundColor: '#27272a',
                        border: '1px solid #3f3f46',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px rgba(0,0,0,0.3)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #3f3f46',
                          fontWeight: 600,
                          color: 'white',
                        }}
                      >
                        Notificaciones
                      </div>

                      {loadingNotifications ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#a1a1aa' }}>
                          Cargando...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#a1a1aa' }}>
                          Sin notificaciones
                        </div>
                      ) : (
                        <div style={{ overflowY: 'auto', maxHeight: '320px' }}>
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid #3f3f46',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                backgroundColor: notif.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.1)',
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: '13px',
                                    color: notif.isRead ? '#a1a1aa' : 'white',
                                    fontWeight: notif.isRead ? 400 : 500,
                                  }}
                                >
                                  {notif.message}
                                </p>
                                <p
                                  style={{
                                    margin: '4px 0 0 0',
                                    fontSize: '11px',
                                    color: '#71717a',
                                  }}
                                >
                                  {new Date(notif.createdAt).toLocaleDateString('es-ES', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              {!notif.isRead && (
                                <button
                                  type="button"
                                  onClick={() => markAsRead(notif.id)}
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    whiteSpace: 'nowrap',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                                >
                                  Marcar
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#27272a')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #10b981',
                      }}
                    >
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Avatar"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: avatarColor,
                          }}
                        >
                          {avatarLetter}
                        </div>
                      )}
                    </div>
                    <ChevronDown size={16} style={{ color: '#a1a1aa' }} />
                  </button>

                  {showDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        marginTop: '8px',
                        width: '224px',
                        backgroundColor: '#27272a',
                        border: '1px solid #3f3f46',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px rgba(0,0,0,0.3)',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                      }}
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid #3f3f46' }}>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'white',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            margin: 0,
                          }}
                        >
                          {fullName}
                        </p>
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#a1a1aa',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            margin: 0,
                            marginTop: '2px',
                          }}
                        >
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        href="/perfil"
                        onClick={() => setShowDropdown(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 16px',
                          fontSize: '14px',
                          color: '#d4d4d8',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#3f3f46';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#d4d4d8';
                        }}
                      >
                        <User size={16} />
                        Mi perfil
                      </Link>

                      <div style={{ borderTop: '1px solid #3f3f46', marginTop: '4px', paddingTop: '4px' }}>
                        <button
                          type="button"
                          onClick={handleLogout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#f87171',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#3f3f46';
                            e.currentTarget.style.color = '#fca5a5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#f87171';
                          }}
                        >
                          <LogOut size={16} />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: '8px 16px',
                    color: '#d4d4d8',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#d4d4d8')}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registrar"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                >
                  Registrarse
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              style={{
                display: 'none',
                padding: '8px',
                color: '#d4d4d8',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              aria-label="Abrir menú"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div style={{ borderTop: '1px solid #27272a', padding: '12px 0' }}>
            {NAV_LINKS.map((link) => {
              const active = isActiveRoute(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'block',
                    padding: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: active ? '#10b981' : '#d4d4d8',
                    backgroundColor: active ? 'rgba(39,39,42,0.7)' : 'transparent',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    marginBottom: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
