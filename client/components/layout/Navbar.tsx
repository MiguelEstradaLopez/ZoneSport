import React from 'react';
import Link from 'next/link';
import { Home, Newspaper, Calendar, Users, UserCircle } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { name: 'Home', href: '/', icon: <Home size={20} /> },
    { name: 'Noticias', href: '/noticias', icon: <Newspaper size={20} /> },
    { name: 'Eventos', href: '/eventos', icon: <Calendar size={20} /> },
    { name: 'Social', href: '/social', icon: <Users size={20} /> },
  ];

  return (
    <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo ZoneSport */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-zs-blue">
              Zone<span className="text-zs-green">Sport</span>
            </span>
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
          <div className="flex items-center gap-4">
            <Link 
              href="/perfil" 
              className="p-2 text-gray-300 hover:text-zs-blue transition-colors"
              title="Mi Perfil"
            >
              <UserCircle size={28} />
            </Link>
            <button className="hidden sm:block bg-zs-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all">
              Login
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;