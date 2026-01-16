'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Newspaper, Calendar, Trophy, UserCircle, LogOut } from 'lucide-react';
import { authService } from '@/services/authService';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setShowDropdown(false);
    router.push('/');
  };

  const navItems = [
    { name: 'Home', href: '/', icon: <Home size={20} /> },
    { name: 'Noticias', href: '/noticias', icon: <Newspaper size={20} /> },
    { name: 'Eventos', href: '/eventos', icon: <Calendar size={20} /> },
    { name: 'Clasificación', href: '/clasificacion', icon: <Trophy size={20} /> },
  ];

  return (
    <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo ZoneSport */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-zs-blue cursor-pointer hover:opacity-80">
              Zone<span className="text-zs-green">Sport</span>
            </Link>
          </div>

          {/* Links de Navegación (Desktop) */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-300 hover:text-zs-green transition-colors font-medium"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Perfil / Acceso */}
          <div className="flex items-center gap-4 relative">
            {user ? (
              <>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 text-gray-300 hover:text-zs-blue transition-colors"
                  title="Mi Perfil"
                >
                  <UserCircle size={28} />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute top-14 right-0 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 min-w-48">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="text-sm text-gray-300 font-semibold">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-zs-blue transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      href="/crear-evento"
                      className="block px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-zs-green transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Crear Evento
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-gray-300 hover:text-zs-blue px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registrar"
                  className="hidden sm:block bg-zs-green hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
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