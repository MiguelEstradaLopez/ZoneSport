'use client';
import React from 'react';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-container flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-4">
          <Link href="/" className="logo text-2xl font-bold text-zs-green hover:text-zs-green transition-colors duration-200">
            Zone<span className="font-extrabold">Sport</span>
          </Link>
          <Link href="/eventos" className="btn btn-secondary text-base font-semibold px-6 py-2">
            Eventos
          </Link>
          <Link href="/noticias" className="btn btn-secondary text-base font-semibold px-6 py-2">
            Noticias
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/perfil" title="Mi Perfil" aria-label="Mi Perfil" className="icon-button">
              <UserCircle size={32} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-zonesport-link hover:text-zs-green font-semibold transition-colors duration-200">
                Iniciar Sesión
              </Link>
              <Link href="/registrar" className="bg-zonesport-blue hover:bg-zonesport-blue-hover text-white font-semibold px-4 py-2 rounded transition-colors duration-200">
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
