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
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Izquierda */}
        <Link href="/" className="logo text-2xl font-bold text-zonesport-lime hover:text-zonesport-lime transition-colors duration-200 ml-6">
          Zone<span className="font-extrabold">Sport</span>
        </Link>

        {/* Navegación - Centro */}
        <nav className="nav-links hidden md:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-1.5 text-gray-400 hover:text-zonesport-lime transition-colors duration-200"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sección de Usuario - Derecha */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <>
              {/* Botón Perfil */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="icon-button"
                title="Mi Perfil"
                aria-label="Abrir menú de perfil"
              >
                <UserCircle size={28} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="nav-dropdown">
                  <div className="card-header">
                    <p className="text-sm text-zs-text font-semibold">{user.email}</p>
                    <p className="text-xs text-zs-text-secondary capitalize">{user.role}</p>
                  </div>
                  <div className="space-y-0">
                    <Link
                      href="/perfil"
                      className="menu-item-top"
                      onClick={() => setShowDropdown(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      href="/crear-evento"
                      className="menu-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Crear Evento
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="menu-item-bottom flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zonesport-link hover:text-zonesport-lime font-semibold transition-colors duration-200 hidden sm:block"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registrar"
                className="bg-zonesport-blue hover:bg-zonesport-blue-hover text-white font-semibold px-4 py-2 rounded transition-colors duration-200 hidden sm:block"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;