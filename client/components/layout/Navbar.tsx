'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('profile_picture');
      if (stored) setProfilePicture(stored);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'U';
  const avatarLetter = (fullName[0] || 'U').toUpperCase();
  const avatarColorClass = getAvatarColorClass(fullName);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-zinc-900 border-b border-zinc-800 z-50" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-white hover:text-emerald-400 transition-all duration-200">
            Zone<span className="font-extrabold text-emerald-500">Sport</span>
          </Link>

          {/* Centro - Enlaces */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/eventos"
              className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
            >
              Eventos
            </Link>
            <Link
              href="/noticias"
              className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
            >
              Noticias
            </Link>
            {isAuthenticated && (
              <Link
                href="/crear-evento"
                className="ml-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Crear evento
              </Link>
            )}
          </div>

          {/* Derecha - Usuario */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notificaciones */}
                <button
                  type="button"
                  className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
                  aria-label="Notificaciones"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Avatar + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 hover:bg-zinc-800 rounded-lg transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Avatar"
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-sm font-bold text-white ${avatarColorClass}`}>
                          {avatarLetter}
                        </div>
                      )}
                    </div>
                    <ChevronDown size={16} className="text-zinc-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-zinc-700">
                        <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                        <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                      </div>

                      <Link
                        href="/perfil"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200"
                      >
                        <User size={16} />
                        Mi perfil
                      </Link>

                      <Link
                        href="/configuracion"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200"
                      >
                        <Settings size={16} />
                        Configuración
                      </Link>

                      <div className="border-t border-zinc-700 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-700 hover:text-red-300 transition-all duration-200"
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
                  className="px-4 py-2 text-zinc-300 hover:text-white transition-all duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registrar"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
