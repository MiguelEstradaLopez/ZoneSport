'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

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

  useEffect(() => {
    setShowDropdown(false);
    setShowMobileMenu(false);
  }, [pathname]);

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'U';
  const avatarLetter = (fullName[0] || 'U').toUpperCase();
  const avatarColorClass = getAvatarColorClass(fullName);

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
    <nav className="sticky top-0 left-0 w-full bg-zinc-900 border-b border-zinc-800 z-50" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-white hover:text-emerald-400 transition-all duration-200">
            Zone<span className="font-extrabold text-emerald-500">Sport</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const active = isActiveRoute(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 text-sm font-medium transition-all duration-200 ${active ? 'text-emerald-400' : 'text-zinc-300 hover:text-emerald-400'
                    } group`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-[2px] h-[2px] bg-emerald-400 transition-all duration-200 ${active ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/crear-evento"
                  className="hidden sm:inline-flex px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                >
                  + Crear torneo
                </Link>

                <button
                  type="button"
                  className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
                  aria-label="Notificaciones"
                >
                  <Bell size={20} />
                </button>

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

            <button
              type="button"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="md:hidden p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
              aria-label="Abrir menú"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-zinc-800 py-3 space-y-2">
            {NAV_LINKS.map((link) => {
              const active = isActiveRoute(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${active ? 'text-emerald-400 bg-zinc-800/70' : 'text-zinc-300 hover:text-emerald-400 hover:bg-zinc-800/60'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                href="/crear-evento"
                className="mt-1 inline-flex px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all duration-200"
              >
                + Crear torneo
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
