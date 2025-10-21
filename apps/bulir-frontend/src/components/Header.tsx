'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, balance, role, logout } = useAuth();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isMounted) {
     return (
        <header className="shadow-md bg-white sticky top-0 z-10">
           <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">Bulir Services</Link>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
           </nav>
        </header>
     );
  }

  return (
    <header className="shadow-md bg-white sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
          Bulir Services
        </Link>

        <div className="flex space-x-6 items-center">

          {role === 'PROVIDER' && (
            <Link href="/manage" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Gerir Serviços
            </Link>
          )}

          {isAuthenticated && (
            <Link href="/history" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Histórico
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {role === 'CLIENT' && (
                <span className="text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full text-sm border border-green-200">
                  R$ {balance.toFixed(2)}
                </span>
              )}
              <span className="text-gray-700 text-sm font-semibold hidden sm:block">
                Olá, {user?.fullName.split(' ')[0]}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm transition"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition">
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
