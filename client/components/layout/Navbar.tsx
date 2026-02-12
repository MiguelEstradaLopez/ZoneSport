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
        <div className="navbar-content">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="logo">
              Zone<span className="text-zs-green">Sport</span>
            </Link>
          </div>

          {/* Navegación (Desktop) */}
          <nav className="nav-links" aria-label="Navegación principal">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-item"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Sección de Usuario */}
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
                  className="btn-link hidden sm:block"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registrar"
                  className="btn btn-primary hidden sm:block"
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