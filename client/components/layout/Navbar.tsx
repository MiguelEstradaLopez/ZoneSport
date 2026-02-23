'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Newspaper, Calendar, Trophy, UserCircle, LogOut } from 'lucide-react';

import { type AuthUser, authService } from '@/services/authService';


const Navbar = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container flex items-center justify-between px-6 py-2">
        {/* IZQUIERDA: Logo y Eventos */}
        <div className="flex items-center gap-4">
          <Link href="/" className="logo text-2xl font-bold text-zs-green hover:text-zs-green transition-colors duration-200">
            Zone<span className="font-extrabold">Sport</span>
          </Link>
          <Link href="/eventos" className="btn btn-secondary text-base font-semibold px-6 py-2">
            Eventos
          </Link>
        </div>

        {/* DERECHA: Perfil o Login/Registro */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/perfil" title="Mi Perfil" aria-label="Mi Perfil" className="icon-button">
              <UserCircle size={32} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zonesport-link hover:text-zs-green font-semibold transition-colors duration-200"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registrar"
                className="bg-zonesport-blue hover:bg-zonesport-blue-hover text-white font-semibold px-4 py-2 rounded transition-colors duration-200"
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